"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { post } from "@/services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const router = useRouter();
  const[isLoading,setIsLoading]=useState(false)
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit =async () => {
    const data = {
      email: formData.email,
      purpose: "password-reset",
    };
    try {
      setIsLoading(true)
      const response = await post("auth/send-verification-otp", data);
      console.log(response.data)
      if (response.data.success===true) {
        toast.success("Password reset email sent successfully");
        const query = new URLSearchParams({
          email: formData.email,
          purpose: "password-reset",
          sendOtp: response.data.data.otp,
        }).toString();
        router.push(`/screens/verification?${query}`);
      }
    } catch (error) {
      toast.error(error.message);
    }finally{
      setIsLoading(false)
    }
  };

  return (
    <div className="min-h-screen bg-[#E8F6F2] font-body flex items-center justify-center px-4">
      {/* Logo */}
      <div className="absolute top-8 left-8">
        <h1 className="text-2xl font-bold">
          <span className="text-[#1F5546]">ASRA</span>{" "}
          <span className="text-[#EAB308]">Chauffeur</span>
        </h1>
      </div>

      {/* Login Form */}
      <div className="bg-white rounded-lg shadow-sm p-8 w-full max-w-md">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#060606] mb-2">
            Forgot Password
          </h2>
          <p className="text-[#060606]">
            Enter your email address to reset your password
          </p>
        </div>

        <div className="space-y-6">
          {/* Email Field */}
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
              onChange={handleInputChange}
              placeholder="Your Email Address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F5546] focus:border-transparent outline-none transition-colors placeholder-gray-400"
            />
          </div>

          {/* Login Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-[#1F5546] text-white py-3 px-4 rounded-lg  transition-colors font-medium flex items-center justify-center"
            disabled={isLoading}
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
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
