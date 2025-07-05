import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { format } from 'date-fns';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import { FaEye, FaDollarSign, FaTrashAlt } from 'react-icons/fa'; // Changed FaTrash to FaTrashAlt for a slightly different icon
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';

// import withReactContent from 'sweetalert2-react-content'; // Optional: for more complex React content in alerts

const MySwal = Swal; // Initialize SweetAlert2 for React content

const MyParcels = () => {
    const { user } = useAuth()
    const axiosSecure = useAxiosSecure();
    const navigate  = useNavigate()
    const { data: parcels = [], refetch } = useQuery({
        queryKey: ['myParcels', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?email=${user.email}`);
            return res.data

        }
    })
    // Function to handle the 'View' button click
    const handleView = (parcel) => {
        alert(`Viewing Parcel: ${parcel.tracking_id}\n\nDetails:\n${JSON.stringify(parcel, null, 2)}`);
        // In a real application, you'd likely navigate to a detail page
        // or open a modal with more information.
    };

    // Function to handle the 'Pay' button click
    const handlePay = (parcel) => {
        navigate(`/dashboard/payment/${parcel._id}`)
        // In a real application, you'd integrate with a payment gateway.
    };

    // Function to handle the 'Delete' button click
    const handleDelete = async (parcel) => {
        const result = await MySwal.fire({
            title: 'Are you sure?',
            html: `You are about to delete <strong>${parcel.parcelName}</strong>. This action cannot be undone!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
        });

        // 2. Check if the user confirmed
        if (result.isConfirmed) {
            // 3. Send the DELETE request using Axios
            axiosSecure.delete(`/parcels/${parcel._id}`)
                .then(res => {
                    console.log(res.data)
                    // 4. Show success message
                    if (res.data.deletedCount) {
                        MySwal.fire(
                            'Deleted!',
                            `Item ${``} has been deleted successfully.`,
                            'success'
                        );
                        refetch();
                    }

                }).catch(err => {
                    console.log(err);
                })


            return true; // Indicate success
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            // User clicked "No, cancel!" or dismissed the dialog
            await MySwal.fire(
                'Cancelled',
                'Your item is safe :)',
                'error'
            );
            return false; // Indicate cancellation
        }
        return false;
    };

    if (!parcels || parcels.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                <p>No parcel data available.</p>
                <p>Start by creating a new parcel!</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto p-4">
            <table className="table text-tertiary-content w-full border-separate border-spacing-y-2">
                {/* Table Head */}
                <thead>
                    <tr className="bg-base-200  text-sm uppercase leading-normal">
                        <th className="py-3 px-6 text-left rounded-l-lg">Parcel Name</th>
                        <th className="py-3 px-6 text-left rounded-l-lg">Type</th>
                        <th className="py-3 px-6 text-left">Created At</th>
                        <th className="py-3 px-6 text-right">Cost (BDT)</th>
                        <th className="py-3 px-6 text-center">Payment Status</th>
                        <th className="py-3 px-6 text-center rounded-r-lg">Actions</th>
                    </tr>
                </thead>
                {/* Table Body */}
                <tbody className="text-gray-700 text-sm font-light">
                    {parcels.map((parcel) => (
                        <tr key={parcel.tracking_id} className="bg-base-100 text-secondary-content hover:bg-base-200 shadow-md transition duration-300 ease-in-out">
                            {/* Parcel Name */}
                            <td className="py-3 px-6 text-left">
                                <span
                                    className="font-medium max-w-[180px] truncate block tooltip tooltip-bottom"
                                    data-tip={parcel.parcelName} // Full name appears on hover
                                    title={parcel.parcelName}
                                >
                                    {parcel.parcelName || 'N/A'}
                                </span>
                            </td>
                            {/* Type */}
                            <td className="py-3 px-6 text-left flex items-center">
                                <div className={`badge ${parcel.type === 'document' ? 'badge-info' : 'badge-secondary'} py-5`}>
                                    <span className={` badge-md text-white`}>
                                        {parcel.type}
                                    </span>
                                </div>
                            </td>
                            {/* Created At */}
                            <td className="py-3 px-6 text-left">
                                {/* Format the date for better readability */}
                                {parcel.creation_date ? format(new Date(parcel.creation_date), 'dd MMM yyyy HH:mm') : 'N/A'}
                            </td>
                            {/* Cost */}
                            <td className="py-3 px-6 text-tertiary-content text-center ">
                                <span className="font-bold">
                                    {parcel?.cost || '0'} ৳
                                </span>
                            </td>
                            {/* Payment Status */}
                            <td className="py-3 px-6 text-center">
                                <span className={`badge ${parcel.payment_status === 'paid' ? 'badge-success' : 'badge-warning'} text-gray-700 font-semibold`}>
                                    {parcel.payment_status}
                                </span>
                            </td>
                            {/* Actions */}
                            <td className="py-3 px-6 text-center">
                                <div className="flex item-center justify-center space-x-2">
                                    <button
                                        className="btn btn-sm btn-ghost btn-circle tooltip tooltip-bottom"
                                        data-tip="View Details"
                                        onClick={() => handleView(parcel)}
                                    >
                                        {/* React Icon for View */}
                                        <FaEye className="w-5 h-5" />
                                    </button>

                                    {parcel.payment_status === 'unpaid' && (
                                        <button
                                            className="btn btn-sm btn-ghost btn-circle tooltip tooltip-bottom text-green-500"
                                            data-tip="Make Payment"
                                            onClick={() => handlePay(parcel)}
                                        >
                                            {/* React Icon for Pay */}
                                            <FaDollarSign className="w-5 h-5" />
                                        </button>
                                    )}

                                    <button
                                        className="btn btn-sm btn-ghost btn-circle tooltip tooltip-bottom text-red-500"
                                        data-tip="Delete Parcel"
                                        onClick={() => handleDelete(parcel)}
                                    >
                                        {/* React Icon for Delete */}
                                        <FaTrashAlt className="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div >
    );
};

export default MyParcels;