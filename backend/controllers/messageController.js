import e from "express";
import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req,res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const {message} = req.body;

        let gotConversation = await Conversation.findOne({
            participants:{$all : [senderId, receiverId]},
        });

        if(!gotConversation){
            gotConversation = await Conversation.create({
                participants:[senderId, receiverId]
            })
        };
        const newMessage = await Message.create({
            senderId,
            receiverId,
            conversationId : gotConversation._id,
            message
        });
        if(newMessage){
            gotConversation.messages.push(newMessage._id);
        };
        

        // SOCKET IO
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
            io.to(receiverSocketId).emit("refreshMessagePreviews");

            // Update status to 'delivered'
            newMessage.status = 'delivered';
            await Promise.all([gotConversation.save(), newMessage.save()]);
            
        }else {
            await gotConversation.save();
        }
        io.to(getReceiverSocketId(senderId))?.emit("refreshMessagePreviews");
        return res.status(201).json({
            newMessage
        })
    } catch (error) {
        console.log(error);
    }
}
export const getMessage = async (req,res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.id;
        const conversation = await Conversation.findOne({
            participants:{$all : [senderId, receiverId]}
        }).populate("messages"); 
        return res.status(200).json(conversation?.messages ? conversation.messages : []);
    } catch (error) {
        console.log(error);
    }
}

export const getConversationId = async (req, res)=> {

    const receiverId = req.params.id;
    const converstaion = await Message.findOne({
        senderId: req.id,
        receiverId: receiverId,
    });

    return res.status(200).json(converstaion ? converstaion.conversationId : null);
}