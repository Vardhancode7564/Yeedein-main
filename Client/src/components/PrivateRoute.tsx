import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface PrivateRouteProps {
  element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;