import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children}) => {
    const {authUser} = useSelector(store=>store.user);

    if (!authUser) {
    return <Navigate to="/login" />;
  }

  return children;
};
export default ProtectedRoute;