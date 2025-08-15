"use client"
import React, { useState } from "react";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log("Password updated:", formData);
  };

  return (
    <div className="min-h-screen bg-sky-50 p-4 sm:p-6">
      <div className="w-full mx-auto">
        <div className="flex items-center mb-4 sm:mb-6 gap-1">
          <h1 className="text-xl sm:text-2xl font-bold text-black">
            Account
          </h1>
          <p className="text-sm text-[#6F6F6F]">{" > Password"}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h2>
          
          <div className="space-y-6">
            {/* Old Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Old Password
              </label>
              <input
                type="password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent bg-white"
              />
            </div>

            {/* New Password and Confirm Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent bg-white"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSubmit}
                className="bg-[#1F5546] hover:bg-[#164139] text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Updated
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;