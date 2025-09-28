import { io } from "socket.io-client";

// const socket = io("http://192.168.6.20:2137"); // or your server IP
// const socket = io("http://192.168.6.24:2137"); // or your server IP
// const socket = io("http://192.168.0.41:2137");
// const socket = io("http://192.168.0.53:2137");
const socket = io("http://192.168.0.3:2137");
// const socket = io("http://192.168.6.48:2137");
export default socket;
