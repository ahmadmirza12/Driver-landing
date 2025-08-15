"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  signupRequest,
  signupSuccess,
  signupFailure,
} from "../../../redux/signupSlice";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios"; // Import Axios
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.name || !formData.password) {
      const errorMsg = "Please fill in all fields";
      toast.error(errorMsg);
      dispatch(signupFailure(errorMsg));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      const errorMsg = "Please enter a valid email address";
      toast.error(errorMsg);
      dispatch(signupFailure(errorMsg));
      return false;
    }

    if (formData.password.length < 6) {
      const errorMsg = "Password must be at least 6 characters long";
      toast.error(errorMsg);
      dispatch(signupFailure(errorMsg));
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    dispatch(signupRequest());
    setIsLoading(true);

    try {
      const emailCheckResponse = await axios.get(
        `https://riderbackend-gbe0.onrender.com/api/auth/email-availability?email=${encodeURIComponent(
          formData.email
        )}`
      );
      if (!emailCheckResponse.data.data.available) {
        toast.error(emailCheckResponse.data.data.message);
        dispatch(signupFailure(emailCheckResponse.data.data.message));
        return;
      }

      // Axios configuration for sending OTP
      const data = JSON.stringify({
        email: formData.email,
        purpose: "registration",
        name: formData.name,
      });

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://riderbackend-gbe0.onrender.com/api/auth/send-verification-otp",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      const otpResponse = await axios.request(config);
      console.log(otpResponse.data)
      if (otpResponse.data.success) {
        toast.success(otpResponse.data.message);
        dispatch(signupSuccess(formData));
        const query = new URLSearchParams({
          email: formData.email,
          purpose: "registration",
          name: formData.name,
          sendOtp: otpResponse.data.data.otp,
          password: formData.password,
        }).toString();
        router.push(`/screens/verification?${query}`);
      } else {
        const errorMsg = otpResponse.data.message || "Failed to send verification OTP";
        toast.error(errorMsg);
        dispatch(signupFailure(errorMsg));
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "An error occurred. Please try again.";
      toast.error(errorMsg);
      dispatch(signupFailure(errorMsg));
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-[#E8F6F2] font-body flex items-center justify-center px-4">
      <ToastContainer
        position="top-right"
        hideProgressBar={false}
        autoClose={5000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="absolute top-8 left-8">
        <h1 className="text-2xl font-bold">
          <span className="text-[#1F5546]">ASRA</span>{" "}
          <span className="text-[#EAB308]">Chauffeur</span>
        </h1>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-8 w-full max-w-md">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#060606] mb-2">Sign Up</h2>
          <p className="text-[#060606]">Create your account</p>
        </div>
        <div className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#060606] mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) => handleInputChange(e)}
              onKeyPress={handleKeyPress}
              placeholder="Your Email Address"
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F5546] focus:border-transparent outline-none transition-colors placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[#060606] mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => handleInputChange(e)}
              onKeyPress={handleKeyPress}
              placeholder="Your Full Name"
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F5546] focus:border-transparent outline-none transition-colors placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#060606] mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={(e) => handleInputChange(e)}
                onKeyPress={handleKeyPress}
                placeholder="Password (min. 6 characters)"
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F5546] focus:border-transparent outline-none transition-colors placeholder-gray-400 pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-[#1F5546] text-white py-3 px-4 rounded-lg hover:bg-[#1a4a3d] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
{isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
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
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                    ></path>
                  </svg>
                  Sign Up...
                </>
              ) : (
                "Sign Up"
              )}
        </button>
      </div>
      <div className="mt-8 text-center">
        <p className="text-[#060606]">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-[#1F5546] font-semibold hover:text-[#1a4a3d] transition-colors"
          >
            Login
          </a>
        </p>
      </div>
    </div>
    </div>
  );
};

export default Signup;