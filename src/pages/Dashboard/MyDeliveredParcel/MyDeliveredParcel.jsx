import React from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { FaMoneyBillWave, FaEye } from 'react-icons/fa'; // Icons for actions
import { format } from 'date-fns'; // For date formatting
import Swal from 'sweetalert2'; // Explicitly import Swal
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useUserRole from '../../../hooks/useUserRole';
import LoadingMini from '../../Loading/LoadingMini';



const MyDeliveredParcel = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const { userId, isRoleLoading } = useUserRole()
    const riderId = userId

    const {
        data: parcels = [],
        isLoading: isLoadingParcels,
        isError,
        error,
    } = useQuery({
        queryKey: ['myDeliveredParcels', riderId], // Query key includes riderId
        queryFn: async () => {
            if (!riderId) {
                throw new Error("Rider ID not available.");
            }
            // MARKED CHANGE: API call to fetch delivered parcels for the rider
            const response = await axiosSecure.get(`/parcels/rider/${riderId}/delivered`);
            return response.data;
        },
        enabled: !!riderId && !isRoleLoading, // Only run if riderId is available and auth is not loading
        staleTime: 5 * 60 * 1000,
    });
    console.log(parcels)
    // MARKED CHANGE: useMutation for cash-out functionality
    const cashOutMutation = useMutation({
        mutationFn: async (parcelId) => {
            // Assuming your backend updates cash_out_time to current timestamp
            const response = await axiosSecure.patch(`/parcels/${parcelId}/update`, {
                cashed_out: true,
                cash_out_time: new Date().toISOString() // Send current time as ISO string
            });
            return response.data;
        },
        onSuccess: (data) => {
            if (data.modifiedCount) {
                Swal.fire({
                    title: "Cashed Out!",
                    text: "Earning successfully cashed out.",
                    icon: "success"
                });
                queryClient.invalidateQueries(['myDeliveredParcels', riderId]); // Invalidate to refetch updated parcels
            } else {
                Swal.fire({
                    title: "Opps!",
                    text: "There might be an issue cashing out.",
                    icon: "error"
                });
            }
        },
        onError: (err) => {
            console.error("Error cashing out:", err);
            Swal.fire({
                title: "Error!",
                text: "Failed to cash out. Please try again.",
                icon: "error"
            });
        },
    });

    // MARKED CHANGE: Calculate Rider Earning
    const calculateRiderEarning = (parcel) => {
        if (!parcel.cost || typeof parcel.cost !== 'number') {
            return 'N/A'; // Or 0, depending on how you want to handle missing cost
        }
        const cost = parcel.cost;
        if (parcel.receiverDistrict === parcel.senderDistrict) {
            return (cost * 0.75).toFixed(2); // 75% earning
        } else {
            return (cost * 0.35).toFixed(2); // 35% earning
        }
    };

    // MARKED CHANGE: Handler for cash-out button
    const handleCashOut = (parcel) => {
        Swal.fire({
            title: "Confirm Cash Out?",
            text: `Are you sure you want to cash out earning for parcel "${parcel.parcelName}"?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Cash Out!"
        }).then((result) => {
            if (result.isConfirmed) {
                cashOutMutation.mutate(parcel._id); // Trigger the cash-out mutation
            }
        });
    };

    // Handler for viewing parcel details (optional)
    const handleViewDetails = (parcel) => {
        console.log(parcel)
        const assignedRiderInfo = parcel.assigned_rider_name ?
            `<p class="text-sm text-gray-600 mb-1"><strong>Assigned Rider:</strong> ${parcel.assigned_rider_name} (${parcel.assigned_rider_email || 'N/A'})</p>
       <p class="text-sm text-gray-600 mb-1"><strong>Rider ID:</strong> ${parcel.assigned_rider_id || 'N/A'}</p>` :
            `<p class="text-sm text-gray-600 mb-1"><strong>Assigned Rider:</strong> Not yet assigned</p>`;

        const paymentTime = parcel.payment_time && parcel.payment_time ?
            format(new Date(parcel.payment_time), 'dd MMM yyyy HH:mm') :
            'N/A';

        const creationDate = parcel.creation_date ?
            format(new Date(parcel.creation_date), 'dd MMM yyyy HH:mm') :
            'N/A';

        const cashOutTime = parcel.cash_out_time && parcel.cash_out_time ?
            format(new Date(parseInt(parcel.cash_out_time)), 'dd MMM yyyy HH:mm') :
            'Not Cashed Out';

        Swal.fire({
            title: `<span class="text-2xl font-bold text-gray-800">Parcel Details</span>`,
            html: `
        <div class="text-left p-4 space-y-2">
          <p class="text-lg font-semibold text-blue-600 mb-2">Tracking ID: ${parcel.tracking_id || 'N/A'}</p>
          <hr class="border-t border-gray-300 my-2">
          <p class="text-base text-gray-700"><strong>Parcel Name:</strong> ${parcel.parcelName || 'N/A'}</p>
          <p class="text-base text-gray-700"><strong>Type:</strong> ${parcel.type || 'N/A'}</p>
          <p class="text-base text-gray-700"><strong>Weight:</strong> ${parcel.weight || 'N/A'}</p>
          <p class="text-base text-gray-700"><strong>Cost:</strong> ${parcel.cost ? `${parcel.cost} ৳` : 'N/A'}</p>
          <p class="text-base text-gray-700"><strong>Payment Status:</strong> <span class="font-semibold ${parcel.payment_status === 'paid' ? 'text-green-500' : 'text-orange-500'}">${parcel.payment_status || 'N/A'}</span></p>
          <p class="text-base text-gray-700"><strong>Delivery Status:</strong> <span class="font-semibold ${parcel.delivery_status === 'delivered' ? 'text-green-500' :
                    parcel.delivery_status === 'in_transit' ? 'text-blue-500' :
                        parcel.delivery_status === 'rider_assigned' ? 'text-purple-500' :
                            'text-red-500'
                }">${parcel.delivery_status || 'N/A'}</span></p>
          <p class="text-base text-gray-700"><strong>Created By:</strong> ${parcel.created_by || 'N/A'}</p>
          <p class="text-base text-gray-700"><strong>Creation Date:</strong> ${creationDate}</p>
          <p class="text-base text-gray-700"><strong>Payment Time:</strong> ${paymentTime}</p>
          <p class="text-base text-gray-700"><strong>Parcel ID:</strong> ${parcel._id}</p>
          <p class="text-base text-gray-700"><strong>Cash Out Time:</strong> ${cashOutTime}</p>
          <hr class="border-t border-gray-300 my-2">
          <h4 class="font-semibold text-gray-800 mt-4 mb-2">Sender Details:</h4>
          <p class="text-sm text-gray-600 mb-1"><strong>Name:</strong> ${parcel.senderName || 'N/A'}</p>
          <p class="text-sm text-gray-600 mb-1"><strong>Contact:</strong> ${parcel.senderContact || 'N/A'}</p>
          <p class="text-sm text-gray-600 mb-1"><strong>Region:</strong> ${parcel.senderRegion || 'N/A'}</p>
          <p class="text-sm text-gray-600 mb-1"><strong>District:</strong> ${parcel.senderDistrict || 'N/A'}</p>
          <p class="text-sm text-gray-600 mb-1"><strong>Address:</strong> ${parcel.senderAddress || 'N/A'}</p>
          <p class="text-sm text-gray-600 mb-1"><strong>Pickup Instructions:</strong> ${parcel.pickupInstructions || 'N/A'}</p>
          <hr class="border-t border-gray-300 my-2">
          <h4 class="font-semibold text-gray-800 mt-4 mb-2">Receiver Details:</h4>
          <p class="text-sm text-gray-600 mb-1"><strong>Name:</strong> ${parcel.receiverName || 'N/A'}</p>
          <p class="text-sm text-gray-600 mb-1"><strong>Contact:</strong> ${parcel.receiverContact || 'N/A'}</p>
          <p class="text-sm text-gray-600 mb-1"><strong>Region:</strong> ${parcel.receiverRegion || 'N/A'}</p>
          <p class="text-sm text-gray-600 mb-1"><strong>District:</strong> ${parcel.receiverDistrict || 'N/A'}</p>
          <p class="text-sm text-gray-600 mb-1"><strong>Address:</strong> ${parcel.receiverAddress || 'N/A'}</p>
          <p class="text-sm text-gray-600 mb-1"><strong>Delivery Instructions:</strong> ${parcel.deliveryInstructions || 'N/A'}</p>
          <hr class="border-t border-gray-300 my-2">
          <h4 class="font-semibold text-gray-800 mt-4 mb-2">Assignment Details:</h4>
          ${assignedRiderInfo}
          <p class="text-sm text-gray-600 mb-1"><strong>Current Wire House:</strong> ${parcel.wire_house || 'N/A'}</p>
        </div>
      `,
            showConfirmButton: true,
            confirmButtonText: 'Close',
            width: '600px', // Adjust width as needed
            customClass: {
                popup: 'z-[9999]', // Ensure SweetAlert is on top
                title: 'text-center',
                htmlContainer: 'text-left'
            },
            didOpen: () => {
                // Optional: Any actions to perform when the modal opens
            }
        });
    };


    if (isRoleLoading || isLoadingParcels) {
        return <LoadingMini />;
    }

    if (isError) {
        return <div className="text-center py-10 text-lg text-red-600">Error: {error.message}</div>;
    }

    return (
        <div className="container mx-auto p-4 font-sans">
            <h2 className="text-3xl font-bold text-secondary-content mb-6 text-left">My Delivered Parcels</h2>

            {parcels.length === 0 ? (
                <p className="text-secondary-content text-center py-8">No delivered parcels found.</p>
            ) : (
                <div className="overflow-x-auto p-4">
                    <table className="text-primary-content table divide-y divide-gray-500">
                        {/* Table Head */}
                        <thead className='divide-y divide-gray-500'>
                            <tr className="text-sm uppercase leading-normal rounded-lg">
                                <th className="py-3 px-6 text-left rounded-tl-lg rounded-bl-lg">Parcel Name</th>
                                <th className="py-3 px-6 text-left">Tracking ID</th>
                                <th className="py-3 px-6 text-left">Sender District</th>
                                <th className="py-3 px-6 text-left">Receiver District</th>
                                <th className="py-3 px-6 text-left">Cost (BDT)</th>
                                <th className="py-3 px-6 text-left">Rider Earning (৳)</th>
                                <th className="py-3 px-6 text-center">Delivery Status</th>
                                <th className="py-3 px-6 text-left">Delivered At</th>
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
                                    {/* Sender District */}
                                    <td className="py-3 px-6 text-left">
                                        {parcel.senderDistrict || 'N/A'}
                                    </td>
                                    {/* Receiver District */}
                                    <td className="py-3 px-6 text-left">
                                        {parcel.receiverDistrict || 'N/A'}
                                    </td>
                                    {/* Cost */}
                                    <td className="py-3 px-6 text-left">
                                        {parcel.cost ? `${parcel.cost} ৳` : 'N/A'}
                                    </td>
                                    {/* MARKED CHANGE: Rider Earning Column */}
                                    <td className="py-3 px-6 text-left font-semibold text-green-700">
                                        {calculateRiderEarning(parcel)} ৳
                                    </td>
                                    {/* Delivery Status */}
                                    <td className="py-3 px-6 text-center">
                                        <span className={`badge badge-success font-semibold text-gray-800 py-2 px-3`}>
                                            {parcel.delivery_status || 'N/A'}
                                        </span>
                                    </td>
                                    {/* Delivered At */}
                                    <td className="py-3 px-6 text-left">
                                        {parcel.updated_at ? format(new Date(parcel.updated_at), 'dd MMM yyyy HH:mm') : 'N/A'}
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

                                            {/* MARKED CHANGE: Cash Out Button / Cashed Out Text */}
                                            {parcel.cashed_out ? (
                                                <span className="badge badge-info font-semibold py-5 px-3">Cashed out</span>
                                            ) : (
                                                <button
                                                    className="btn btn-sm btn-ghost btn-circle tooltip tooltip-bottom text-yellow-600"
                                                    data-tip="Cash Out Earning"
                                                    onClick={() => handleCashOut(parcel)}
                                                    disabled={cashOutMutation.isPending && cashOutMutation.variables === (parcel._id.$oid || parcel._id)}
                                                >
                                                    {cashOutMutation.isPending && cashOutMutation.variables === (parcel._id.$oid || parcel._id) ?
                                                        <span className="loading loading-spinner loading-sm"></span> :
                                                        <FaMoneyBillWave className="w-5 h-5" />
                                                    }
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
        </div>
    );
};

export default MyDeliveredParcel;
