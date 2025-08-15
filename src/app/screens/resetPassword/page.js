"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { post } from "@/services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading,setIsLoading]=useState(false)
  const email = searchParams.get("email") || "";
  const verificationToken = decodeURIComponent(searchParams.get("verificationToken") || "")
  console.log(verificationToken)
  const [formData, setFormData] = useState({
    email,
    newPassword: "",
    confirmPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.email) {
      toast.error("Email address is missing.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error("Please fill in both password fields.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    try {
      setIsLoading(true)
      const response = await post("auth/reset-password", {
        email: formData.email,
        newPassword: formData.newPassword,
        verificationToken: verificationToken,
      });

      if (response.data.success===true) {
        toast.success("Password reset successfully!");
        router.push("/screens/login"); 
      } else {
        toast.error(
          response.data.message || "Failed to reset password. Please try again."
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred. Please try again.");
      console.error("Password reset error:", error);
    }finally{
      setIsLoading(false)
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
          <h2 className="text-3xl font-bold text-[#060606] mb-2">
            Reset Password
          </h2>
          <p className="text-[#060606]">
            Enter your email and new password to reset your account.
          </p>
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
              onChange={handleInputChange}
              placeholder="Your Email Address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F5546] focus:border-transparent outline-none transition-colors placeholder-gray-400"
              disabled
            />
          </div>
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-[#060606] mb-2"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="New Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F5546] focus:border-transparent outline-none transition-colors placeholder-gray-400 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-[#060606] mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F5546] focus:border-transparent outline-none transition-colors placeholder-gray-400 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <button
          onClick={handleSubmit}
              type="submit"
              className="w-full bg-[#1F5546] text-white py-3 px-4 rounded-lg transition-colors font-medium flex items-center justify-center"
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
        {/* <div className="mt-8 text-center">
          <p className="text-[#060606]">
            Back to{" "}
            <a
              href="/login"
              className="text-[#1F5546] font-semibold transition-colors"
            >
              Login
            </a>
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default ResetPassword;
