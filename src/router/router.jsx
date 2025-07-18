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
import BeARider from "../pages/BeARider/BeARider";
import PendingRiders from "../pages/Dashboard/PendingRiders/PendingRiders";
import ActiveRiders from "../pages/Dashboard/ActiveRiders/ActiveRiders";
import MakeAdmin from "../pages/Dashboard/MakeAdmin/MakeAdmin";
import AdminRouter from "../routers/AdminRouter";
import ForbiddenPage from "../pages/ForbiddenPage/ForbiddenPage";
import AssignRider from "../pages/Dashboard/AssignRider/AssignRider";
import RiderRouter from "../routers/RiderRouter";
import PendingDelivery from "../pages/Dashboard/PendingDelivery/PendingDelivery";
import MyDeliveredParcel from "../pages/Dashboard/MyDeliveredParcel/MyDeliveredParcel";
import MyTotalEarning from "../pages/Dashboard/MyTotalEarning/MyTotalEarning";

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
            },
            {
                path: 'beARider',
                element: <PrivetRouter>
                    <BeARider />
                </PrivetRouter>
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

        ]
    },
    //  DashBoard
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
            },
            // admin related path
            {
                path: 'assignRider',
                element: <AdminRouter>
                    <AssignRider />
                </AdminRouter>
            },
            {
                path: 'pendingRiders',
                element: <AdminRouter>
                    <PendingRiders />
                </AdminRouter>
            },
            {
                path: 'activeRiders',
                element: <AdminRouter>
                    <ActiveRiders />
                </AdminRouter>
            },
            {
                path: 'makeAdmin',
                element: <AdminRouter>
                    <MakeAdmin />
                </AdminRouter>
            },
            // rider related path
            {
                path: 'riderPendingTasks',
                element: <RiderRouter>
                    <PendingDelivery />
                </RiderRouter>
            },
            {
                path: 'myDeliveredParcels',
                element: <RiderRouter>
                    <MyDeliveredParcel />
                </RiderRouter>
            },
            {
                path: 'myTotalEarning',
                element: <RiderRouter>
                    <MyTotalEarning/>
                </RiderRouter>
            }
        ]
    },
    {
        path: 'forbiddenPage',
        Component: ForbiddenPage
    },
    {
        path: '*',
        Component: Error,
    }

]);