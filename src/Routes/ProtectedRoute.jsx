import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, isAllowed }) => {
  return isAllowed ? element : <Navigate to="/Profile" />;
};

export default ProtectedRoute;
