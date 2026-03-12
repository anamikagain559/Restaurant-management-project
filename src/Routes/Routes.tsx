
import { createBrowserRouter } from 'react-router-dom';

import { RestaurantFrontend } from '../pages/Frontend/RestaurantFrontend';
import { Login } from '../pages/Login/Login';
import { Register } from '../pages/Register/Register';
import { DashboardLayout } from '../Layout/DashboardLayout';

import { AdminHome } from '../pages/Dashboard/AdminHome/AdminHome';
import { UserHome } from '../pages/Dashboard/UserHome/UserHome';
import { OrdersView } from '../pages/Dashboard/OrdersView/OrdersView';
import { MenuView } from '../pages/Dashboard/MenuView/MenuView';
import { TablesView } from '../pages/Dashboard/TablesView/TablesView';
import { ReservationsView } from '../pages/Dashboard/ReservationsView/ReservationsView';

import { PrivateRoute } from './PrivateRoute';
import { AdminRoute } from './AdminRoute';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RestaurantFrontend />,
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
        element: <MenuView />
      },
      {
        path: "tables",
        element: <AdminRoute><TablesView /></AdminRoute>
      },
      {
        path: "reservations",
        element: <ReservationsView />
      }
    ]
  }
]);
