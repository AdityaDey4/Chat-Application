import { useEffect } from "react";
import {useSelector, useDispatch} from "react-redux";
import { addMessage, updateMessageStatusToSeen, updateMessageStatusToDelivered } from "../redux/messageSice";
import { useRef } from "react";

const useGetRealTimeMessage = () => {
    const { socket } = useSelector(store => store.socket);
    const { selectedUser } = useSelector(store => store.user);
  const dispatch = useDispatch();

  const selectedUserRef = useRef(selectedUser);
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  useEffect(() => {
    if (!socket) {
      console.warn("❌ Socket not connected yet.");
      return;
    }

    // console.log("✅ Setting up socket listener for newMessage...");

    const handleNewMessage = (newMessage) => {

      const currentSelectedUser = selectedUserRef.current;
      if(newMessage && currentSelectedUser && newMessage.senderId == currentSelectedUser._id){
        dispatch(addMessage(newMessage));
        
        socket.emit("markAsSeen", newMessage.senderId);
        console.log(currentSelectedUser)
      } 
    };

    const handleMessagesSeen = ({ receiverId }) => {
      const currentUserId = selectedUserRef.current?._id;
      // Only update if the seen event is related to current chat
      if (receiverId === currentUserId) {
        dispatch(updateMessageStatusToSeen(receiverId));
      }
    };

    const handleMessagesDelivered = ({receiverId}) => {
      console.log("Update All th delivered")
      dispatch(updateMessageStatusToDelivered(receiverId));
    }

    socket.on("newMessage", handleNewMessage);
    socket.on("messagesSeen", handleMessagesSeen);
    socket.on("messagesDelivered", handleMessagesDelivered);

    return () => {
      console.log("🧹 Cleaning up socket listener for newMessage");
      socket.off("newMessage", handleNewMessage);
      socket.off("messagesSeen", handleMessagesSeen);
      socket.off("messagesDelivered", handleMessagesDelivered);
    };
  }, [socket, dispatch]);
};
export default useGetRealTimeMessage;