import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const CustomSelect = ({ children, register, name, options, onChange, error }) => {
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

const BeARider = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const serviceCenters = useLoaderData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Organize regions and their districts
  const regionsData = serviceCenters.reduce((acc, area) => {
    if (!acc[area.region]) acc[area.region] = [];
    if (!acc[area.region].includes(area.district)) acc[area.region].push(area.district);
    return acc;
  }, {});

  const regions = Object.keys(regionsData);
  const selectedRegion = watch("region");

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const applicationData = {
      ...data,
      email: user.email,
      name: user.displayName,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    console.log(applicationData);

    try {
      const res = await axiosSecure.post("/riders", applicationData);
      if (res.data?.insertedId) {
        Swal.fire({
          title: "Application Submitted!",
          text: "Your rider request is under review.",
          icon: "success",
          confirmButtonText: "Okay",
        });
      }
    } catch (err) {
      console.error(err.message);
      Swal.fire("Error", "Failed to submit your application", "error");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Become a Rider</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-xl border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={user.displayName}
              readOnly
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={user.email}
              readOnly
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              {...register("phone", { required: "Phone is required" })}
              className="w-full p-3 border border-gray-200 rounded-lg"
              placeholder="Enter your 11 digit number"
            />
            {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NID Card Number</label>
            <input
              type="text"
              {...register("nid", { required: "NID is required" })}
              className="w-full p-3 border border-gray-200 rounded-lg"
              placeholder="Enter your 10 or 17 digit NID"
            />
            {errors.nid && <p className="text-sm text-red-600">{errors.nid.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input
              type="number"
              min="18"
              max="70"
              {...register("age", {
                required: "Age is required",
                min: { value: 18, message: "Must be at least 18 years old" },
                max: { value: 70, message: "Must be under 70 years old" },
              })}
              className="w-full p-3 border border-gray-200 rounded-lg"
              placeholder="Enter your age"
            />
            {errors.age && (
              <p className="text-sm text-red-600">{errors.age.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bike Brand</label>
            <input
              type="text"
              {...register("bikeBrand", { required: "Bike brand is required" })}
              className="w-full p-3 border border-gray-200 rounded-lg"
              placeholder="e.g. Yamaha, Honda, TVS"
            />
            {errors.bikeBrand && <p className="text-sm text-red-600">{errors.bikeBrand.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bike Registration Number</label>
            <input
              type="text"
              {...register("bikeRegNo", { required: "Registration number is required" })}
              className="w-full p-3 border border-gray-200 rounded-lg"
              placeholder="e.g. DHAKA-METRO-HA-123456"
            />
            {errors.bikeRegNo && <p className="text-sm text-red-600">{errors.bikeRegNo.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
            <CustomSelect
              register={register}
              name="region"
              options={{ required: "Region is required" }}
              onChange={(e) => {
                setValue("region", e.target.value);
                setValue("district", "");
              }}
              error={errors.region}
            >
              <option value="">Select region</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </CustomSelect>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
            <CustomSelect
              register={register}
              name="district"
              options={{ required: "District is required" }}
              error={errors.district}
            >
              <option value="">Select district</option>
              {(regionsData[selectedRegion] || []).map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </CustomSelect>
          </div>

        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
          <textarea
            {...register("additionalInfo")}
            className="w-full p-3 border border-gray-200 rounded-lg min-h-[100px]"
            placeholder="e.g. Any experience or comments"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-70"
        >
          {isSubmitting ? "Submitting..." : "Submit Rider Application"}
        </button>
      </form>
    </div>
  );
};

export default BeARider;
