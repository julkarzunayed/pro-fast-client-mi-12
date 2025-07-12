import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query'; // For data fetching (placeholder)
import { FaCheck, FaTimes, FaEye } from 'react-icons/fa'; // Icons for actions
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { HiOutlineMail } from "react-icons/hi";
import { MdContactPhone } from "react-icons/md";
import Loading from '../../Loading/Loading';

const PendingRiders = () => {
    const axiosSecure = useAxiosSecure();
    const [riderDetails, setRiderDetails] = useState({})

    const { data: riders = [], isLoading, isError, error, refetch } = useQuery({
        queryKey: ['pendingRiders'],
        queryFn: async () => {
            const response = await axiosSecure.get(`/riders?status=pending`);
            return response.data;
        },
    });

    // Handler for approving a rider
    const handleApprove = async (rider) => {
        // console.log(rider);
        Swal.fire({
            title: "Are you sure?",
            text: "You want to accept the request!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Active"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const result = await axiosSecure.patch(`/riders/${rider._id}`, {
                    status: 'active',
                    email: rider.email
                })
                console.log(result.data)
                if (result.data.modifiedCount) {
                    Swal.fire({
                        title: "Activate!",
                        text: "Request accepted successfully",
                        icon: "success"
                    });
                    refetch()
                } else {
                    Swal.fire({
                        title: "Opps!",
                        text: "There might be some issue.",
                        icon: "error"
                    });
                }

            }
        });
    };

    // Handler for rejecting a rider
    const handleReject = (rider) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Your want to reject the rider request!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Reject"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const result = await axiosSecure.patch(`/riders/${rider._id}`, {
                    status: 'reject',
                    email: rider.email
                })
                console.log(result.data)
                if (result.data.modifiedCount) {
                    Swal.fire({
                        title: "Rejected!",
                        text: "Request rejected successfully",
                        icon: "success"
                    });
                    refetch()
                } else {
                    Swal.fire({
                        title: "Opps!",
                        text: "There might be some issue.",
                        icon: "error"
                    });
                }

            }
        });
    };

    if (isLoading) {
        return <Loading></Loading>
    }

    if (isError) {
        return <div className="text-center py-10 text-lg text-red-600">Error: {error.message}</div>;
    }

    return (
        <div className="p-4 font-sans">
            <h2 className="text-3xl font-bold text-secondary-content mb-6 text-left">Pending Riders</h2>

            {riders.length === 0 ? (
                <p className="text-secondary-content text-center py-8">No pending rider applications found.</p>
            ) : (
                <div className="overflow-x-auto p-4">
                    <table className="text-primary-content table divide-y divide-gray-500">
                        {/* Table Head */}
                        <thead className='divide-y divide-gray-500'>
                            <tr className=" text-sm uppercase leading-normal rounded-lg">
                                <th className="py-3 px-6 text-left rounded-tl-lg rounded-bl-lg">Name</th>
                                <th className="py-3 px-6 text-left">Email</th>
                                <th className="py-3 px-6 text-left">Contact</th>
                                <th className="py-3 px-6 text-center">Status</th>
                                <th className="py-3 px-6 text-center rounded-tr-lg rounded-br-lg">Actions</th>
                            </tr>
                        </thead>
                        {/* Table Body */}
                        <tbody className=" text-sm font-light divide-y divide-gray-500">
                            {riders.map((rider, index) => (
                                <tr key={rider._id} className={index % 2 === 0 ? 'bg-base-100' : 'bg-base-300'}>
                                    {/* Name */}
                                    <td className="py-3 px-6 text-left rounded-tl-lg rounded-bl-lg">
                                        <span
                                            className="font-medium max-w-[180px] truncate block tooltip tooltip-bottom"
                                            data-tip={rider.name}
                                            title={rider.name}
                                        >
                                            {rider.name || 'N/A'}
                                        </span>
                                    </td>
                                    {/* Email */}
                                    <td className="py-3 px-6 text-left">
                                        {rider.email || 'N/A'}
                                    </td>
                                    {/* Contact */}
                                    <td className="py-3 px-6 text-left">
                                        {rider.contact || 'N/A'}
                                    </td>
                                    {/* Status */}
                                    <td className="py-3 px-6 text-center ">
                                        <span className={`badge ${rider.status === 'pending' ? 'badge-warning' : 'badge-success'}  font-semibold text-gray-800 py-2 px-3`}>
                                            {rider.status}
                                        </span>
                                    </td>
                                    {/* Actions */}
                                    <td className="py-3 px-6 text-center rounded-tr-lg rounded-br-lg">
                                        <div className="flex item-center justify-center space-x-2">
                                            <button
                                                className="btn btn-sm btn-ghost btn-circle tooltip tooltip-bottom"
                                                data-tip="View Details"
                                                onClick={() => {
                                                    setRiderDetails(rider);
                                                    document.getElementById('my_modal_2').showModal()
                                                }}
                                            >
                                                <FaEye className="w-5 h-5 text-blue-500" />
                                            </button>
                                            <button
                                                className="btn btn-sm btn-ghost btn-circle tooltip tooltip-bottom text-green-500"
                                                data-tip="Approve Rider"
                                                onClick={() => handleApprove(rider)}
                                            >
                                                <FaCheck className="w-5 h-5" />
                                            </button>
                                            <button
                                                className="btn btn-sm btn-ghost btn-circle tooltip tooltip-bottom text-red-500"
                                                data-tip="Reject Rider"
                                                onClick={() => handleReject(rider)}
                                            >
                                                <FaTimes className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            {/* <button className="btn" onClick={() => document.getElementById('my_modal_2').showModal()}>open modal</button> */}
            <dialog id="my_modal_2" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-xl text-center">
                        Rider:  {riderDetails?.name}
                    </h3>

                    <hr className='border-t my-5 border-dashed border-primary-content' />

                    <p className="py-4 flex items-center">
                        <HiOutlineMail />:  {riderDetails?.email}
                    </p>
                    <dov className="">
                        Status:
                        <span className={`badge ${riderDetails?.status === 'pending' ? 'badge-warning' : 'badge-success'}  font-semibold text-gray-800 py-2 px-3`}>
                            {riderDetails?.status}
                        </span>
                        <br />
                        Region: {riderDetails?.region}
                        <br />
                        Wire House: {riderDetails?.wire_house}
                        <br />
                        NID: {riderDetails?.nid}
                        <br />
                        <span className='flex items-center'>
                            <MdContactPhone /> : {riderDetails?.contact}
                        </span>
                        {/* <br /> */}
                        Age: {riderDetails?.age}
                        <br />
                        DB Id: {riderDetails?._id}
                        <div className="mt-3 text-right">
                            <form
                                onClick={() => setRiderDetails({})}
                                method="dialog">
                                <button className='btn bg-primary text-black'>
                                    Close
                                </button>
                            </form>
                        </div>
                    </dov>
                </div>
                <form
                    method="dialog"
                    onClick={() => setRiderDetails({})}
                    className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default PendingRiders;
