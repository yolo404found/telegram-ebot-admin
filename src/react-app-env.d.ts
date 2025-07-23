/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_API_URL: string;
    REACT_APP_SOCKET_URL: string;
    REACT_APP_JWT_SECRET: string;
  }
}