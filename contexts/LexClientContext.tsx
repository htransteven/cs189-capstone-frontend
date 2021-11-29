import { createContext, useContext } from "react";
import { LexRuntimeServiceClient } from "@aws-sdk/client-lex-runtime-service";

const lexClient = new LexRuntimeServiceClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  },
});

const LexClientContext = createContext(lexClient);

export const useLexClient = () => {
  const client = useContext(LexClientContext);
  return client;
};

export const LexClientProvider = ({ children }) => {
  return (
    <LexClientContext.Provider value={lexClient}>
      {children}
    </LexClientContext.Provider>
  );
};
