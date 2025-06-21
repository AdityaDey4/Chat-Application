import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessagePreviews } from "../redux/messageSice"; // define this

const useFetchMessagePreviews = () => {
  const { socket } = useSelector((state) => state.socket);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;

    socket.emit("requestMessagePreviews");

    socket.on("refreshMessagePreviews", () => {
      socket.emit("requestMessagePreviews");
    });

    socket.on("messagePreviews", (previews) => {
      console.log(previews);
      dispatch(setMessagePreviews(previews));
    });

    return () => {
      socket.off("messagePreviews");
      socket.off("refreshMessagePreviews");
    };
  }, [socket, dispatch]);
};

export default useFetchMessagePreviews;
