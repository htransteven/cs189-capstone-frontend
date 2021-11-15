import { createContext, useContext, useState } from "react";
import { LexRuntimeServiceClient } from "@aws-sdk/client-lex-runtime-service";

const LexClientContext = createContext<LexRuntimeServiceClient | null>(null);

export const useLexClient = () => {
  const client = useContext(LexClientContext);

  if (client === null) throw new Error("no AWS Lex client");

  return client;
};

export const LexClientProvider = ({ children }) => {
  const [client] = useState(
    new LexRuntimeServiceClient({ region: "us-west-2" })
  );

  return (
    <LexClientContext.Provider value={client}>
      {children}
    </LexClientContext.Provider>
  );
};
