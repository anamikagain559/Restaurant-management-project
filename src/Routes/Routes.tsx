
import { createBrowserRouter } from 'react-router-dom';

import { RestaurantFrontend } from '../pages/Frontend/RestaurantFrontend';
import { Menu } from '../pages/Frontend/Menu';
import { Events } from '../pages/Frontend/Events';
import { Contact } from '../pages/Frontend/Contact';
import { Login } from '../pages/Login/Login';
import { Register } from '../pages/Register/Register';
import { DashboardLayout } from '../Layout/DashboardLayout';

import { AdminHome } from '../pages/Dashboard/AdminHome/AdminHome';
import { UserHome } from '../pages/Dashboard/UserHome/UserHome';
import { OrdersView } from '../pages/Dashboard/OrdersView/OrdersView';
import { MenuView } from '../pages/Dashboard/MenuView/MenuView';
import { TablesView } from '../pages/Dashboard/TablesView/TablesView';
import { ReservationsView } from '../pages/Dashboard/ReservationsView/ReservationsView';
import { Profile } from '../pages/Dashboard/UserHome/Profile';

import { PrivateRoute } from './PrivateRoute';
import { AdminRoute } from './AdminRoute';
import { useSelector } from 'react-redux';
import { useCurrentUser } from '../redux/features/auth/authSlice';
import { Navigate } from 'react-router-dom';

const DashboardIndex = () => {
  const user = useSelector(useCurrentUser);
  if (user?.role === 'admin') {
    return <Navigate to="/dashboard/admin" replace />;
  }
  return <Navigate to="/dashboard/user" replace />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RestaurantFrontend />,
  },
  {
    path: "/menu",
    element: <Menu />,
  },
  {
    path: "/events",
    element: <Events />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      {
        index: true,
        element: <DashboardIndex />
      },
      {
        path: "user",
        element: <UserHome />
      },
      {
        path: "admin",
        element: <AdminRoute><AdminHome /></AdminRoute>
      },
      {
        path: "orders",
        element: <OrdersView />
      },
      {
        path: "menu",
        element: <AdminRoute><MenuView /></AdminRoute>
      },
      {
        path: "tables",
        element: <AdminRoute><TablesView /></AdminRoute>
      },
      {
        path: "reservations",
        element: <ReservationsView />
      },
      {
        path: "profile",
        element: <Profile />
      }
    ]
  }
]);
