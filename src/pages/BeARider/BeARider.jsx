import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import rider from '../../assets/agent-pending.png';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';

// Data for regions and districts (as provided by the user)
const regions = [
    {
        region: "Dhaka",
        districts: [
            "Dhaka",
            "Faridpur",
            "Gazipur",
            "Gopalganj",
            "Kishoreganj",
            "Madaripur",
            "Manikganj",
            "Munshiganj",
            "Narayanganj",
            "Narsingdi",
            "Rajbari",
            "Shariatpur",
            "Tangail",
        ],
    },
    {
        region: "Chattogram",
        districts: [
            "Chattogram",
            "Cox's Bazar",
            "Cumilla",
            "Brahmanbaria",
            "Chandpur",
            "Feni",
            "Khagrachari",
            "Lakshmipur",
            "Noakhali",
            "Rangamati",
            "Bandarban",
        ],
    },
    {
        region: "Sylhet",
        districts: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
    },
    {
        region: "Khulna",
        districts: [
            "Khulna",
            "Jessore",
            "Satkhira",
            "Bagerhat",
            "Magura",
            "Narail",
            "Jhenaidah",
            "Chuadanga",
            "Meherpur",
            "Kushtia",
        ],
    },
    {
        region: "Rajshahi",
        districts: [
            "Rajshahi",
            "Natore",
            "Naogaon",
            "Chapainawabganj",
            "Pabna",
            "Sirajganj",
            "Joypurhat",
            "Bogura",
        ],
    },
    {
        region: "Barisal",
        districts: [
            "Barisal",
            "Bhola",
            "Patuakhali",
            "Pirojpur",
            "Barguna",
            "Jhalokati",
        ],
    },
    {
        region: "Rangpur",
        districts: [
            "Rangpur",
            "Dinajpur",
            "Thakurgaon",
            "Panchagarh",
            "Nilphamari",
            "Lalmonirhat",
            "Kurigram",
            "Gaibandha",
        ],
    },
    {
        region: "Mymensingh",
        districts: ["Mymensingh", "Netrokona", "Jamalpur", "Sherpur"],
    },
];

const BeARider = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    // Initialize react-hook-form with reset for region/district dependency
    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();

    // Watch the 'region' field to dynamically update districts
    const selectedRegionName = watch("region");

    // State to hold the districts for the currently selected region
    const [availableDistricts, setAvailableDistricts] = useState([]);

    // Effect to update availableDistricts when selectedRegionName changes
    useEffect(() => {
        if (selectedRegionName) {
            const foundRegion = regions.find(r => r.region === selectedRegionName);
            if (foundRegion) {
                setAvailableDistricts(foundRegion.districts);
                // Reset the district field if the region changes, to avoid invalid selections
                setValue("district", "");
            }
        } else {
            setAvailableDistricts([]); // Clear districts if no region is selected
            setValue("district", "");
        }
    }, [selectedRegionName, setValue]);


    // Handle form submission
    const onSubmit = (data) => {
        const formData = {
            ...data,
            status: 'pending',
            created_at: new Date().toISOString(),
        }
        console.log(data);
        axiosSecure.post(`/riders`, formData)
            .then(res => {
                if (res.data.insertedId) {
                    console.log(res.data);
                    Swal.fire({
                        title: "Application submitted",
                        icon: "success",
                    });
                    reset();
                }
            })

    };

    return (
        <div className="py-12 px-4 text-secondary-content sm:px-6 lg:px-12 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Title and Description Section */}
                <div className="text-left ">
                    <h1 className="text-4xl md:text-5xl font-bold  leading-tight mb-4">
                        Be a Rider
                    </h1>
                    <p className="text-lg md:text-xl max-w-2xl">
                        Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.
                    </p>
                </div>

                <hr className='border-t my-12 border-primary-content' />

                {/* Two-Column Layout: Form and Image */}
                <div className="flex flex-col-reverse lg:flex-row text-primary-content gap-6 lg:items-end">
                    {/* Form Section (Left Column) */}
                    <div className="flex-1 rounded-lg w-full">
                        <h2 className="text-3xl font-bold  mb-6 text-center md:text-left">
                            Tell us about yourself
                        </h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* First 6 fields in 2 columns */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        {...register("name", { required: "Name is required" })}
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        value={user.displayName}
                                    />
                                    {errors.name && <p className="mt-1 text-red-500 text-xs">{errors.name.message}</p>}
                                </div>
                                {/* Age */}
                                <div>
                                    <label htmlFor="age" className="block text-sm font-medium mb-1">Your Age</label>
                                    <input
                                        type="number"
                                        id="age"
                                        {...register("age", { required: "Age is required", min: { value: 18, message: "Must be at least 18" } })}
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        placeholder="25"
                                    />
                                    {errors.age && <p className="mt-1 text-red-500 text-xs">{errors.age.message}</p>}
                                </div>
                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-1">Your Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } })}
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        value={user.email}
                                    />
                                    {errors.email && <p className="mt-1 text-red-500 text-xs">{errors.email.message}</p>}
                                </div>

                                {/* Region Select Field */}
                                <div>
                                    <label htmlFor="region" className="block text-sm font-medium mb-1">Your Region</label>
                                    <select
                                        id="region"
                                        {...register("region", { required: "Region is required" })}
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    >
                                        <option
                                            className='text-black'
                                            value="">
                                            Select your region
                                        </option>
                                        {regions.map((r) => (
                                            <option
                                                className='text-black'
                                                key={r.region}
                                                value={r.region}>
                                                {r.region}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.region && <p className="mt-1 text-red-500 text-xs">{errors.region.message}</p>}
                                </div>
                                {/* NID */}
                                <div>
                                    <label htmlFor="nid" className="block text-sm font-medium mb-1">Your NID</label>
                                    <input
                                        type="text"
                                        id="nid"
                                        {...register("nid", { required: "NID is required" })}
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        placeholder="1234567890"
                                    />
                                    {errors.nid && <p className="mt-1 text-red-500 text-xs">{errors.nid.message}</p>}
                                </div>
                                {/* Contact Number */}
                                <div>
                                    <label htmlFor="contact" className="block text-sm font-medium mb-1">Contact Number</label>
                                    <input
                                        type="tel" // Use type="tel" for phone numbers
                                        id="contact"
                                        {...register("contact", { required: "Contact number is required" })}
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        placeholder="+8801XXXXXXXXX"
                                    />
                                    {errors.contact && <p className="mt-1 text-red-500 text-xs">{errors.contact.message}</p>}
                                </div>
                            </div>

                            {/* District Select Field (formerly warehouse) */}
                            <div>
                                <label htmlFor="district" className="block text-sm font-medium mb-1">Which wire-house you want to work?</label>
                                <select
                                    id="district"
                                    {...register("wire_house", { required: "Please select a district" })}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    disabled={!selectedRegionName || availableDistricts.length === 0} // Disable if no region selected
                                >
                                    <option
                                        className='text-black'>
                                        {selectedRegionName ? "Select a wire-house" : "Select a region first"}
                                    </option>
                                    {availableDistricts.map((district) => (
                                        <option
                                            className='text-black'
                                            key={district}
                                            value={district}>
                                            {district}
                                        </option>
                                    ))}
                                </select>
                                {errors.district && <p className="mt-1 text-red-500 text-xs">{errors.district.message}</p>}
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-secondary bg-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Submit Application
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Image Section (Right Column) */}
                    <div className="flex-1 flex justify-center"> {/* Hidden on small screens, shown on medium and up */}
                        <img
                            src={rider}
                            alt="Rider Application"
                            className="max-w-3xs sm:max-w-xs md:max-w-sm h-auto rounded-lg shadow-lg object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeARider;
