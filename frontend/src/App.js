import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./components/HomePage";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers, setSelectedUser } from "./redux/userSlice";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

function App() {
  const { authUser } = useSelector((store) => store.user);
  const { socket } = useSelector((store) => store.socket);
  const dispatch = useDispatch();

  useEffect(() => {
    if (authUser) {
      const socketio = io("http://localhost:5000", {
        query: {
          userId: authUser._id,
        },
      });
      dispatch(setSocket(socketio));
      socketio?.on("getOnlineUsers", (onlineUsers) => {
        console.log("New user logged in")
        dispatch(setOnlineUsers(onlineUsers));
      });
      return () => {
        console.log("UseEffect End in App.js")
        socketio.close(); // this will work only whenever the dependency changes like logout as this is root component (unmounted)
      }
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [authUser]);

  useEffect(()=> {
    return ()=> {
      dispatch(setSelectedUser(null));
    }
  },[])

  return (
    <div className="p-4 h-screen flex items-center justify-center">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
