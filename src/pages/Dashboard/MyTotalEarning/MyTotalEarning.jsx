import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { isToday, isThisWeek, isThisMonth, isThisYear } from 'date-fns';
import { FaMoneyBillWave, FaCalendarDay, FaCalendarWeek, FaCalendarAlt, FaDollarSign } from 'react-icons/fa'; // Icons for earnings
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useUserRole from '../../../hooks/useUserRole';

// Assuming useAuth and useAxiosSecure are correctly imported from your project
// import useAuth from '../../../hooks/useAuth';
// import useAxiosSecure from '../../../hooks/useAxiosSecure';

// Dummy useAuth for demonstration

const MyTotalEarning = () => {
    const axiosSecure = useAxiosSecure();
    const { userId, isRoleLoading } = useUserRole()
    const riderId = userId

    const {
        data: parcels = [],
        isLoading: isLoadingParcels,
        isError,
        error,
    } = useQuery({
        queryKey: ['myTotalEarnings', riderId], // Query key includes riderId
        queryFn: async () => {
            if (!riderId) {
                throw new Error("Rider ID not available.");
            }
            // MARKED CHANGE: API call to fetch delivered or delivered_to_wire_house parcels for the rider
            // Adjust your backend endpoint to return parcels with either of these delivery statuses
            // const response = await axiosSecure.get(`/parcels/rider/${riderId}/delivered-or-warehoused`);
            // return response.data;
            const response = await axiosSecure.get(`/parcels/rider/${riderId}/delivered`);
            return response.data;
        },
        enabled: !!riderId && !isRoleLoading, // Only run if riderId is available and auth is not loading
        staleTime: 5 * 60 * 1000,
    });

    // MARKED CHANGE: Function to calculate earning for a single parcel
    const calculateParcelEarning = (parcel) => {
        if (!parcel.cost || typeof parcel.cost !== 'number') {
            return 0; // Return 0 or handle error for missing cost
        }
        const cost = parcel.cost;
        if (parcel.receiverDistrict === parcel.senderDistrict) {
            return cost * 0.75; // 75% earning
        } else {
            return cost * 0.35; // 35% earning
        }
    };

    // MARKED CHANGE: Calculate all earnings breakdown
    const calculateEarningsBreakdown = (deliveredParcels) => {
        let todayEarning = 0;
        let lastWeekEarning = 0;
        let lastMonthEarning = 0;
        let lastYearEarning = 0;
        let totalCashedOut = 0;
        let totalNotCashedOut = 0;

        // const now = new Date(); // Current date and time

        deliveredParcels.forEach(parcel => {
            const earning = calculateParcelEarning(parcel);
            const deliveryDate = parcel.updated_at ? new Date(parcel.updated_at) : null;

            if (deliveryDate) {
                if (isToday(deliveryDate)) {
                    todayEarning += earning;
                }
                // isThisWeek checks if date is in the same calendar week as today
                if (isThisWeek(deliveryDate, { weekStartsOn: 0 })) { // weekStartsOn: 0 for Sunday, 1 for Monday
                    lastWeekEarning += earning;
                }
                // isThisMonth checks if date is in the same calendar month as today
                if (isThisMonth(deliveryDate)) {
                    lastMonthEarning += earning;
                }
                // isThisYear checks if date is in the same calendar year as today
                if (isThisYear(deliveryDate)) {
                    lastYearEarning += earning;
                }
            }

            // Check cash out status
            // Assuming cash_out_time is a string or an object with $date.$numberLong
            const cashedOut = parcel.cash_out_time !== null && parcel.cash_out_time !== undefined;
            // If cash_out_time is an object like { "$date": { "$numberLong": "..." } }
            const isCashedOutObject = typeof parcel.cash_out_time === 'object' && parcel.cash_out_time !== null && parcel.cash_out_time.$date && parcel.cash_out_time.$date.$numberLong;

            if (cashedOut || isCashedOutObject) {
                totalCashedOut += earning;
            } else {
                totalNotCashedOut += earning;
            }
        });

        return {
            todayEarning: todayEarning.toFixed(2),
            lastWeekEarning: lastWeekEarning.toFixed(2),
            lastMonthEarning: lastMonthEarning.toFixed(2),
            lastYearEarning: lastYearEarning.toFixed(2),
            totalCashedOut: totalCashedOut.toFixed(2),
            totalNotCashedOut: totalNotCashedOut.toFixed(2),
        };
    };

    const earnings = calculateEarningsBreakdown(parcels);

    if (isRoleLoading || isLoadingParcels) {
        return <div className="text-center py-10 text-lg">Loading earnings data...</div>;
    }

    if (isError) {
        return <div className="text-center py-10 text-lg text-red-600">Error: {error.message}</div>;
    }

    return (
        <div className="container mx-auto p-4 font-sans">
            <h2 className="text-3xl font-bold text-secondary-content mb-8 text-left">My Total Earnings</h2>

            {parcels.length === 0 ? (
                <p className="text-secondary-content text-center py-8">No delivered parcels found to calculate earnings.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {/* Today's Earning Card */}
                    <div className="card bg-base-200 shadow-xl rounded-lg p-6 flex flex-col items-center justify-center text-center">
                        <FaCalendarDay className="text-5xl text-blue-500 mb-3" />
                        <h3 className="text-xl font-semibold text-primary-content">Today's Earning</h3>
                        <p className="text-3xl font-bold text-green-600 mt-2">{earnings.todayEarning} ৳</p>
                    </div>

                    {/* Last Week's Earning Card */}
                    <div className="card bg-base-200 shadow-xl rounded-lg p-6 flex flex-col items-center justify-center text-center">
                        <FaCalendarWeek className="text-5xl text-purple-500 mb-3" />
                        <h3 className="text-xl font-semibold text-primary-content">Last Week's Earning</h3>
                        <p className="text-3xl font-bold text-green-600 mt-2">{earnings.lastWeekEarning} ৳</p>
                    </div>

                    {/* Last Month's Earning Card */}
                    <div className="card bg-base-200 shadow-xl rounded-lg p-6 flex flex-col items-center justify-center text-center">
                        <FaCalendarAlt className="text-5xl text-orange-500 mb-3" />
                        <h3 className="text-xl font-semibold text-primary-content">Last Month's Earning</h3>
                        <p className="text-3xl font-bold text-green-600 mt-2">{earnings.lastMonthEarning} ৳</p>
                    </div>

                    {/* Last Year's Earning Card */}
                    <div className="card bg-base-200 shadow-xl rounded-lg p-6 flex flex-col items-center justify-center text-center">
                        <FaCalendarAlt className="text-5xl text-red-500 mb-3" />
                        <h3 className="text-xl font-semibold text-primary-content">Last Year's Earning</h3>
                        <p className="text-3xl font-bold text-green-600 mt-2">{earnings.lastYearEarning} ৳</p>
                    </div>

                    {/* Total Cashed Out Card */}
                    <div className="card bg-base-200 shadow-xl rounded-lg p-6 flex flex-col items-center justify-center text-center">
                        <FaMoneyBillWave className="text-5xl text-teal-500 mb-3" />
                        <h3 className="text-xl font-semibold text-primary-content">Total Cashed Out</h3>
                        <p className="text-3xl font-bold text-green-600 mt-2">{earnings.totalCashedOut} ৳</p>
                    </div>

                    {/* Total Not Cashed Out Card */}
                    <div className="card bg-base-200 shadow-xl rounded-lg p-6 flex flex-col items-center justify-center text-center">
                        <FaDollarSign className="text-5xl text-yellow-500 mb-3" />
                        <h3 className="text-xl font-semibold text-primary-content">Pending Cash Out</h3>
                        <p className="text-3xl font-bold text-red-600 mt-2">{earnings.totalNotCashedOut} ৳</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyTotalEarning;
