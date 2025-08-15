"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    phoneNumber: "",
    country: ""
  });
  
  const router = useRouter();              
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    router.push("/screens/changePassword2");
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-sky-50 p-4 sm:p-6">
      <div className="w-full mx-auto">
        <div className="flex items-center mb-4 sm:mb-6 gap-1">
        <h1 className="text-xl sm:text-2xl font-bold text-black  ">
          Account 
        </h1>
        <p className="text-sm text-[#6F6F6F]">{" > Change Password"}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Edit Profile</h2>
          
          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent bg-white"
              />
            </div>

            {/* Email and Age Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent bg-white"
                />
              </div>
            </div>

            {/* Phone Number and Country Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
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

export default EditProfile;