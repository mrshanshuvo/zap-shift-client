import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { FcGoogle } from "react-icons/fc";
import useAuth from "../../../hooks/useAuth";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signInWithGoogle } = useAuth();

  const onSubmit = (data) => {
    console.log(data);
    // Handle login logic here
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then((result) => {
        console.log("Google login successful:", result.user);
        // Redirect or show success message here
      })
      .catch((error) => {
        console.error("Error during Google login:", error.code, error.message);
      });
  };


  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
        <p className="text-gray-600 mt-2">Login with ProFast</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#CAEB66] focus:border-indigo-500"
            placeholder="Email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#CAEB66] focus:border-indigo-500"
            placeholder="Password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end">
          <a href="#" className="text-sm text-[#A1C94F] hover:text-[#8FB33F]">
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full cursor-pointer flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#CAEB66] hover:bg-[#B1D85A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CAEB66]"
        >
          Login
        </button>
      </form>

      <div className="text-center text-sm text-gray-600">
        Don't have any account?{" "}
        <Link
          to="/register"
          className="font-medium text-[#A1C94F] hover:text-[#8FB33F]"
        >
          Register
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
        type="button"
        onClick={handleGoogleSignIn}
        className="w-full cursor-pointer flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CAEB66]"
      >
        <FcGoogle className="w-5 h-5 mr-2" />
        Login with Google
      </button>

    </div>
  );
};

export default Login;
