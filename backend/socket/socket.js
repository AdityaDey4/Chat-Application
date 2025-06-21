import { Server } from "socket.io";
import http from "http";
import express from "express";
import { Message } from "../models/messageModel.js";
import {Conversation} from "../models/conversationModel.js"
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId->socketId}

io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId !== undefined) {
    userSocketMap[userId] = socket.id;
  }
  console.log(`✅ Socket connected`);

  try {
    await Message.updateMany(
      {
        receiverId: userId,
        status: "sent",
      },
      { $set: { status: "delivered" } }
    );

    io.emit("messagesDelivered", {
          receiverId: userId,
        });
    console.log("Message status set as delivered");
  } catch (err) {
    console.error("❌ Error updating messages to delivered:", err.message);
  }


  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("requestMessagePreviews", async () => {
    try {
      const conversations = await Conversation.find({
        participants: userId,
      })
        .populate("messages")
        .populate("participants");

      const previews = {};

      for (let convo of conversations) {
        const otherUser = convo.participants.find(
          (p) => p._id.toString() !== userId
        );

        if (!otherUser) continue;

        const msgs = convo.messages;

        const lastMessage = msgs[msgs.length - 1];

        const unreadCount = msgs.filter(
          (msg) =>
            msg.receiverId.toString() === userId &&
            msg.status === "delivered"
        ).length;

        previews[otherUser._id] = {
          lastMessage: {
            text: lastMessage.message,
            createdAt: lastMessage.createdAt,
            status: lastMessage.status,
          },
          unreadCount,
        };
      }

      socket.emit("messagePreviews", previews);
    } catch (err) {
      console.log("Error sending previews:", err.message);
    }
  });

  socket.on("markAsSeen", async (senderId) => {
    try {

      await Message.updateMany(
        {
          senderId,
          receiverId : userId,
          status: { $ne: "seen" }, // Only update unseen
        },
        { $set: { status: "seen" } }
      );
      // console.log(senderId +" : "+userId);

      const senderSocketId = getReceiverSocketId(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("messagesSeen", {
          receiverId: userId, // the one who saw the message
        });
      }

    } catch (err) {
      console.error("❌ Error in markAsSeen:", err.message);
    }
  });

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
     console.log(`❌ Socket disconnected`);
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // users connected with socket will get the information not the user who logged out
  });
});

export { app, io, server };
