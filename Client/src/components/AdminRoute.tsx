import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import toast from "react-hot-toast";

interface AdminRouteProps {
  element: React.ReactElement;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ element }) => {
 
  const user = useSelector((store: RootState) => store.auth.user);



  if (user) {
    if (!(user && user.category === "Admin")) {
      toast.error("You are not Admin");
    }

    return user && user.category === "Admin" ? (
      element
    ) : (
      <Navigate to="/" replace />
    );
  }
};

export default AdminRoute;

