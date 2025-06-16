import React from "react";
import Message from "./Message";
import useGetMessages from "../hooks/useGetMessages";
import useGetRealTimeMessage from "../hooks/useGetRealTimeMessage";
import { useSelector } from "react-redux";
import { getDateLabel } from "../utils/dataLabel";

const Messages = () => {
  useGetMessages();
  useGetRealTimeMessage();

  const { messages } = useSelector((store) => store.message);
  const groupedMessages = {};

  messages?.map((message) => {
    const dateLabel = getDateLabel(message.createdAt);
    if (!groupedMessages[dateLabel]) {
      groupedMessages[dateLabel] = [];
    }
    groupedMessages[dateLabel].push(message);
  });

  return (
    <div className="px-4 flex-1 overflow-auto">

      {!messages?.length ? (
        <p >Start the Conversation......</p>
      ) : (
        Object.entries(groupedMessages).map(([dateLabel, group]) => (
          <div key={dateLabel}>
            <div className="text-center text-xs text-white-400 my-2">
              — {dateLabel} —
            </div>
            {group.map((message) => (
              <Message key={message._id} message={message} />
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default Messages;
