import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const { accessToken } = useSelector((state) => state.auth);
  if (!accessToken) {
    return <Navigate to='/' />;
  }
  return children;
}
