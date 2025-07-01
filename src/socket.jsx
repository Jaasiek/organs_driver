import { io } from "socket.io-client";

const socket = io("http://192.168.6.19:2137"); // or your server IP

export default socket;
