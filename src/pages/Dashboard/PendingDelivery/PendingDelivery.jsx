import React from 'react'; // useEffect is now directly imported
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { FaTruckLoading, FaCheckCircle, FaWarehouse, FaEye } from 'react-icons/fa'; // Icons for actions
import Swal from 'sweetalert2'; // Explicitly import Swal
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useUserRole from '../../../hooks/useUserRole';
import LoadingMini from '../../Loading/LoadingMini';
import { format } from 'date-fns';

// Assuming useAuth and useAxiosSecure are correctly imported from your project
// import useAuth from '../../../hooks/useAuth';
// import useAxiosSecure from '../../../hooks/useAxiosSecure';

// Dummy useAuth for demonstration


// Dummy useAxiosSecure for demonstration
// This dummy now handles GET for assigned parcels and PATCH for status updates
// End of Dummy implementations

const PendingDelivery = () => { // Renamed component
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const { userId, isRoleLoading } = useUserRole()
    const riderId = userId
    const {
        data: parcels = [],
        isLoading: isLoadingParcels,
        isError,
        error,
        // refetch
    } = useQuery({
        queryKey: ['riderAssignedParcels', riderId], // Query key includes riderId
        queryFn: async () => {
            if (!riderId) {
                throw new Error("Rider ID not available.");
            }
            const response = await axiosSecure.get(`/parcels/rider/${riderId}/assigned`);
            return response.data;
        },
        enabled: !!riderId && !isRoleLoading, // Only run if riderId is available and auth is not loading
        staleTime: 5 * 60 * 1000,
    });
    const updateParcelStatusMutation = useMutation({
        mutationFn: async ({ parcelId, newStatus }) => {
            const response = await axiosSecure.patch(`/parcel/${parcelId}/rider`, {
                delivery_status: newStatus
            });
            console.log(response)
            return response.data;
        },
        onSuccess: (data, variables) => {
            if (data.modifiedCount) {
                Swal.fire({
                    title: "Success!",
                    text: `Parcel status updated to ${variables.newStatus}.`,
                    icon: "success"
                });
                queryClient.invalidateQueries(['riderAssignedParcels', riderId]); // Invalidate to refetch updated parcels
            } else {
                Swal.fire({
                    title: "Opps!",
                    text: "There might be some issue updating the parcel status.",
                    icon: "error"
                });
            }
        },
        onError: (err) => {
            console.error("Error updating parcel status:", err);
            Swal.fire({
                title: "Error!",
                text: "Failed to update parcel status. Please try again.",
                icon: "error"
            });
        },
    });

    // Handler for Pick Up button
    const handlePickUp = (parcel) => {
        Swal.fire({
            title: "Confirm Pick Up?",
            text: `Are you sure you want to pick up parcel "${parcel.parcelName}"?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Pick Up!"
        }).then((result) => {
            if (result.isConfirmed) {
                updateParcelStatusMutation.mutate({
                    parcelId: parcel._id,
                    newStatus: 'in_transit'
                });
            }
        });
    };

    // Handler for Deliver Parcel button (same district)
    const handleDeliverParcel = (parcel) => {
        Swal.fire({
            title: "Confirm Delivery?",
            text: `Are you sure you want to deliver parcel "${parcel.parcelName}"?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Deliver!"
        }).then((result) => {
            if (result.isConfirmed) {
                updateParcelStatusMutation.mutate({
                    parcelId: parcel._id,
                    newStatus: 'delivered'
                });
            }
        });
    };

    // Handler for Deliver to Wire House button (different district)
    const handleDeliverToWireHouse = (parcel) => {
        Swal.fire({
            title: "Confirm Handover?",
            text: `Are you sure you want to deliver parcel "${parcel.parcelName}" to the wire house?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Handover!"
        }).then((result) => {
            if (result.isConfirmed) {
                updateParcelStatusMutation.mutate({
                    parcelId: parcel._id,
                    newStatus: 'delivered_to_wire_house'
                });
            }
        });
    };

    // Handler for viewing parcel details (optional)
    const handleViewDetails = (parcel) => {
        console.log(parcel)
        const parcelId = parcel._id;
        const assignedRiderInfo = parcel.assigned_rider_name ?
            `<p class="text-sm text-gray-600 mb-1"><strong>Assigned Rider:</strong> ${parcel.assigned_rider_name} (${parcel.assigned_rider_email || 'N/A'})</p>
       <p class="text-sm text-gray-600 mb-1"><strong>Rider ID:</strong> ${parcel.assigned_rider_id || 'N/A'}</p>` :
            `<p class="text-sm text-gray-600 mb-1"><strong>Assigned Rider:</strong> Not yet assigned</p>`;

        const paymentTime = parcel.payment_time ? format(new Date(parcel.payment_time), 'dd MMM yyyy HH:mm') :
            'N/A';

        const creationDate = parcel.creation_date ?
            format(new Date(parcel.creation_date), 'dd MMM yyyy HH:mm') :
            'N/A';


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
                        parcel.delivery_status === 'rider_assign' ? 'text-purple-500' :
                            'text-red-500'
                }">${parcel.delivery_status || 'N/A'}</span></p>
          <p class="text-base text-gray-700"><strong>Created By:</strong> ${parcel.created_by || 'N/A'}</p>
          <p class="text-base text-gray-700"><strong>Creation Date:</strong> ${creationDate}</p>
          <p class="text-base text-gray-700"><strong>Payment Time:</strong> ${paymentTime}</p>
          <p class="text-base text-gray-700"><strong>Parcel Id:</strong> ${parcelId}</p>
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
        return <LoadingMini></LoadingMini>;
    }

    if (isError) {
        return <div className="text-center py-10 text-lg text-red-600">Error: {error.message}</div>;
    }

    return (
        <div className="mx-auto p-4 font-sans">
            <h2 className="text-3xl font-bold text-secondary-content mb-6 text-left">Rider Pending Tasks</h2> {/* Updated Heading */}

            {parcels.length === 0 ? (
                <p className="text-secondary-content text-center py-8">No pending tasks found.</p>
            ) : (
                <div className="overflow-x-auto p-4">
                    <table className="text-primary-content table divide-y divide-gray-500">
                        {/* Table Head */}
                        <thead className='divide-y divide-gray-500'>
                            <tr className="text-sm uppercase leading-normal rounded-lg">
                                <th className="py-3 px-6 text-left rounded-tl-lg rounded-bl-lg">Parcel Name</th>
                                {/* <th className="py-3 px-6 text-left">Tracking ID</th> */}
                                <th className="py-3 px-6 text-left">Sender District</th>
                                <th className="py-3 px-6 text-left">Receiver District</th>
                                {/* <th className="py-3 px-6 text-center">Delivery Status</th> */}
                                <th className="py-3 px-6 text-center rounded-tr-lg rounded-br-lg">Actions Buttons</th>
                            </tr>
                        </thead>
                        {/* Table Body */}
                        <tbody className="text-sm font-light divide-y divide-gray-500">
                            {parcels.map((parcel, index) => (
                                <tr
                                    // onClick={() => handleViewDetails(parcel)}
                                    key={parcel._id}
                                    className={index % 2 === 0 ? 'bg-base-100' : 'bg-base-300'}>
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
                                    {/* <td className="py-3 px-6 text-left">
                                        {parcel.tracking_id || 'N/A'}
                                    </td> */}
                                    {/* Sender District */}
                                    <td className="py-3 px-6 text-left">
                                        {parcel.senderDistrict || 'N/A'}
                                    </td>
                                    {/* Receiver District */}
                                    <td className="py-3 px-6 text-left">
                                        {parcel.receiverDistrict || 'N/A'}
                                    </td>
                                    {/* Delivery Status */}
                                    {/* <td className="py-3 px-6 text-center">
                                        <span className={`badge ${parcel.delivery_status === 'rider_assign' ? 'badge-warning' :
                                            parcel.delivery_status === 'in_transit' ? 'badge-info' :
                                                'badge-neutral' 
                                            } font-semibold text-gray-800 py-2 px-3`}>
                                            {parcel.delivery_status || 'N/A'}
                                        </span>
                                    </td> */}
                                    {/* Actions */}
                                    <td className=" p-0 text-center rounded-tr-lg rounded-br-lg">
                                        <div className=" items-center justify-center space-x-2">
                                            <button
                                                className="btn btn-sm btn-ghost btn-circle tooltip tooltip-bottom"
                                                data-tip="View Details"
                                                onClick={() => handleViewDetails(parcel)}
                                            >
                                                <FaEye className="w-5 h-5 text-blue-500" />
                                            </button>

                                            {/* Conditional Action Buttons */}
                                            {parcel.delivery_status === 'rider_assign' && (
                                                <button
                                                    className="badge badge-warning btn tooltip tooltip-bottom "
                                                    data-tip="Pick Up Parcel"
                                                    onClick={() => handlePickUp(parcel)}
                                                    disabled={updateParcelStatusMutation.isPending && updateParcelStatusMutation.variables?.parcelId === parcel._id}
                                                >
                                                    {updateParcelStatusMutation.isPending && updateParcelStatusMutation.variables?.parcelId === parcel._id ?
                                                        <span className="loading loading-spinner loading-sm"></span> :
                                                        <div className="">
                                                            PicK Up Parcel
                                                        </div>
                                                    }
                                                </button>
                                            )}

                                            {parcel.delivery_status === 'in_transit' && (
                                                parcel.wire_house === parcel.receiverDistrict ? (
                                                    <button
                                                        className="badge badge-info btn tooltip tooltip-bottom text-purple-500"
                                                        data-tip="Deliver Parcel"
                                                        onClick={() => handleDeliverParcel(parcel)}
                                                        disabled={updateParcelStatusMutation.isPending && updateParcelStatusMutation.variables?.parcelId === (parcel._id.$oid || parcel._id)}
                                                    >
                                                        {updateParcelStatusMutation.isPending && updateParcelStatusMutation.variables?.parcelId === (parcel._id.$oid || parcel._id) ?
                                                            <span className="loading loading-spinner loading-sm"></span> :
                                                            <div className="">
                                                                Deliver to Receiver
                                                            </div>
                                                        }
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="badge badge-info btn tooltip tooltip-bottom"
                                                        data-tip="Deliver to Wire House"
                                                        onClick={() => handleDeliverToWireHouse(parcel)}
                                                        disabled={updateParcelStatusMutation.isPending && updateParcelStatusMutation.variables?.parcelId === (parcel._id.$oid || parcel._id)}
                                                    >
                                                        {updateParcelStatusMutation.isPending && updateParcelStatusMutation.variables?.parcelId === (parcel._id.$oid || parcel._id) ?
                                                            <span className="loading loading-spinner loading-sm"></span> :
                                                            <div className="">
                                                                Deliver to Were House
                                                            </div>
                                                        }
                                                    </button>
                                                )
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

export default PendingDelivery;
