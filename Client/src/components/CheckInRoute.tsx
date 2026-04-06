import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface CheckInRouteProps {
  element: React.ReactElement;
}

const CheckInRoute: React.FC<CheckInRouteProps> = ({ element }) => {
    const user = useSelector((store: RootState) => store.auth.user);
  
    

  if (user) {
    return user &&
      (user.category === "Admin" || user.category === "CheckIn") ? (
      element
    ) : (
      <Navigate to="/" replace />
    );
 }
};

export default CheckInRoute;
