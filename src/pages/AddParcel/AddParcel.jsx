import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { useLoaderData } from "react-router";
import { FiChevronDown } from "react-icons/fi";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const AddParcel = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const serviceAreas = useLoaderData();

  // Organize regions and their districts
  const regionsData = serviceAreas.reduce((acc, area) => {
    if (!acc[area.region]) {
      acc[area.region] = [];
    }
    if (!acc[area.region].includes(area.district)) {
      acc[area.region].push(area.district);
    }
    return acc;
  }, {});

  const regions = Object.keys(regionsData);

  // Get districts for a region
  const getDistricts = (region) => {
    return regionsData[region] || [];
  };

  // Get cities for a district
  const getCities = (district) => {
    const area = serviceAreas.find((a) => a.district === district);
    return area ? area.covered_area : [];
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const parcelType = watch("parcelType", "Not-Document");
  const senderRegion = watch("senderRegion");
  const senderDistrict = watch("senderDistrict");
  const receiverRegion = watch("receiverRegion");
  const receiverDistrict = watch("receiverDistrict");

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const cost = calculateCost(data);

    const isSameDistrict = data.senderDistrict === data.receiverDistrict;
    const isDocument = data.parcelType === "Document";
    const weight = parseFloat(data.weight);
    const extraWeightCharge =
      weight > 3 ? (Math.ceil(weight - 3) * 40).toFixed(2) : null;

    let htmlContent = `
    <div style="text-align: left; font-family: sans-serif;">
      <p style="font-size: 1.1rem; font-weight: 600;">
        Delivery Estimate: <span style="color: #2563eb; font-weight: 700;">৳${cost.toFixed(
          2
        )}</span>
      </p>
      <div style="margin-top: 10px; font-size: 0.9rem; color: #4b5563;">
        ${
          isDocument
            ? `<p>- Document fee: ৳${isSameDistrict ? 60 : 80}</p>`
            : `
              <p>- Non-Document base fee: ৳${isSameDistrict ? 110 : 150}</p>
              ${
                extraWeightCharge
                  ? `<p>- Extra weight charge (+৳40/kg): ৳${extraWeightCharge}</p>`
                  : ""
              }
              ${
                !isSameDistrict && extraWeightCharge
                  ? `<p>- Additional outside city charge: ৳40</p>`
                  : ""
              }
            `
        }
      </div>
    </div>
  `;

    MySwal.fire({
      title: "Confirm Your Booking",
      html: htmlContent,
      showCancelButton: true,
      confirmButtonText: "Confirm Booking",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-xl shadow-lg",
        confirmButton:
          "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700",
        cancelButton:
          "border border-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-100",
      },
      showCloseButton: true,
      focusConfirm: false,
      preConfirm: () => confirmBooking(data, cost),
    });

    setIsSubmitting(false);
  };

  const calculateCost = (data) => {
    // Base delivery agent fee
    let cost = 0;

    // Get distance type (within city or outside city/district)
    const isWithinCity = data.senderDistrict === data.receiverDistrict;

    // Add parcel type cost
    if (data.parcelType === "Document") {
      cost += isWithinCity ? 60 : 80;
    } else {
      // Non-Document
      const weight = parseFloat(data.weight) || 0;
      cost += isWithinCity ? 110 : 150;

      // Additional weight cost for Non-Document over 3kg
      if (weight > 3) {
        const extraWeight = Math.ceil(weight - 3); // Round up to nearest kg
        cost += extraWeight * 40;

        // Additional charge for outside city
        if (!isWithinCity) {
          cost += 40;
        }
      }
    }

    return cost;
  };

  const confirmBooking = async (data, cost) => {
    try {
      const parcelData = {
        ...data,
        cost,
        status: "Pending",
        creation_date: new Date().toISOString(),
      };

      console.log("Booking parcel with data:", parcelData);

      // Dismiss the estimation toast
      toast.dismiss("cost-estimation");

      // Show success toast
      toast.success(
        <div>
          <p className="font-medium">Parcel booked successfully!</p>
          <p className="text-sm text-gray-600 mt-1">
            Tracking ID: #
            {Math.random().toString(36).substring(2, 10).toUpperCase()}
          </p>
        </div>,
        {
          position: "top-center",
          autoClose: 5000,
          className: "!rounded-xl",
        }
      );
    } catch (error) {
      toast.error("Failed to book parcel", {
        position: "top-center",
        className: "!rounded-xl",
      });
      console.log(error.message);
    }
  };

  // Custom Select Component
  const CustomSelect = ({
    children,
    register,
    name,
    options,
    onChange,
    error,
  }) => {
    return (
      <div className="relative">
        <select
          {...register(name, options)}
          onChange={onChange}
          className="w-full p-3 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
        >
          {children}
        </select>
        <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        toastStyle={{
          margin: "0 auto",
          width: "fit-content",
        }}
      />

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create New Shipment
        </h1>
        <p className="text-gray-500">
          Fast, reliable door-to-door delivery service
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Parcel Info Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-5">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></div>
            <h2 className="text-xl font-semibold text-gray-800">
              Parcel Details
            </h2>
          </div>

          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parcel Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${
                      parcelType === "Document"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      {...register("parcelType")}
                      value="Document"
                      className="hidden"
                    />
                    <div className="flex items-center">
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center mr-2 ${
                          parcelType === "Document"
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-400"
                        }`}
                      >
                        {parcelType === "Document" && (
                          <span className="w-2 h-2 bg-white rounded-full"></span>
                        )}
                      </span>
                      <span>Document</span>
                    </div>
                  </label>
                  <label
                    className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${
                      parcelType === "Not-Document"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      {...register("parcelType")}
                      value="Not-Document"
                      className="hidden"
                    />
                    <div className="flex items-center">
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center mr-2 ${
                          parcelType === "Not-Document"
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-400"
                        }`}
                      >
                        {parcelType === "Not-Document" && (
                          <span className="w-2 h-2 bg-white rounded-full"></span>
                        )}
                      </span>
                      <span>Non-Document</span>
                    </div>
                  </label>
                </div>
              </div>

              {parcelType === "Not-Document" && (
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (kg)
                    <span className="text-xs text-gray-500 ml-1">
                      (Additional ৳40/kg after 3kg)
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      {...register("weight", {
                        required: "Weight is required",
                        min: { value: 0.1, message: "Minimum 0.1kg" },
                      })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="0.0"
                    />
                    <span className="absolute right-3 top-3 text-gray-400">
                      kg
                    </span>
                  </div>
                  {errors.weight && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.weight.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parcel Description
              </label>
              <input
                type="text"
                {...register("parcelName", {
                  required: "Description is required",
                })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="e.g. Important documents"
              />
              {errors.parcelName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.parcelName.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sender Info Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-5">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></div>
            <h2 className="text-xl font-semibold text-gray-800">
              Pickup Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                {...register("senderName", { required: "Name is required" })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              {errors.senderName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.senderName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                {...register("senderContact", {
                  required: "Contact is required",
                })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              {errors.senderContact && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.senderContact.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Region
              </label>
              <CustomSelect
                register={register}
                name="senderRegion"
                options={{ required: "Region is required" }}
                onChange={(e) => {
                  setValue("senderRegion", e.target.value);
                  setValue("senderDistrict", "");
                }}
                error={errors.senderRegion}
              >
                <option value="">Select region</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </CustomSelect>
            </div>

            {senderRegion && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District
                </label>
                <CustomSelect
                  register={register}
                  name="senderDistrict"
                  options={{ required: "District is required" }}
                  onChange={(e) => {
                    setValue("senderDistrict", e.target.value);
                    setValue("senderServiceCenter", "");
                  }}
                  error={errors.senderDistrict}
                >
                  <option value="">Select district</option>
                  {getDistricts(senderRegion).map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </CustomSelect>
              </div>
            )}

            {senderDistrict && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nearest Hub
                </label>
                <CustomSelect
                  register={register}
                  name="senderServiceCenter"
                  options={{ required: "Hub is required" }}
                  error={errors.senderServiceCenter}
                >
                  <option value="">Select hub</option>
                  {getCities(senderDistrict).map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </CustomSelect>
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Address
              </label>
              <input
                type="text"
                {...register("senderAddress", {
                  required: "Address is required",
                })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              {errors.senderAddress && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.senderAddress.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Instructions
              </label>
              <textarea
                {...register("pickupInstruction", {
                  required: "Instructions are required",
                })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition min-h-[100px]"
                placeholder="e.g. Leave with reception, call before arrival"
              ></textarea>
              {errors.pickupInstruction && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.pickupInstruction.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Receiver Info Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-5">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></div>
            <h2 className="text-xl font-semibold text-gray-800">
              Delivery Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Name
              </label>
              <input
                type="text"
                {...register("receiverName", { required: "Name is required" })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              {errors.receiverName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.receiverName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                {...register("receiverContact", {
                  required: "Contact is required",
                })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              {errors.receiverContact && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.receiverContact.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Region
              </label>
              <CustomSelect
                register={register}
                name="receiverRegion"
                options={{ required: "Region is required" }}
                onChange={(e) => {
                  setValue("receiverRegion", e.target.value);
                  setValue("receiverDistrict", "");
                }}
                error={errors.receiverRegion}
              >
                <option value="">Select region</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </CustomSelect>
            </div>

            {receiverRegion && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District
                </label>
                <CustomSelect
                  register={register}
                  name="receiverDistrict"
                  options={{ required: "District is required" }}
                  onChange={(e) => {
                    setValue("receiverDistrict", e.target.value);
                    setValue("receiverServiceCenter", "");
                  }}
                  error={errors.receiverDistrict}
                >
                  <option value="">Select district</option>
                  {getDistricts(receiverRegion).map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </CustomSelect>
              </div>
            )}

            {receiverDistrict && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nearest Hub
                </label>
                <CustomSelect
                  register={register}
                  name="receiverServiceCenter"
                  options={{ required: "Hub is required" }}
                  error={errors.receiverServiceCenter}
                >
                  <option value="">Select hub</option>
                  {getCities(receiverDistrict).map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </CustomSelect>
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Address
              </label>
              <input
                type="text"
                {...register("receiverAddress", {
                  required: "Address is required",
                })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              {errors.receiverAddress && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.receiverAddress.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Instructions
              </label>
              <textarea
                {...register("deliveryInstruction", {
                  required: "Instructions are required",
                })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition min-h-[100px]"
                placeholder="e.g. Leave with neighbor if not home"
              ></textarea>
              {errors.deliveryInstruction && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.deliveryInstruction.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="text-center pt-2">
          <p className="text-sm text-gray-500 mb-5">
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
              Estimated pickup window: 4pm-7pm
            </span>
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Calculate & Book Shipment"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddParcel;
