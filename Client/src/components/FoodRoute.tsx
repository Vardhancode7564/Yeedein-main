import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface FoodRouteProps {
  element: React.ReactElement;
}

const FoodRoute: React.FC<FoodRouteProps> = ({ element }) => {
  const user = useSelector((store: RootState) => store.auth.user);



  if (user) {
    return user && (user.category === "Admin" || user.category === "Food") ? (
      element
    ) : (
      <Navigate to="/" replace />
    );
  }
};

export default FoodRoute;
