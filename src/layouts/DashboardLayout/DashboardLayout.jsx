import React from 'react';
import { NavLink, Outlet } from 'react-router';
import ProFastLogo from '../../components/ProFastLogo/ProFastLogo';
import { FaHome, FaBoxOpen, FaCreditCard, FaSearchLocation, FaUserEdit, FaUserClock, FaMotorcycle, FaClipboardList, FaCheckSquare, FaDollarSign, FaWallet } from 'react-icons/fa'; // Updated imports
import useAuth from '../../hooks/useAuth';
import { MdAdminPanelSettings, MdPendingActions } from 'react-icons/md';
import useUserRole from '../../hooks/useUserRole';

const DashboardLayout = () => {
    const { user } = useAuth();
    const { role, isRoleLoading } = useUserRole();
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content ">

                {/* <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
                    Open drawer
                </label> */}
                {/* Navbar */}
                <div className="navbar bg-base-300 w-full lg:hidden">
                    <div className="flex-none lg:hidden">
                        <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-6 w-6 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                ></path>
                            </svg>
                        </label>
                    </div>
                    <div className="mx-2 flex-1 px-2 ">Dashboard</div>
                </div>
                {/* Page content here */}
                <Outlet></Outlet>
                {/* Page content here */}
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                    {/* Sidebar content here */}
                    <li><ProFastLogo /></li>
                    <li>
                        <div className="">
                            <div
                                style={{
                                    backgroundImage: `url(${user.photoURL})`,
                                }}
                                className={`bg-[url(${user.photoURL})] h-12 w-12 bg-cover bg-center bg-no-repeat rounded-full`}>
                                {/* <img src={user.photoURL} alt="" /> */}
                            </div>
                            <h3 className="font-bold text-xl">
                                {user.displayName}
                            </h3>
                        </div>
                    </li>
                    <li>
                        <NavLink to={'/dashboard'}>
                            <FaHome className="inline-block mr-2" /> Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={'/dashboard/myParcels'}>
                            <FaBoxOpen className="inline-block mr-2" /> My Parcels {/* Changed to FaBoxes */}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={'/dashboard/paymentHistory'}>
                            <FaCreditCard className="inline-block mr-2" /> Payment History
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={'/dashboard/track'}>
                            <FaSearchLocation className="inline-block mr-2" /> Track a Parcel {/* Changed to FaLocationArrow */}
                        </NavLink>
                    </li>
                    {/* Rider Links */}
                    {
                        !isRoleLoading && role === 'rider' && <>
                            <li>
                                <NavLink to={'/dashboard/riderPendingTasks'}>
                                    <MdPendingActions className="inline-block mr-2" />
                                    My Pending delivery
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={'/dashboard/myDeliveredParcels'}>
                                    <FaCheckSquare className="inline-block mr-2" /> My Delivered Parcels
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={'/dashboard/myTotalEarning'}>
                                    <FaWallet className="inline-block mr-2" /> My Total Earning
                                </NavLink>
                            </li>
                        </>
                    }
                    {/* Admin links  */}
                    {
                        !isRoleLoading && role === 'admin' && <>
                            <li>
                                <NavLink to={'/dashboard/assignRider'}>
                                    <FaClipboardList className="inline-block mr-2" /> Assign Rider
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={'/dashboard/pendingRiders'}>
                                    <FaUserClock className="inline-block mr-2" /> Pending Riders
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={'/dashboard/activeRiders'}>
                                    <FaMotorcycle className="inline-block mr-2" /> Active Riders
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={'/dashboard/makeAdmin'}>
                                    <MdAdminPanelSettings className="inline-block mr-2" />
                                    Make Admin
                                </NavLink>
                            </li>
                        </>
                    }
                    <li>
                        <NavLink to={'/dashboard/updateProfile'}>
                            <FaUserEdit className="inline-block mr-2" /> Update Profile
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default DashboardLayout;