"use client";
import { get } from "@/services/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdLocationPin } from "react-icons/md";

const Orders = () => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Updated filters to match specified statuses
  const filters = [
    "All",
    "Pending",
    "Assigned",
    "Accepted",
    "Rejected",
    "In-progress",
    "Completed",
    "Cancelled",
  ];

  const getButtonStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-[#1F5546] hover:bg-[#164139] text-white";
      case "pending":
        return "bg-[#EAB308] hover:bg-[#CA8A04] text-white";
      case "assigned":
        return "bg-blue-500 hover:bg-blue-600 text-white";
      case "accepted":
        return "bg-green-500 hover:bg-green-600 text-white";
      case "rejected":
        return "bg-red-500 hover:bg-red-600 text-white";
      case "in-progress":
        return "bg-purple-500 hover:bg-purple-600 text-white";
      case "cancelled":
        return "bg-red-500 hover:bg-red-600 text-white";
      default:
        return "bg-gray-500 hover:bg-gray-600 text-white";
    }
  };

  const getOrders = async () => {
    try {
      // Construct query parameters
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(activeFilter !== "All" && { status: activeFilter.toLowerCase() }),
      });

      const response = await get(`bookings/my-bookings?${queryParams}`);
      console.log("Orders data=========>:", response.data?.data?.bookings);
      setData(response.data?.data?.bookings || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setData([]);
    }
  };

  useEffect(() => {
    getOrders();
  }, [activeFilter, page]);

  return (
    <div className="min-h-screen bg-sky-50 p-4 sm:p-6">
      <div className="w-full mx-auto">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
          Orders
        </h1>
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-medium text-gray-800 mb-4 sm:mb-6">
            Orders
          </h2>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  setPage(1); // Reset to first page when filter changes
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === filter
                    ? "bg-[#1F5546] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Orders Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/screens/Bookingdetail?id=${order._id}`)}
              >
                <div className="flex justify-between items-start">
                  {/* Pickup and Drop Off Locations */}
                  <div>
                    <div className="flex items-start mb-4">
                      <div className="flex flex-col items-center mr-3">
                        <MdLocationPin color="#1F5546" size={24} />
                        <div className="w-0.5 h-8 bg-gray-300 my-1"></div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-1">Pickup</div>
                        <div className="text-gray-800 font-medium">
                          {order.pickupLocation}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start mb-6">
                      <div className="flex flex-col items-center mr-3">
                        <MdLocationPin color="#1F5546" size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-1">
                          Drop Off
                        </div>
                        <div className="text-gray-800 font-medium">
                          {order.dropoffLocation}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Price and Details */}
                  <div className="text-right space-y-2">
                    <h1 className="text-2xl font-bold text-[#1F5546]">
                      ${order.estimatedPrice}
                    </h1>
                  </div>
                </div>

                {/* Status Button */}
                <div className="flex justify-end">
                  <button
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${getButtonStyle(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {data.length === 0 && (
            <div className="text-center py-12 col-span-full">
              <p className="text-gray-500">
                No orders found for the selected filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;