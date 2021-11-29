import { PostTextCommand } from "@aws-sdk/client-lex-runtime-service";
import ReactDOM from "react-dom";
import { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { pallete } from "../styles";
import { LexClientProvider, useLexClient } from "../contexts/LexClientContext";
import { format } from "date-fns";

const Wrapper = styled.div`
  position: absolute;
  bottom: 30px;
  right: 30px;
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-end;
  justify-content: flex-end;
`;

const Button = styled.div<{ isOpen: boolean }>`
  height: 60px;
  width: 60px;
  background-color: ${pallete.purple};
  border-radius: ${({ isOpen }) => (isOpen ? "50% 50% 50% 0" : "50%")};
  color: ${pallete.white};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 2px 4px 3px rgb(100, 100, 100, 25%);
  opacity: 0.85;
  margin-left: 10px;
  transition: 0.25s all;

  &:hover {
    cursor: pointer;
    opacity: 1;
  }
`;

const ChatWindow = styled.div<{ isOpen: boolean }>`
  display: flex;
  flex-flow: column nowrap;
  width: 400px;
  height: 600px;
  background-color: ${pallete.chatbot.background};
  border-radius: 20px 20px 0 20px;
  padding: 15px;
  box-shadow: ${({ isOpen }) =>
    isOpen ? "0px 2px 4px 3px rgb(100, 100, 100, 25%)" : "none"};

  overflow: hidden;
  max-width: ${({ isOpen }) => (isOpen ? "1000px" : "0px")};
  max-height: ${({ isOpen }) => (isOpen ? "1000px" : "0px")};
  transition: 0.25s all ease-out;
`;

export interface ChatEntry {
  message: string;
  timestamp: number;
  sender: "user" | "bot";
}

const ChatHistory = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex-flow: column nowrap;
  overflow-y: scroll;
  margin: 10px 0;
  padding-right: 10px;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${pallete.chatbot.secondaryText};
    border-radius: 10px;
  }
`;

const ChatForm = styled.form`
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
`;

const ChatControls = styled.div`
  display: flex;
  width: 100%;
  & > textarea {
    height: 60px;
    width: 100%;
    padding: 10px;
    resize: none;
    border-radius: 10px;
    border: none;
    outline: none;
    background-color: ${pallete.chatbot.backgroundSecondary};
    font-family: Arial, Helvetica, sans-serif;
  }

  & > button[type="submit"] {
    width: 80px;
    margin-left: 10px;
    border: none;
    background-color: ${pallete.blue};
    color: ${pallete.white};
    border-radius: 6px;
    opacity: 0.8;

    transition: 0.2s opacity linear;

    &:hover {
      cursor: pointer;
      opacity: 1;
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
`;

const MessageWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  margin-bottom: 12px;
`;

const MessageMeta = styled.div<{ fromUser: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: ${({ fromUser }) => (fromUser ? "flex-start" : "flex-end")};
  width: 100%;
  margin-bottom: 3px;
`;

const MessageTimestamp = styled.span`
  color: ${pallete.chatbot.secondaryText};
  font-size: 0.7rem;
`;
const MessagePayload = styled.pre<{ fromUser: boolean }>`
  font-family: inherit;
  white-space: pre-wrap;
  background-color: ${({ fromUser }) =>
    fromUser ? pallete.chatbot.backgroundSecondary : pallete.purple};
  color: ${({ fromUser }) =>
    fromUser ? pallete.chatbot.primaryText : pallete.white};
  padding: 15px;
  border-radius: ${({ fromUser }) =>
    fromUser ? "0px 15px 15px 15px" : "15px 0px 15px 15px"};
  align-self: ${({ fromUser }) => (fromUser ? "flex-start" : "flex-end")};
  max-width: 80%;
`;

const blinkingAnimation = keyframes`
    from {
        opacity: 0.3;
    }

    to {
        opacity: 0.8
    }
`;

const ThinkingAnimationWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  & > div {
    height: 10px;
    width: 10px;
    background-color: rgba(180, 180, 180, 0.8);
    border-radius: 50%;
    margin: 0 4px;
    animation: ${blinkingAnimation} 1s alternate infinite;

    &:first-of-type {
      margin-left: 0;
    }
    &:last-of-type {
      margin-right: 0;
    }
  }
`;

const ThinkingAnimation = () => {
  return (
    <ThinkingAnimationWrapper>
      <div style={{ animationDelay: "0" }} />
      <div style={{ animationDelay: "0.5s" }} />
      <div style={{ animationDelay: "1s" }} />
    </ThinkingAnimationWrapper>
  );
};

export const ChatMessage: React.FC<ChatEntry> = ({
  message,
  timestamp,
  sender,
}) => {
  return (
    <MessageWrapper>
      <MessageMeta fromUser={sender === "user"}>
        <MessageTimestamp>
          {format(timestamp, "hh:mm:ss aaaa")}
        </MessageTimestamp>
      </MessageMeta>
      <MessagePayload fromUser={sender === "user"}>{message}</MessagePayload>
    </MessageWrapper>
  );
};

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const lexClient = useLexClient();

  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);
  const [thinking, setThinking] = useState(false);
  const chatLogRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen || chatHistory.length > 0) return;

    setChatHistory([
      {
        message: "Hello and welcome to Scribe! How may I help you?",
        sender: "bot",
        timestamp: Date.now(),
      },
    ]);
  }, [isOpen, chatHistory]);

  useEffect(() => {
    if (!chatLogRef.current) return;
    chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
  }, [chatHistory]);

  useEffect(() => {
    if (!containerRef.current || !isOpen) return;

    const handleClick = (e: MouseEvent) => {
      console.log(e.target, e.currentTarget);
      for (let elem of e.composedPath()) {
        if (elem === containerRef.current) return;
      }
      setIsOpen(false);
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [isOpen]);

  const handleTextAreaKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage(e);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.length === 0) return;

    setChatHistory((prev) => [
      ...prev,
      { message: input, timestamp: Date.now(), sender: "user" },
    ]);
    setInput("");
    const lexParams = {
      botAlias: process.env.NEXT_PUBLIC_BOT_ALIAS,
      botName: process.env.NEXT_PUBLIC_BOT_NAME,
      inputText: input,
      userId: "chatbot-demo-stevno", // For example, 'chatbot-demo'. generate randomly
    };
    setThinking(true);
    try {
      const data: any = await lexClient.send(new PostTextCommand(lexParams));
      setChatHistory((prev) => [
        ...prev,
        {
          message: data.message || "Undefined response",
          timestamp: Date.now(),
          sender: "bot",
        },
      ]);
      console.log("Success. Response is: ", data.message);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        {
          message: "Sorry it looks like something went wrong!",
          timestamp: Date.now(),
          sender: "bot",
        },
      ]);
      console.log("Error responding to message. ", err);
    }
    setThinking(false);
  };

  const handleButtonClick = () => {
    setIsOpen((prev) => !prev);
  };

  if (typeof window === "undefined") return null;

  return ReactDOM.createPortal(
    <Wrapper>
      <LexClientProvider>
        <ChatWindow isOpen={isOpen} ref={containerRef}>
          <ChatForm onSubmit={sendMessage}>
            <ChatHistory ref={chatLogRef}>
              {chatHistory.map((message, index) => (
                <ChatMessage key={`message-${index}`} {...message} />
              ))}
              {thinking && <ThinkingAnimation />}
            </ChatHistory>
            <ChatControls>
              <textarea
                value={input}
                onKeyPress={handleTextAreaKeyPress}
                onChange={(e) => setInput(e.target.value.replace(/\n/g, ""))}
                placeholder={"Enter a message"}
              />
              <button type={"submit"} disabled={input.length === 0}>
                Send
              </button>
            </ChatControls>
          </ChatForm>
        </ChatWindow>
        <Button isOpen={isOpen} onClick={handleButtonClick}>
          {isOpen ? "X" : "B"}
        </Button>
      </LexClientProvider>
    </Wrapper>,
    document.body
  );
};
