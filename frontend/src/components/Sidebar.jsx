import React, { useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import OtherUsers from "./OtherUsers";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setAuthUser,
  setOtherUsers,
  setSelectedUser,
} from "../redux/userSlice";
import { setMessages } from "../redux/messageSice";
import useGetOtherUsers from "../hooks/useGetOtherUsers";
// import { BASE_URL } from '..';

const Sidebar = () => {
  useGetOtherUsers();

  const [search, setSearch] = useState("");
  const { authUser, otherUsers } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/user/logout`);
      navigate("/login");
      toast.success(res.data.message);
      dispatch(setAuthUser(null));
      dispatch(setMessages([]));
      dispatch(setOtherUsers([]));
      dispatch(setSelectedUser(null));
    } catch (error) {
      console.log(error);
    }
  };

  const filteredUsers = otherUsers?.filter((user) =>
    user.fullName.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="border-r border-slate-500 p-4 flex flex-col">
      <form action="" className="flex items-center gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered rounded-md"
          type="text"
          placeholder="Search..."
        />
        <div className="w-12 rounded-full">
          <img src={authUser?.profilePhoto} alt="user-profile" />
        </div>
      </form>
      <div className="divider px-3"></div>
      <div className="flex-1 self-right">
        <OtherUsers users={filteredUsers} />
      </div>

      <div className="mt-2 align-end">
        <button onClick={logoutHandler} className="btn btn-sm">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
