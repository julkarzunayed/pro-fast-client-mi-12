import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaEye } from 'react-icons/fa'; // Only FaEye for view details
import { HiOutlineMail } from "react-icons/hi";
import { MdContactPhone } from "react-icons/md";
import { format } from 'date-fns'; // For date formatting
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../Loading/Loading';

// Assuming useAxiosSecure and Swal are correctly imported from your project



const ActiveRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [riderDetails, setRiderDetails] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce the search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const { data: riders = [], isLoading, isError, error } = useQuery({
    queryKey: ['activeRiders', debouncedSearchTerm], // Include debounced search term in query key
    queryFn: async () => {
      // In a real application, you might pass the search term to the API
      // const response = await axiosSecure.get(`/riders?status=active&search=${debouncedSearchTerm}`);
      // return response.data;

      // For dummy data, we'll filter client-side
      const response = await axiosSecure.get(`/riders?status=active`);
      const allActiveRiders = response.data;

      if (debouncedSearchTerm) {
        const lowerCaseSearchTerm = debouncedSearchTerm.toLowerCase();
        return allActiveRiders.filter(rider =>
          rider.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          rider.email.toLowerCase().includes(lowerCaseSearchTerm) ||
          (rider.contact && rider.contact.includes(lowerCaseSearchTerm))
        );
      }
      return allActiveRiders;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Handler for viewing rider details
  const handleView = (rider) => {
    setRiderDetails(rider);
    document.getElementById('my_modal_2').showModal();
  };

  if (isLoading) {
    return <Loading></Loading>;
  }

  if (isError) {
    return <div className="text-center py-10 text-lg text-red-600">Error: {error.message}</div>;
  }

  return (
    <div className="p-4 font-sans">
      <h2 className="text-3xl font-bold text-secondary-content mb-6 text-left">Active Riders</h2>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search riders by name, email, or contact..."
          className="input input-bordered w-full max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {riders.length === 0 ? (
        <p className="text-secondary-content text-center py-8">No active rider applications found.</p>
      ) : (
        <div className="overflow-x-auto p-4">
          <table className="text-primary-content table divide-y divide-gray-500">
            {/* Table Head */}
            <thead className='divide-y divide-gray-500'>
              <tr className=" text-sm uppercase leading-normal rounded-lg">
                <th className="py-3 px-6 text-left rounded-tl-lg rounded-bl-lg">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Region</th>
                <th className="py-3 px-6 text-left">District</th>
                <th className="py-3 px-6 text-left">Contact</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-left">Joined At</th> 
                <th className="py-3 px-6 text-center rounded-tr-lg rounded-br-lg">Actions</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody className=" text-sm font-light divide-y divide-gray-500">
              {riders.map((rider, index) => (
                <tr key={rider._id.$oid || rider._id} className={index % 2 === 0 ? 'bg-base-100' : 'bg-base-300'}>
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
                  {/* Region */}
                  <td className="py-3 px-6 text-left">
                    {rider.region || 'N/A'}
                  </td>
                  {/* District (using wire_house as per your data) */}
                  <td className="py-3 px-6 text-left">
                    {rider.wire_house || 'N/A'}
                  </td>
                  {/* Contact */}
                  <td className="py-3 px-6 text-left">
                    {rider.contact || 'N/A'}
                  </td>
                  {/* Status */}
                  <td className="py-3 px-6 text-center ">
                    <span className={`badge badge-success font-semibold text-gray-800 py-2 px-3`}> {/* Always success badge */}
                      {rider.status}
                    </span>
                  </td>
                  {/* Joined At */}
                  <td className="py-3 px-6 text-left">
                    {rider.created_at ? format(new Date(rider.created_at), 'dd MMM yyyy HH:mm') : 'N/A'}
                  </td>
                  {/* Actions */}
                  <td className="py-3 px-6 text-center rounded-tr-lg rounded-br-lg">
                    <div className="flex item-center justify-center space-x-2">
                      <button
                        className="btn btn-sm btn-ghost btn-circle tooltip tooltip-bottom"
                        data-tip="View Details"
                        onClick={() => handleView(rider)}
                      >
                        <FaEye className="w-5 h-5 text-blue-500" />
                      </button>
                      {/* Approve and Reject buttons are removed for active riders */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal for Rider Details */}
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-xl text-center">
            Rider: {riderDetails?.name}
          </h3>

          <hr className='border-t my-5 border-dashed border-primary-content' />

          <p className="py-2 flex items-center gap-2">
            <HiOutlineMail className="w-5 h-5" /> {riderDetails?.email}
          </p>
          <p className="py-2 flex items-center gap-2">
            <MdContactPhone className="w-5 h-5" /> {riderDetails?.contact}
          </p>
          <p className="py-2">Status: <span className={`badge badge-success font-semibold text-gray-800 py-2 px-3`}>{riderDetails?.status}</span></p>
          <p className="py-2">Region: {riderDetails?.region}</p>
          <p className="py-2">Wire House: {riderDetails?.wire_house}</p>
          <p className="py-2">NID: {riderDetails?.nid}</p>
          <p className="py-2">Age: {riderDetails?.age}</p>
          <p className="py-2">DB Id: {riderDetails?._id?.$oid || riderDetails?._id}</p>
          <div className="mt-3 text-right">
            <form
              onClick={() => setRiderDetails({})} // Clear details on close
              method="dialog">
              <button className='btn bg-primary text-black'>
                Close
              </button>
            </form>
          </div>
        </div>
        <form
          method="dialog"
          onClick={() => setRiderDetails({})} // Clear details on backdrop click
          className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default ActiveRiders;
