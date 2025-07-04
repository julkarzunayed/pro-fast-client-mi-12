import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";


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

const generateTrackingID = () => {
  const date = new Date();
  const datePart = date.toISOString().split("T")[0].replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `PCL-${datePart}-${rand}`;
};

const SendParcel = () => {
  const {user} = useAuth()
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
  const [senderDistricts, setSenderDistricts] = useState([]);
  const [receiverDistricts, setReceiverDistricts] = useState([]);
  const typeOfParcel = watch("type");
  const handleRegionChange = (type, region) => {
    const selectedRegion = regions.find((r) => r.region === region);
    const districts = selectedRegion ? selectedRegion.districts : [];

    if (type === "sender") {
      setSenderDistricts(districts);
      setValue("senderDistrict", ""); // Reset sender district
    } else if (type === "receiver") {
      setReceiverDistricts(districts);
      setValue("receiverDistrict", ""); // Reset receiver district
    }
  };

 
  const onSubmit = (data) => {
    const weight = parseFloat(data.weight) || 0;
    const sameCity = data.senderDistrict === data.receiverDistrict;
    
    console.log("Form Data:", data);

    let baseCost = 0;
    let extraCost = 0;
    let breakdown = "";

    if (data.type === "document") {
      baseCost = sameCity ? 60 : 80;
      breakdown = `Document delivery ${sameCity ? "within" : "outside"} the district.`;
    } else {
      if (weight <= 3) {
        baseCost = sameCity ? 110 : 150;
        breakdown = `Non-document up to 3kg ${sameCity ? "within" : "outside"} the district.`;
      } else {
        const extraKg = weight - 3;
        const perKgCharge = extraKg * 40;
        const districtExtra = sameCity ? 0 : 40;
        baseCost = sameCity ? 110 : 150;
        extraCost = perKgCharge + districtExtra;

        breakdown = `
        Non-document over 3kg ${sameCity ? "within" : "outside"} the district.<br/>
        Extra charge: ৳40 x ${extraKg.toFixed(1)}kg = ৳${perKgCharge}<br/>
        ${districtExtra ? "+ ৳40 extra for outside district delivery" : ""}
      `;
      }
    }

    const totalCost = baseCost + extraCost;


    Swal.fire({
      title: "Delivery Cost Breakdown",
      icon: "info",
      html: `
      <div class="text-left text-base space-y-2">
        <p><strong>Parcel Type:</strong> ${data.type}</p>
        <p><strong>Weight:</strong> ${data.weight} kg</p>
        <p><strong>Delivery Zone:</strong> ${sameCity ? "Within Same District" : "Outside District"}</p>
        <hr class="my-2"/>
        <p><strong>Base Cost:</strong> ৳${baseCost}</p>
        ${extraCost > 0 ? `<p><strong>Extra Charges:</strong> ৳${extraCost}</p>` : ""}
        <div class="text-gray-500 text-sm">${breakdown}</div>
        <hr class="my-2"/>
        <p class="text-xl font-bold text-green-600">Total Cost: ৳${totalCost}</p>
      </div>
    `,
      showDenyButton: true,
      confirmButtonText: "💳 Proceed to Payment",
      denyButtonText: "✏️ Continue Editing",
      confirmButtonColor: "#16a34a",
      denyButtonColor: "#d3d3d3",
      customClass: {
        popup: "rounded-xl shadow-md px-6 py-6",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const parcelData = {
          ...data,
          cost: totalCost,
          created_by: user.email,
          payment_status: 'unpaid',
          delivery_status: 'not_collected',
          creation_date: new Date().toISOString(),
          tracking_id: generateTrackingID(),
        };

        console.log("Ready for payment:", parcelData);

        // axiosSecure.post('/parcels', parcelData)
        //   .then(res => {
        //     console.log(res.data);
        //     if (res.data.insertedId) {
        //       // TODO: redirect to a payment page 
        //       Swal.fire({
        //         title: "Redirecting...",
        //         text: "Proceeding to payment gateway.",
        //         icon: "success",
        //         timer: 1500,
        //         showConfirmButton: false,
        //       });
        //     }
        //   })

      }
    });
  };


  // const calculateCost = (type, serviceCenter, weight) => {
  //   let baseCost = type === "document" ? 100 : 150;
  //   return baseCost + weight * 30;
  // };

  // const calculateDeliveryCost = ({ type, weight, sameCity }) => {
  //   weight = parseFloat(weight || 0);
  //   console.log(type, weight, sameCity)
  //   if (type === "document") {
  //     return sameCity ? 60 : 80;
  //   }

  //   if (type === "non-document") {
  //     if (weight <= 3) {
  //       return sameCity ? 110 : 150;
  //     } else {
  //       const extraCost = 40 * Math.ceil(weight - 3); // Round up kg
  //       return sameCity ? 110 + extraCost : 150 + extraCost;
  //     }
  //   }

  //   return 0; // Default fallback
  // };

  return (
    <div className=" mx-auto p-6 ">

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-base-100 p-8 rounded-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-secondary-content mb-4">Add Parcel</h1>
        <hr className="border-t border-gray-400" />
        <h2 className="text-2xl font-bold text-secondary-content">Enter your parcel details</h2>
        {/* Parcel Info Section */}
        <fieldset className="space-y-4">
          <div>
            {/* <label className="block text-lg font-medium mb-2">Parcel Type</label> */}
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  {...register("type", { required: true })}
                  type="radio"
                  value="document"
                  className="radio radio-primary"
                />
                <span>Document</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  {...register("type", { required: true })}
                  type="radio"
                  value="non-document"
                  className="radio radio-primary"
                />
                <span>Non-Document</span>
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {/* Parcel Name */}
              <label className="block font-medium mb-2">Parcel Name</label>
              <input
                {...register("parcelName", { required: true })}
                type="text"
                placeholder="About parcel"
                className="input input-bordered w-full"
              />
            </div>
            <div>
              {/* Weight KG */}
              <label className="block font-medium mb-2">Weight (kg)</label>
              <input
                {...register("weight", { required: typeOfParcel === 'non-document' })}
                type="number"
                placeholder="Weight in KG"
                disabled={typeOfParcel === 'document'}
                onWheel={(e) => e.target.blur()}
                className="input input-bordered w-full"
              />
              {errors.weight && typeOfParcel === 'non-document' && (
                <span className="text-red-500 text-sm">Weight is required</span>
              )}
            </div>
          </div>
          <hr className="border-t border-gray-300" />
        </fieldset>
        <div className="grid lg:grid-cols-2 gap-5">

          {/* Sender Info */}
          <fieldset className="space-y-4">
            <h2 className="text-xl font-semibold">Sender Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-2">Sender Name</label>
                <input
                  {...register("senderName", { required: true })}
                  placeholder="Full Name"
                  className="input input-bordered w-full"
                />
                {errors.senderName && (
                  <span className="text-red-500 text-sm">Sender name is required</span>
                )}
              </div>
              <div>
                <label className="block font-medium mb-2">Select Region</label>
                <select
                  {...register("senderRegion", { required: true })}
                  className="select select-bordered w-full"
                  onChange={(e) => handleRegionChange("sender", e.target.value)}
                >
                  <option value="">Select Region</option>
                  {regions.map((region) => (
                    <option key={region.region} value={region.region}>
                      {region.region}
                    </option>
                  ))}
                </select>
                {errors.senderRegion && (
                  <span className="text-red-500 text-sm">Region is required</span>
                )}
              </div>
              <div>
                <label className="block font-medium mb-2">Pickup Wirehouse</label>
                <select
                  {...register("senderDistrict", { required: true })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select District</option>
                  {senderDistricts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                {errors.senderDistrict && (
                  <span className="text-red-500 text-sm">District is required</span>
                )}
              </div>
              <div>
                <label className="block font-medium mb-2">Sender Contact</label>
                <input
                  {...register("senderContact", { required: true })}
                  placeholder="01500-000000"
                  className="input input-bordered w-full"
                />
                {errors.senderContact && (
                  <span className="text-red-500 text-sm">Contact is required</span>
                )}
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2">Address</label>
              <input
                {...register("senderAddress", { required: true })}
                placeholder="Address"
                className="input w-full"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Pickup Instructions</label>
              <textarea
                {...register("pickupInstructions")}
                placeholder="Pickup Instructions"
                className="textarea textarea-bordered w-full"
              ></textarea>
            </div>
          </fieldset>

          {/* Receiver Info */}
          <fieldset className="space-y-4">
            <h2 className="text-xl font-semibold">Receiver Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-2">Receiver Name</label>
                <input
                  {...register("receiverName", { required: true })}
                  placeholder="Full Name"
                  className="input input-bordered w-full"
                />
                {errors.receiverName && (
                  <span className="text-red-500 text-sm">Receiver name is required</span>
                )}
              </div>
              <div>
                <label className="block font-medium mb-2">Select Region</label>
                <select
                  {...register("receiverRegion", { required: true })}
                  className="select select-bordered w-full"
                  onChange={(e) => handleRegionChange("receiver", e.target.value)}
                >
                  <option value="">Select Region</option>
                  {regions.map((region) => (
                    <option key={region.region} value={region.region}>
                      {region.region}
                    </option>
                  ))}
                </select>
                {errors.receiverRegion && (
                  <span className="text-red-500 text-sm">Region is required</span>
                )}
              </div>
              <div>
                <label className="block font-medium mb-2">Delivery Wirehouse</label>
                <select
                  {...register("receiverDistrict", { required: true })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select District</option>
                  {receiverDistricts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                {errors.receiverDistrict && (
                  <span className="text-red-500 text-sm">District is required</span>
                )}
              </div>
              <div>
                <label className="block font-medium mb-2">Receiver Contact</label>
                <input
                  {...register("receiverContact", { required: true })}
                  placeholder="01500-000000"
                  className="input input-bordered w-full"
                />
                {errors.receiverContact && (
                  <span className="text-red-500 text-sm">Contact is required</span>
                )}
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2">Address</label>
              <input
                {...register("receiverAddress", { required: true })}
                placeholder="Address"
                className="input w-full"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Delivery Instructions</label>
              <textarea
                {...register("deliveryInstructions")}
                placeholder="Delivery instruction"
                className="textarea textarea-bordered w-full"
              ></textarea>
            </div>
          </fieldset>
        </div>

        <p className="text-lg font-semibold">* PickUp Time 4pm-7pm Approx.</p>

        <div className="">
          <button type="submit" className="btn btn-primary text-gray-800">
            Proceed to Confirm Booking
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SendParcel;
