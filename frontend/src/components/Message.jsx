import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const Message = ({ message }) => {
  const scroll = useRef();
  const { authUser, selectedUser } = useSelector((store) => store.user);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={scroll}
      className={`chat ${
        message?.senderId === authUser?._id ? "chat-end" : "chat-start"
      }`}
    >
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS chat bubble component"
            src={
              message?.senderId === authUser?._id
                ? authUser?.profilePhoto
                : selectedUser?.profilePhoto
            }
          />
        </div>
      </div>
      <div className="chat-footer">
        <time className="text-xs opacity-50 text-white">
          {new Date(message?.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
        { message?.senderId === authUser?._id && <div className="chat-footer opacity-50">{message.status}</div>}
      </div>
      <div
        className={`chat-bubble max-w-xs break-words overflow-hidden whitespace-pre-wrap ${
          message?.senderId !== authUser?._id ? "bg-gray-200 text-black" : ""
        } `}
      >
        {message?.message}
      </div>
    </div>
  );
};

export default Message;
