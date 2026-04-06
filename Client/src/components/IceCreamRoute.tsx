import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface IceCreamRouteProps {
  element: React.ReactElement;
}

const IceCreamRoute: React.FC<IceCreamRouteProps> = ({ element }) => {
  const user = useSelector((store: RootState) => store.auth.user);

  if (user) {
    return user && (user.category === "Admin" || user.category === "IceCream") ? (
      element
    ) : (
      <Navigate to="/" replace />
    );
  }
};

export default IceCreamRoute;
