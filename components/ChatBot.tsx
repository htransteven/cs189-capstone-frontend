import {
  PostTextCommand,
  DeleteSessionCommand,
  PostTextCommandInput,
} from "@aws-sdk/client-lex-runtime-service";
import ReactDOM from "react-dom";
import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { pallete } from "../styles";
import { LexClientProvider, useLexClient } from "../contexts/LexClientContext";
import { format } from "date-fns";
import { useUser } from "../contexts/UserContext";

const Wrapper = styled.div<{ isOpen: boolean }>`
  position: absolute;
  bottom: 30px;
  right: 30px;
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-end;
  justify-content: flex-end;
  width: ${({ isOpen }) => (isOpen ? "calc(100vw - 60px)" : "0px")};
  height: ${({ isOpen }) => (isOpen ? "calc(100vh - 60px)" : "0px")};
`;

const Button = styled.div<{ isOpen: boolean }>`
  height: 60px;
  min-height: 60px;
  width: 60px;
  min-width: 60px;
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

const ChatWindow = styled.div<{ isOpen: boolean; magnify: boolean }>`
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  height: 100%;
  background-color: ${pallete.chatbot.background};
  border-radius: 20px 20px 0 20px;
  box-shadow: ${({ isOpen }) =>
    isOpen ? "0px 2px 4px 3px rgb(100, 100, 100, 25%)" : "none"};

  overflow: hidden;
  max-width: ${({ isOpen, magnify }) =>
    isOpen ? (magnify ? "100vw" : "400px") : "0px"};
  max-height: ${({ isOpen, magnify }) =>
    isOpen ? (magnify ? "100vh" : "600px") : "0px"};
  transition: 0.3s all ease-out;
`;

export interface LineItem {
  value: string;
  onClick?: (item: LineItem) => void;
}

export interface ChatEntry {
  message: string;
  timestamp: number;
  sender: "user" | "bot";
  lineItems?: LineItem[];
  lineItemSelected?: boolean;
}

const ChatHistory = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex-flow: column nowrap;
  overflow-y: scroll;
  margin: 10px 0 0 0;
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

const ChatFormHeader = styled.div`
  background-color: ${pallete.purple};
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;

  & > span {
    color: ${pallete.white};
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.1rem;
  }
`;

const ChatWindowControls = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center; ;
`;

const ResetChatButton = styled.div`
  color: ${pallete.white};
  font-weight: 600;
  border: 2px solid ${pallete.white};
  padding: 4px 16px;
  border-radius: 30px;
  opacity: 0.6;
  transition: 0.15s opacity linear;
  margin-right: 10px;

  &:hover {
    opacity: 1;
    cursor: pointer;
  }
`;

const ExpandChatButton = styled.div`
  color: ${pallete.white};
  font-weight: 600;
  border: 2px solid ${pallete.white};
  padding: 4px 16px;
  border-radius: 30px;
  opacity: 0.6;
  transition: 0.15s opacity linear;

  &:hover {
    opacity: 1;
    cursor: pointer;
  }
`;

const ChatForm = styled.form`
  height: 100%;
  display: flex;
  flex-flow: column nowrap;

  & > * {
    padding: 15px;
  }
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
  justify-content: ${({ fromUser }) => (fromUser ? "flex-end" : "flex-start")};
  width: 100%;
  margin-bottom: 3px;
`;

const MessageTimestamp = styled.span<{ magnify: boolean }>`
  color: ${pallete.chatbot.secondaryText};
  font-size: ${({ magnify }) => (magnify ? "1rem" : "0.7rem")};
`;
const MessagePayload = styled.pre<{ fromUser: boolean; magnify: boolean }>`
  margin: 0;
  font-family: inherit;
  white-space: pre-wrap;
  background-color: ${({ fromUser }) =>
    fromUser ? pallete.chatbot.backgroundSecondary : pallete.purple};
  color: ${({ fromUser }) =>
    fromUser ? pallete.chatbot.primaryText : pallete.white};
  padding: 15px;
  border-radius: ${({ fromUser }) =>
    fromUser ? "15px 0px 15px 15px" : "0px 15px 15px 15px"};
  align-self: ${({ fromUser }) => (fromUser ? "flex-end" : "flex-start")};
  max-width: 80%;
  font-size: ${({ magnify }) => (magnify ? "1.2rem" : "1rem")};
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

const PayloadLineItemHeader = styled.span`
  font-size: 0.9rem;
  color: ${pallete.textSecondary};
  margin: 5px 0;
`;

const PayloadLineItem = styled.div`
  margin: 0;
  font-family: inherit;
  font-size: 0.9rem;
  white-space: pre-wrap;
  background-color: ${pallete.chatbot.backgroundSecondary};
  color: ${pallete.chatbot.primaryText};
  padding: 5px 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  align-self: flex-start;
  max-width: 80%;
  transition: 0.1s all linear;

  &:hover {
    cursor: pointer;
    box-shadow: 0px 0px 5px 2px rgba(44, 20, 20, 0.25);
  }
`;

export const ChatMessage: React.FC<ChatEntry & { magnify: boolean }> = ({
  message,
  timestamp,
  sender,
  lineItems,
  lineItemSelected,
  magnify,
}) => {
  return (
    <MessageWrapper>
      <MessageMeta fromUser={sender === "user"}>
        <MessageTimestamp magnify={magnify}>
          {format(timestamp, "hh:mm:ss aaaa")}
        </MessageTimestamp>
      </MessageMeta>
      <MessagePayload fromUser={sender === "user"} magnify={magnify}>
        {message}
      </MessagePayload>
      {!lineItemSelected && lineItems?.length > 0 && (
        <PayloadLineItemHeader>Please select an option</PayloadLineItemHeader>
      )}
      {!lineItemSelected &&
        lineItems?.length > 0 &&
        lineItems.map((li, index) => (
          <PayloadLineItem
            key={`${index}-${li}`}
            onClick={() => li.onClick(li)}
          >
            {li.value}
          </PayloadLineItem>
        ))}
    </MessageWrapper>
  );
};

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const lexClient = useLexClient();

  const user = useUser();

  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);
  const [thinking, setThinking] = useState(false);
  const [magnify, setMagnify] = useState(false);
  const [userId] = useState(user.sub);
  const chatLogRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen || chatHistory.length > 0) return;

    setChatHistory([
      {
        message: `Hello and welcome to BRAD!\nYour chat session ID is #${userId}.\nHow may I help you?`,
        sender: "bot",
        timestamp: Date.now(),
      },
    ]);
  }, [isOpen, chatHistory, userId]);

  useEffect(() => {
    if (!chatLogRef.current) return;
    chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
  }, [chatHistory]);

  useEffect(() => {
    if (!containerRef.current || !isOpen) return;

    const handleClick = (e: MouseEvent) => {
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
      sendMessage();
    }
  };

  const handleResetButtonClick = async () => {
    try {
      const res: any = await lexClient.send(
        new DeleteSessionCommand({
          botAlias: process.env.NEXT_PUBLIC_BOT_ALIAS,
          botName: process.env.NEXT_PUBLIC_BOT_NAME,
          userId: `${userId}`,
        })
      );
    } catch (err) {
      console.log("Failed to delete session", err);
      return;
    }
    setChatHistory([]);
    setInput("");
  };

  const sendMessage = async (message = input) => {
    if (message.length === 0) return;

    setChatHistory((prev) => [
      ...prev,
      { message, timestamp: Date.now(), sender: "user" },
    ]);
    setInput("");
    const lexParams: PostTextCommandInput = {
      botAlias: process.env.NEXT_PUBLIC_BOT_ALIAS,
      botName: process.env.NEXT_PUBLIC_BOT_NAME,
      inputText: input,
      userId: `${userId}`,
      sessionAttributes: { userId },
    };
    setThinking(true);
    try {
      const data: any = await lexClient.send(new PostTextCommand(lexParams));
      const [mainMessage, lineItems] = data.message.split("\noptions\n");
      setChatHistory((prev) => {
        const messageIndex = prev.length;
        return [
          ...prev,
          {
            message: mainMessage,
            timestamp: Date.now(),
            sender: "bot",
            lineItems: lineItems?.split("\n").map((li: string) => ({
              value: li,
              onClick: () => {
                setChatHistory((prev) => {
                  const copy = [...prev];
                  copy[messageIndex].lineItemSelected = true;
                  return copy;
                });
                sendMessage(li.charAt(0));
              },
            })),
          },
        ];
      });
      //console.log("Success. Response is: ", data.message);
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
    <Wrapper isOpen={isOpen}>
      <LexClientProvider>
        <ChatWindow isOpen={isOpen} magnify={magnify} ref={containerRef}>
          <ChatForm
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <ChatFormHeader>
              <span>BRAD Chat Bot</span>
              <ChatWindowControls>
                <ResetChatButton onClick={handleResetButtonClick}>
                  Reset
                </ResetChatButton>
                <ExpandChatButton onClick={() => setMagnify((prev) => !prev)}>
                  {magnify ? "Collapse" : "Expand"}
                </ExpandChatButton>
              </ChatWindowControls>
            </ChatFormHeader>
            <ChatHistory ref={chatLogRef}>
              {chatHistory.map((message, index) => (
                <ChatMessage
                  key={`message-${index}`}
                  {...message}
                  magnify={magnify}
                />
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
