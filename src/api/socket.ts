export const socket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:3000", {
  auth: { token: localStorage.getItem("token") },
});