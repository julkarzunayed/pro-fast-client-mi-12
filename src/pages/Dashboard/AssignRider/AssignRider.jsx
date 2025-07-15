import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FaUserPlus, FaEye } from 'react-icons/fa'; // Only needed icons
import { format } from 'date-fns'; // For date formatting

import Swal from 'sweetalert2'; // Explicitly import Swal

import useAxiosSecure from '../../../hooks/useAxiosSecure';
import RiderAssignmentModal from './RiderAssignmentModal';



const AssignRider = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [selectedParcel, setSelectedParcel] = useState(null); // State to hold the parcel for assignment

    const { data: parcels = [], isLoading, isError, error, refetch } = useQuery({
        queryKey: ['allParcels'],
        queryFn: async () => {
            // Replace this with your actual axios call to your backend
            const response = await axiosSecure.get(`/parcels/byStatus`, {
                params: {
                    delivery_status: 'not_collected',
                    payment_status: 'paid'
                }
            }); // Assuming an endpoint for all parcels
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    });

    // Handler for assigning a rider - now opens the modal
    const handleAssignRider = (parcel) => {
        setSelectedParcel(parcel); // Set the parcel to be assigned
        document.getElementById('assign_rider_modal').showModal(); // Open the DaisyUI modal
    };

    // Handler for viewing parcel details (optional, if you have a modal or detail page)
    const handleViewDetails = (parcel) => {
        console.log("Viewing details for parcel:", parcel.parcelName, "ID:", parcel._id.$oid);
        // Implement navigation to a detail page or open a modal
        alert(`Viewing details for parcel: ${parcel.parcelName}`); // Placeholder alert
    };

    // MARKED CHANGE: Callback from RiderAssignmentModal when a rider is assigned
    // This function is still needed here because it contains the queryClient.invalidateQueries
    // which refreshes the 'allParcels' table after a successful assignment from the modal.
    const onRiderAssigned = async () => {
        try {

            //parcelId, riderId, riderName

            // This logic will now be handled inside the RiderAssignmentModal using useMutation
            // However, we keep this function structure for clarity, or if you decide to
            // trigger the mutation from here directly based on modal input.
            // For this simplified version, the modal itself will handle the mutation.
            // This function will primarily be used for invalidation and closing the modal.

            // As per the request, the mutation is now handled inside RiderAssignmentModal.
            // So, this function will primarily be responsible for invalidating the query
            // and closing the modal after the modal's internal mutation completes successfully.
            queryClient.invalidateQueries(['allParcels']); // Invalidate to refetch updated parcels
            setSelectedParcel(null); // Clear selected parcel
            document.getElementById('assign_rider_modal').close(); // Close the modal
        } catch (err) {
            console.error("Error handling rider assignment callback:", err);
        }
    };


    if (isLoading) {
        return <div className="text-center py-10 text-lg ">Loading all parcels...</div>;
    }

    if (isError) {
        return <div className="text-center py-10 text-lg text-red-600">Error: {error.message}</div>;
    }

    return (
        <div className="mx-auto p-4 font-sans">
            <h2 className="text-3xl font-bold text-secondary-content mb-6 text-left">All Parcels</h2>

            {parcels.length === 0 ? (
                <p className="text-secondary-content text-center py-8">No parcels found in the system.</p>
            ) : (
                <div className="overflow-x-auto p-4">
                    <table className="text-primary-content table divide-y divide-gray-500">
                        {/* Table Head */}
                        <thead className='divide-y divide-gray-500'>
                            <tr className="text-sm uppercase leading-normal rounded-lg">
                                <th className="py-3 px-6 text-left rounded-tl-lg rounded-bl-lg">Parcel Name</th>
                                <th className="py-3 px-6 text-left">Tracking ID</th>
                                <th className="py-3 px-6 text-left">Type</th>
                                <th className="py-3 px-6 text-left">Cost (BDT)</th>
                                <th className="py-3 px-6 text-center">Payment Status</th>
                                <th className="py-3 px-6 text-center">Delivery Status</th>
                                <th className="py-3 px-6 text-left">Created At</th>
                                <th className="py-3 px-6 text-center rounded-tr-lg rounded-br-lg">Actions</th>
                            </tr>
                        </thead>
                        {/* Table Body */}
                        <tbody className="text-sm font-light divide-y divide-gray-500">
                            {parcels.map((parcel, index) => (
                                <tr key={parcel._id.$oid || parcel._id} className={index % 2 === 0 ? 'bg-base-100' : 'bg-base-300'}>
                                    {/* Parcel Name */}
                                    <td className="py-3 px-6 text-left rounded-tl-lg rounded-bl-lg">
                                        <span
                                            className="font-medium max-w-[180px] truncate block tooltip tooltip-bottom"
                                            data-tip={parcel.parcelName}
                                            title={parcel.parcelName}
                                        >
                                            {parcel.parcelName || 'N/A'}
                                        </span>
                                    </td>
                                    {/* Tracking ID */}
                                    <td className="py-3 px-6 text-left">
                                        {parcel.tracking_id || 'N/A'}
                                    </td>
                                    {/* Type */}
                                    <td className="py-3 px-6 text-left">
                                        <span className={`badge ${parcel.type === 'document' ? 'badge-info' : 'badge-secondary'} py-2 px-3 text-white`}>
                                            {parcel.type || 'N/A'}
                                        </span>
                                    </td>
                                    {/* Cost */}
                                    <td className="py-3 px-6 text-left">
                                        {parcel.cost ? `${parcel.cost} ৳` : 'N/A'}
                                    </td>
                                    {/* Payment Status */}
                                    <td className="py-3 px-6 text-center">
                                        <span className={`badge ${parcel.payment_status === 'paid' ? 'badge-success' : 'badge-warning'} font-semibold text-gray-800 py-2 px-3`}>
                                            {parcel.payment_status || 'N/A'}
                                        </span>
                                    </td>
                                    {/* Delivery Status */}
                                    <td className="py-3 px-6 text-center">
                                        <span className={`badge ${parcel.delivery_status === 'delivered' ? 'badge-success' : (parcel.delivery_status === 'not_collected' ? 'badge-error' : 'badge-info')} font-semibold text-gray-800 py-2 px-3`}>
                                            {parcel.delivery_status || 'N/A'}
                                        </span>
                                    </td>
                                    {/* Created At */}
                                    <td className="py-3 px-6 text-left">
                                        {parcel.creation_date ? format(new Date(parcel.creation_date), 'dd MMM yyyy HH:mm') : 'N/A'}
                                    </td>
                                    {/* Actions */}
                                    <td className="py-3 px-6 text-center rounded-tr-lg rounded-br-lg">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button
                                                className="btn btn-sm btn-ghost btn-circle tooltip tooltip-bottom"
                                                data-tip="View Details"
                                                onClick={() => handleViewDetails(parcel)}
                                            >
                                                <FaEye className="w-5 h-5 text-blue-500" />
                                            </button>
                                            {/* Show Assign Rider button only if not collected and not already assigned/delivered */}
                                            {(parcel.delivery_status === 'not_collected' || parcel.delivery_status === 'pending') && (
                                                <button
                                                    className="btn btn-sm btn-ghost btn-circle tooltip tooltip-bottom text-green-500"
                                                    data-tip="Assign a Rider"
                                                    onClick={() => handleAssignRider(parcel)}
                                                >
                                                    <FaUserPlus className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Rider Assignment Modal */}
            {selectedParcel && ( // Only render modal if a parcel is selected
                <RiderAssignmentModal
                    refetch={refetch}
                    parcel={selectedParcel}
                    onClose={onRiderAssigned} // MARKED CHANGE: onRiderAssigned is now passed as onClose
                />
            )}
        </div>
    );
};

export default AssignRider;
