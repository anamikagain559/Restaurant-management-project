
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCurrentUser } from '../redux/features/auth/authSlice';

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector(useCurrentUser);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
