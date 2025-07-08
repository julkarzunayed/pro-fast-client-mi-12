import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout/RootLayout";
import Home from "../pages/HomePage/Home/Home";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import Error from "../pages/Error/Error";
import CoveragePage from "../pages/Coverage/CoveragePage";
import SendParcel from "../pages/SendParcel/SendParcel";
import PrivetRouter from "../routers/privetRouter";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";
import MyParcels from "../pages/Dashboard/MyParcels/MyParcels";
import Payment from "../pages/Dashboard/Payment/Payment";
import PaymentHistory from "../pages/Dashboard/PaymentHistory/PaymentHistory";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        children: [
            {
                index: true,
                Component: Home,
            },
            {
                path: 'coverage',
                loader: () => fetch(`./data/warehouses.json`),
                Component: CoveragePage
            },
            {
                path: 'sendParcel',
                element: <PrivetRouter>
                    <SendParcel />
                </PrivetRouter>,
                // Component: SendParcel,
            }
        ]
    },
    {
        path: '/',
        Component: AuthLayout,
        children: [
            {
                path: 'login',
                Component: Login
            },
            {
                path: 'register',
                Component: Register,
            },
            {

            }
        ]
    },
    {
        path: 'dashboard',
        element: <PrivetRouter>
            <DashboardLayout />
        </PrivetRouter>,
        children: [
            {
                path: 'myParcels',
                Component: MyParcels
            },
            {
                path: 'payment/:parcelId',
                Component: Payment
            },
            {
                path: 'paymentHistory',
                Component: PaymentHistory,
            }
        ]
    },
    {
        path: '*',
        Component: Error,
    }

]);