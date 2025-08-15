"use client";

import { get } from "@/services/api";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Bookingdetail = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;

      try {
        setLoading(true);
        const response = await get(`bookings/${orderId}`);
        // Handle the nested response structure
        setOrder(
          response.data?.data?.booking ||
            response.data?.booking ||
            response.data?.data
        );
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <div className="text-lg text-gray-700 font-medium">
            Loading booking details...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <div className="text-xl text-red-600 font-semibold">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Format date for readability
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "short",
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-sm p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Booking Details
              </h1>
              <p className="text-gray-600">
                Booking ID: #{order?._id?.slice(-8) || "N/A"}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                  order?.status
                )}`}
              >
                <span className="w-2 h-2 bg-current rounded-full mr-2"></span>
                {order?.status?.toUpperCase() || "UNKNOWN"}
              </span>
            </div>
          </div>
        </div>

        {order ? (
          <div className="bg-white rounded-b-2xl shadow-sm">
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
              {/* Customer Information Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-lg">👤</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Customer Information
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-gray-500 font-medium w-16">
                      Name:
                    </span>
                    <span className="text-gray-800 font-medium">
                      {order.customerId?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 font-medium w-16">
                      Email:
                    </span>
                    <span className="text-gray-800">
                      {order.customerId?.email || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 font-medium w-16">
                      Phone:
                    </span>
                    <span className="text-gray-800">
                      {order.customerId?.phone || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Service Details Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-lg">🚗</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Service Details
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-500 font-medium block">
                      Service Type:
                    </span>
                    <span className="text-gray-800 font-semibold">
                      {order.serviceType || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium block">
                      Vehicle:
                    </span>
                    <span className="text-gray-800 font-semibold">
                      {order.vehicleBrandName || "N/A"}
                    </span>
                    <span className="text-gray-600 text-sm block">
                      ({order.vehicleType || "N/A"})
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium block">
                      Passengers:
                    </span>
                    <span className="text-gray-800 font-semibold">
                      {order.passengerCount || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment & Pricing Card */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-lg">💰</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Payment & Pricing
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-500 font-medium block">
                      Estimated Price:
                    </span>
                    <span className="text-2xl font-bold text-purple-600">
                      {formatCurrency(order.estimatedPrice || 0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium block">
                      Payment Status:
                    </span>
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        order.paymentStatus === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.paymentStatus?.toUpperCase() || "PENDING"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trip Details Section */}
            <div className="px-6 pb-6">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-lg">📍</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Trip Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <span className="text-gray-500 font-medium block mb-1">
                        Pickup Location:
                      </span>
                      <span className="text-gray-800 font-semibold">
                        {order.pickupLocation || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium block mb-1">
                        Drop-off Location:
                      </span>
                      <span className="text-gray-800 font-semibold">
                        {order.dropoffLocation || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium block mb-1">
                        Pickup Date & Time:
                      </span>
                      <span className="text-gray-800 font-semibold">
                        {formatDate(order.pickupDateTime)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-gray-500 font-medium block mb-1">
                        Flight Number:
                      </span>
                      <span className="text-gray-800 font-semibold">
                        {order.flightNumber || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium block mb-1">
                        Add-on Services:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {order.addOnServices &&
                        order.addOnServices.length > 0 ? (
                          order.addOnServices.map((service, index) => (
                            <span
                              key={index}
                              className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {service}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-600">None</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium block mb-1">
                        Special Instructions:
                      </span>
                      {order.specialInstructions ? (
                        <div className="whitespace-pre-wrap break-words">
                          {order.specialInstructions
                            .match(new RegExp(`.{1,50}`, "g"))
                            ?.map((line, i) => (
                              <div key={i} className="text-gray-800">
                                {line}
                              </div>
                            )) || "None"}
                        </div>
                      ) : (
                        <span className="text-gray-800">None</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timestamps Footer */}
            <div className="px-6 pb-6">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Created:</span>{" "}
                    {formatDate(order.createdAt)}
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span>{" "}
                    {formatDate(order.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-b-2xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-xl text-gray-600">No booking details found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced helper function to get status style
const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "bg-green-500 text-white shadow-lg";
    case "pending":
      return "bg-yellow-500 text-white shadow-lg";
    case "assigned":
      return "bg-blue-500 text-white shadow-lg";
    case "accepted":
      return "bg-emerald-500 text-white shadow-lg";
    case "rejected":
      return "bg-red-500 text-white shadow-lg";
    case "in-progress":
      return "bg-purple-500 text-white shadow-lg";
    case "cancelled":
      return "bg-red-500 text-white shadow-lg";
    default:
      return "bg-gray-500 text-white shadow-lg";
  }
};

export default Bookingdetail;
