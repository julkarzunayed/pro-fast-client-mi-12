import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../Loading/Loading';

const PaymentHistory = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { isPending, data: paymentRecords } = useQuery({
        queryKey: ['payment_history', user.email],
        queryFn: async () => {
            const historyRes = await axiosSecure.get(`/payments?userEmail=${user.email}`);
            return historyRes.data;
        }
    })
    if (isPending) {
        return <Loading></Loading>
    }
    // console.log(paymentRecords)
    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString(); // Formats to a user-friendly local date and time string
    };

    return (
        <div className=" mx-auto p-4 font-sans">
            <h2 className="text-3xl font-bold text-secondary-content mb-6 text-center md:text-left">Payment History</h2>

            {paymentRecords.length === 0 ? (
                <p className="text-gray-600 text-center">No payment records found.</p>
            ) : (
                <div className="overflow-x-auto text-primary-content shadow-md rounded-lg">
                    <table className="min-w-full divide-y divide-gray-500 ">
                        <thead className="">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                    Parcel ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                    Amount
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                    Payment Method
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                    Payment Time
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                    Transaction ID
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-500">
                            {paymentRecords.map((record, index) => (
                                <tr key={record._id} className={index % 2 === 0 ? 'bg-base-100' : 'bg-base-300'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium ">
                                        {record.parcel_id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        ${record.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {record.paymentMethod.join(', ')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {formatDateTime(record.payment_time)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {record.transactionId}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PaymentHistory;