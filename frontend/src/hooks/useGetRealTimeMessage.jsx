import { useEffect } from "react";
import {useSelector, useDispatch} from "react-redux";
import { addMessage } from "../redux/messageSice";

const useGetRealTimeMessage = () => {
    const { socket } = useSelector(store => store.socket);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) {
      console.warn("❌ Socket not connected yet.");
      return;
    }

    console.log("✅ Setting up socket listener for newMessage...");

    const handleNewMessage = (newMessage) => {
      console.log("📨 New message received via socket:", newMessage);

      dispatch(addMessage(newMessage));
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      console.log("🧹 Cleaning up socket listener for newMessage");
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, dispatch]);
};
export default useGetRealTimeMessage;