import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import Coverage from "../pages/Coverage/Coverage";
import PrivateRoute from "../routes/PrivateRoute";
import AddParcel from "../pages/AddParcel/AddParcel";
import DashboardLayout from "../layouts/DashboardLayout";
import MyParcels from "../pages/Dashboard/MyParcels/MyParcels";
import Payment from "../pages/Dashboard/Payment/Payment";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="bg-[#EAECED] pt-8">
        <RootLayout></RootLayout>
      </div>
    ),
    children: [
      { index: true, Component: Home },
      {
        path: "coverage",
        Component: Coverage,
        loader: () => fetch("warehouses.json"),
      },
      {
        path: "addParcel",
        element: (
          <PrivateRoute>
            <AddParcel></AddParcel>
          </PrivateRoute>
        ),
        loader: () => fetch("warehouses.json"),
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      { path: "login", Component: Login },
      { path: "register", Component: Register },
    ],
  },
  {
    path: '/dashboard',
    element:
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>,
    children: [
      { path: 'myParcels', Component: MyParcels },
      { path: 'payment/:id', Component: Payment }
    ]
  }
]);
