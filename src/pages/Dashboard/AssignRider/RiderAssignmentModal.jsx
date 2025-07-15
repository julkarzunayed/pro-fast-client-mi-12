import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
// Assuming useAxiosSecure and Swal are correctly imported from your project
// import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2'; // Explicitly import Swal
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { ImCheckmark } from "react-icons/im";
import LoadingMini from '../../Loading/LoadingMini';
// In your main App.js or index.js
import 'sweetalert2/dist/sweetalert2.min.css';
import useAuth from '../../../hooks/useAuth';


const RiderAssignmentModal = ({ parcel, onClose, refetch }) => {
    console.log(parcel)
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [selectedRider, setSelectedRider] = useState(null);

    // Fetch all active riders
    const { data: activeRiders = [], isLoading, isError, error } = useQuery({
        queryKey: ['activeRidersForAssignment', parcel],
        queryFn: async () => {
            // Replace with your actual API endpoint for active riders
            const response = await axiosSecure.get(`/riders?wire_house=${parcel.senderDistrict}`);
            console.log(response.data)
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
    });

    // useMutation for assigning the rider
    const assignRiderMutation = useMutation({
        mutationFn: async ({ parcelId, riderId, riderName }) => {
            const response = await axiosSecure.patch(`/parcels/${parcelId}/assign`, {
                delivery_status: "rider_assigned",
                assign_rider_email: user.emil,
                assigned_rider_id: riderId,
                assigned_rider_name: riderName,
            });
            console.log(response)
            return response.data;
        },
        onSuccess: (data) => {
            refetch()
            // console.log(data)
            if (data.updateParcel.modifiedCount) {
                Swal.fire({
                    title: "Assigned!",
                    text: "Rider assigned successfully.",
                    icon: "success"
                });
                queryClient.invalidateQueries(['allParcels']); // Invalidate to refetch updated parcels in parent
                onClose(); // Close the modal and trigger parent's cleanup
            } else {
                Swal.fire({
                    title: "Opps!",
                    text: "There might be some issue assigning the rider.",
                    icon: "error"
                });
            }
        },
        onError: (err) => {
            console.error("Error assigning rider:", err);
            Swal.fire({
                title: "Error!",
                text: "Failed to assign rider. Please try again.",
                icon: "error"
            });
        },
    });


    // Handle rider selection
    const handleSelectRider = (rider) => {
        setSelectedRider(rider);
    };

    // Handle assignment confirmation
    const handleConfirmAssignment = () => {
        if (!selectedRider) {
            Swal.fire({
                icon: 'warning',
                title: 'No Rider Selected',
                text: 'Please select a rider to assign.',
            });
            return;
        }

        Swal.fire({
            title: "Confirm Assignment?",
            html: `Assign <strong>${selectedRider.name}</strong> to parcel <strong>${parcel.parcelName}</strong>?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Assign!",
            customClass: {
                popup: 'z-[9999]'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                //Call the mutation
                assignRiderMutation.mutate({
                    parcelId: parcel._id,
                    riderId: selectedRider._id,
                    riderName: selectedRider.name
                });
            }
        });
    };

    // Automatically open the modal when component mounts (DaisyUI specific)
    useEffect(() => {
        document.getElementById('assign_rider_modal').showModal();
    }, []);

    return (
        <dialog
            id="assign_rider_modal"
            className="modal z-20"
            style={{ zIndex: 40 }}>
            <div className="modal-box w-11/12 max-w-2xl z-20">
                <h3 className="font-bold text-lg text-center mb-4">Assign Rider to Parcel: {parcel?.parcelName}</h3>
                <p className="text-primary-content text-center mb-6">Sender's District: <span className="font-semibold text-blue-600">{parcel?.senderDistrict || 'N/A'}</span></p>

                {isLoading ? (
                    <LoadingMini />
                ) : isError ? (
                    <p className="text-center py-4 text-red-600">
                        Error loading riders: {error.message}
                    </p>
                ) : activeRiders.length === 0 ? (
                    <p className="text-center py-4text-primary-content">
                        No active riders found in {parcel?.sender?.district || 'this district'}.
                    </p>
                ) : (
                    <div className="max-h-[80vh] overflow-y-auto border border-gray-500 rounded-md p-1">
                        <div className="space-y-2">
                            {activeRiders.map(rider => (
                                <div
                                    key={rider.id}
                                    className={`p-2 hover:bg-base-300 border rounded-lg ${selectedRider?._id === rider._id && 'border-primary'} flex justify-between items-center`}
                                    onClick={() => handleSelectRider(rider)}
                                >
                                    <div className=''>
                                        <p className="font-medium text-lg ">
                                            {rider.name}
                                        </p>
                                        <p className="text-sm text-primary-content">
                                            Works in: {rider.wire_house}
                                        </p>
                                        <p className="text-sm text-primary-content">
                                            Contact: {rider.contact}
                                        </p>
                                    </div>
                                    {selectedRider?._id === rider._id && (
                                        <span className="text-primary font-bold">
                                            <ImCheckmark size={30} />
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="modal-action flex justify-between mt-6">
                    <button className="btn" onClick={onClose}>Close</button>
                    <button
                        className="btn btn-primary text-black"
                        onClick={() => {
                            onClose()
                            handleConfirmAssignment()
                        }}
                        disabled={!selectedRider || assignRiderMutation.isPending}
                    >
                        {assignRiderMutation.isPending ? 'Assigning...' : 'Confirm Assignment'}
                    </button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop" onClick={onClose}>
                <button>close</button>
            </form>
        </dialog>
    );
};

export default RiderAssignmentModal;
