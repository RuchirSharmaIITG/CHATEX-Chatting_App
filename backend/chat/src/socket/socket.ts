import { Server } from "socket.io";
import http from "http";
import express from "express";
import { Messages } from "../models/Messages.js";
import { Chat } from "../models/Chat.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const userSocketMap: { [key: string]: string } = {};

export const getReceiverSocketId = (receiverId: string) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId as string;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUser", Object.keys(userSocketMap));

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("leaveChat", (chatId) => {
    socket.leave(chatId);
  });

  socket.on("typing", (data) => {
    const receiverSocket = getReceiverSocketId(data.receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("userTyping", data);
    }
  });

  socket.on("stopTyping", (data) => {
    const receiverSocket = getReceiverSocketId(data.receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("userStoppedTyping", data);
    }
  });

  socket.on("markMessagesAsSeen", async ({ chatId, userId }) => {
    try {
      await Messages.updateMany(
        { chatId: chatId, sender: { $ne: userId }, seen: false },
        { seen: true, seenAt: new Date() },
      );

      const chat = await Chat.findById(chatId);
      if (chat) {
        const otherUserId = chat.users.find(
          (id) => id.toString() !== userId.toString(),
        );
        if (otherUserId) {
          const receiverSocket = getReceiverSocketId(otherUserId.toString());
          if (receiverSocket) {
            io.to(receiverSocket).emit("messagesSeen", { chatId });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUser", Object.keys(userSocketMap));
    }
  });
});

export { app, io, server };
