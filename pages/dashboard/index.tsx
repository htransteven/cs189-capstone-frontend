import { PostTextCommand } from "@aws-sdk/client-lex-runtime-service";
import React, { useState } from "react";
import {
  useLexClient,
  LexClientProvider,
} from "../../contexts/LexClientContext";

const Index = () => {
  const lexClient = useLexClient();

  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setChatHistory((prev) => [...prev, input]);
    const lexParams = {
      botAlias: process.env.NEXT_PUBLIC_BOT_ALIAS,
      botName: process.env.NEXT_PUBLIC_BOT_NAME,
      inputText: input,
      userId: "chatbot-demo-stevno", // For example, 'chatbot-demo'. generate randomly
    };
    try {
      const data = await lexClient.send(new PostTextCommand(lexParams));
      setChatHistory((prev) => [...prev, data.message]);
      console.log("Success. Response is: ", data.message);
    } catch (err) {
      console.log("Error responding to message. ", err);
    }
    setInput("");
  };

  return (
    <LexClientProvider>
      <form onSubmit={sendMessage}>
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button type={"submit"}>Test</button>
      </form>
      {chatHistory.map((message, index) => (
        <div key={`message-${index}`}>{message}</div>
      ))}
    </LexClientProvider>
  );
};

export default Index;
