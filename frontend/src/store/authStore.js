import { create } from "zustand";
import axios from "axios";
import { io } from "socket.io-client";

const API_URL =
  import.meta.env.MODE === "development" ? "http://localhost:8000" : "/";
axios.defaults.withCredentials = true;

export const useAuthStore = create((set, get) => ({
  messages: [],
  error: null,
  isLoading: false,
  socket: null,
  receiver: null,
  receiverUser:null,

  //get recievr id
  getReceiverId: (receiverId) => {
    set({ receiver: receiverId });
  },

  //sign up function
  getMessage: async () => {
    const { receiver } = get();
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(
        `${API_URL}/api/users/message/${receiver}`
      );
      
      set({ messages: response.data.message, receiverUser: response.data.user, isLoading: false });
      console.log("useAuthStore reciever", receiver);
    } catch (error) {
      set({
        error: error.response.data.message || "error signing up",
        isLoading: false,
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  //send message
  sendMSG: async (messageData) => {
    const { messages, receiver } = get();
    set({ isLoading: true });
    try {
      const res = await axios.post(
        `${API_URL}/api/users/message/${receiver}`,
        messageData
      );
     
      set({ messages: [...messages, res.data] });
    } catch (e) {
      console.log("error in getting messages", e);
    } finally {
      set({ isLoading: false });
    }
  },

  //listen to new messages
  subscribeToMessages: () => {
    const { socket } = get();
    socket.on("newMessage", (newMessage) => {
      set((state) => ({
        messages: [...state.messages, newMessage],
      }));
    });
  },

  unsubscribeToMessages: () => {
    const { socket } = get();

    socket.off("newMessage");
  },

  //connect socket
  connectSocket: async (userId) => {
    const socket = io(API_URL, {
      query: { userId: userId },
    });

    socket.connect();
    set({ socket: socket });
  },

  //dis connect socket
  disconnectSocket: async () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
