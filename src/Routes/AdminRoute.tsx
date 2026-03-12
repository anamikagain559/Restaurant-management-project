
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCurrentUser } from '../redux/features/auth/authSlice';

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector(useCurrentUser);

  if (!user || user.role?.toLowerCase() !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
