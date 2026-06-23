import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate} from "react-router";
import Loader from "../../../components/Loader";

const Protected = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader message="Waking up the backend..." />;
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return children;
};

export default Protected;
