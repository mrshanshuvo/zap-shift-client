import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import { FcGoogle } from "react-icons/fc";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useState } from "react";
import useAxios from "../../../hooks/useAxios";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { createUser, signInWithGoogle, updateUserProfile } = useAuth();
  const [profilePic, setProfilePic] = useState(null);
  const axiosInstance = useAxios()
  const location = useLocation();
  const from = location.state?.from || '/';
  console.log(location, from);

  const onSubmit = (data) => {
    createUser(data.email, data.password)
      .then(async (userCredential) => {
        toast.success("User registered successfully!");

        // 1. Prepare the complete user info object
        const userInfoDB = {
          email: data.email,
          name: data.name,
          photoURL: profilePic,
          role: "user",
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
        };

        // 2. Send to backend
        try {
          const res = await axiosInstance.post("/users", userInfoDB);
          console.log("User stored in DB:", res.data);
        } catch (error) {
          toast.error("Error updating user info: " + error.message);
          console.error("Error updating user info:", error);
        }

        // 3. Update Firebase user profile
        const userInfo = {
          displayName: data.name,
          photoURL: profilePic,
        };

        updateUserProfile(userInfo)
          .then(() => {
            toast.success("User profile updated successfully!");
          })
          .catch((error) => {
            toast.error("Error updating user profile: " + error.message);
            console.error("Error updating user profile:", error);
          });

        console.log("User registered:", userCredential.user);
        navigate(from, { replace: true });
      })
      .catch((error) => {
        toast.error("Error registering user: " + error.message);
        console.error("Error registering user:", error);
      });
  };


  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    console.log("Image uploaded:", file);
    const formData = new FormData();
    formData.append("image", file);

    const res = await axios.post(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY
      }`,
      formData
    );
    // console.log(res.data.data.url);
    setProfilePic(res.data.data.url);
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then(async (result) => {
        const user = result.user;

        toast.success("Google login successful!");
        console.log("Google login successful:", user);

        // Prepare user data to send to backend
        const userInfoDB = {
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          role: 'user',
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
        };

        try {
          // Send to your backend to save in MongoDB
          const res = await axiosInstance.post("/users", userInfoDB);
          console.log("User saved or already exists:", res.data);
        } catch (error) {
          toast.error("Error saving user info: " + error.message);
          console.error("Error saving user:", error);
        }

        navigate("/dashboard");
      })
      .catch((error) => {
        toast.error("Google sign-in failed: " + error.message);
        console.error("Google sign-in error:", error);
      });
  };

  return (
    <div className="space-y-6">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">Create an Account</h1>
        <p className="text-gray-600 mt-2">Register with ProFast</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Image Upload */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Image
          </label>
          <input
            type="file"
            id="image"
            onChange={handleImageUpload}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#CAEB66] focus:border-[#CAEB66]"
            placeholder="Name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#CAEB66] focus:border-[#CAEB66]"
            placeholder="Name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#CAEB66] focus:border-[#CAEB66]"
            placeholder="Email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#CAEB66] focus:border-[#CAEB66]"
            placeholder="Password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full cursor-pointer flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#CAEB66] hover:bg-[#B1D85A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CAEB66]"
        >
          Register
        </button>
      </form>

      <div className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-[#A1C94F] hover:text-[#8FB33F]"
        >
          Login
        </Link>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or</span>
        </div>
      </div>

      <button
        onClick={handleGoogleSignIn}
        type="button"
        className="w-full flex cursor-pointer justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CAEB66]"
      >
        <FcGoogle className="w-5 h-5 mr-2" />
        Register with Google
      </button>
    </div>
  );
};

export default Register;
