import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { getDateLabel } from "../utils/dataLabel";
import useFetchMessagePreviews from "../hooks/useFetchMessagePreviews";

const OtherUser = ({ user }) => {
  useFetchMessagePreviews();


  const dispatch = useDispatch();
  const { selectedUser, onlineUsers } = useSelector((store) => store.user);
  const {previewMap} = useSelector((store)=> store.message)
  const { socket } = useSelector((store) => store.socket);

  const isOnline = onlineUsers?.includes(user?._id);
  const preview = previewMap?.[user?._id];
  console.log(preview)


  const selectedUserHandler = (user) => {
    if (socket) {
      socket.emit("markAsSeen", user._id);
      socket.emit("requestMessagePreviews", user._id);
      
    }
    dispatch(setSelectedUser(user));
  };

  return (
    <>
      <div
        onClick={() => selectedUserHandler(user)}
        className={` ${
          selectedUser?._id === user?._id
            ? "bg-zinc-200 text-black"
            : "text-white"
        } flex gap-2 hover:text-black items-center hover:bg-zinc-200 rounded p-2 cursor-pointer`}
      >
        <div className={`avatar ${isOnline ? "avatar-online" : ""}`}>
          <div className="w-12 rounded-full">
            <img src={user?.profilePhoto} alt="user-profile" />
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex justify-between">
            <p className="font-medium">{user?.fullName}</p>
            {preview && preview?.lastMessage && preview?.lastMessage?.createdAt && (
              <span className="text-xs text-gray-400">
                {getDateLabel(preview.lastMessage.createdAt)}
              </span>
            )}
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400 truncate w-44">
              {preview && preview?.lastMessage?.text || "No messages yet"}
            </p>

            {preview && preview?.unreadCount > 0 && (
              <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                {preview.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="divider my-0 py-0 h-1"></div>
    </>
  );
};

export default OtherUser;
