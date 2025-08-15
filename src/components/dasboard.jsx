"use client";
import React, { useState } from 'react';
import { Car, MoreHorizontal } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();
  const [activePoint, setActivePoint] = useState(null);

  const chartData = [
    { month: 'Jan', value: 5000 },
    { month: 'Feb', value: 7000 },
    { month: 'Mar', value: 5500 },
    { month: 'Apr', value: 6500 },
    { month: 'May', value: 9000 },
    { month: 'Jun', value: 6000 },
    { month: 'Jul', value: 8000 },
    { month: 'Aug', value: 7200 },
    { month: 'Sep', value: 7800 },
    { month: 'Oct', value: 7500 },
    { month: 'Nov', value: 6800 },
    { month: 'Dec', value: 4200 },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-sky-50 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Dashboard</h1>
        <button 
          onClick={() => router.push('/screens/createOrder')} 
          className="w-full sm:w-auto bg-[#1F5546] text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-800 transition-colors text-sm sm:text-base"
        >
          Create Order
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Active Ride Card */}
        <div className="bg-[#1F5546] text-white p-4 sm:p-6 rounded-2xl relative overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-medium">Active Ride</h3>
            <span className="text-xl sm:text-2xl font-bold">$20</span>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="flex flex-col items-center mt-1">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                <div className="w-0.5 h-5 sm:h-6 bg-white/30 mt-1"></div>
              </div>
              <div>
                <div className="text-xs text-white/70 mb-1">Pick-up</div>
                <div className="text-sm font-medium">123 main st</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex flex-col items-center mt-1">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full"></div>
              </div>
              <div>
                <div className="text-xs text-white/70 mb-1">Drop Off</div>
                <div className="text-sm font-medium">123 main st</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-xs sm:text-sm space-y-1">
              <div>Time: 10 min</div>
              <div>Distance: 2.5 km</div>
            </div>
            <button className="w-full sm:w-auto bg-white text-[#1F5546] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
              Track Ride
            </button>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl flex flex-col justify-between shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total orders</h3>
            <div className="bg-gray-400 rounded-md p-2 sm:p-3">
              <Car className="w-5 h-5 sm:w-6 sm:h-6 text-[#1F5546]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900">30</div>
        </div>

        {/* Completed Orders Card */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl flex flex-col justify-between shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Completed Orders</h3>
            <div className="bg-gray-400 rounded-md p-2 sm:p-3">
              <Car className="w-5 h-5 sm:w-6 sm:h-6 text-[#1F5546]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900">30</div>
        </div>

        {/* Cancel Order Card */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl flex flex-col justify-between shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Cancel Order</h3>
            <div className="bg-gray-400 rounded-md p-2 sm:p-3">
              <Car className="w-5 h-5 sm:w-6 sm:h-6 text-[#1F5546]" />
            </div>

          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900">24</div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Average Orders</h3>
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal size={16} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Line Chart */}
        <div className="h-64 sm:h-80 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 20,
                left: 0,
                bottom: 20,
              }}
              onMouseMove={(data) => {
                if (data && data.activePayload) {
                  setActivePoint(data.activePayload[0].payload);
                }
              }}
              onMouseLeave={() => setActivePoint(null)}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#6b7280' }}
                className="sm:text-sm"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#6b7280' }}
                tickFormatter={(value) => `${value / 1000}k`}
                className="sm:text-sm"
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#1F5546"
                strokeWidth={2}
                dot={{ fill: '#1F5546', strokeWidth: 1.5, r: 3 }}
                activeDot={{ r: 5, stroke: '#1F5546', strokeWidth: 1.5, fill: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Custom Tooltip */}
          {activePoint && (
            <div
              className="absolute bg-[#1F5546] text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center pointer-events-none z-10"
              style={{
                top: '20px',
                left: `${(chartData.findIndex((d) => d.month === activePoint.month) + 1) * (100 / chartData.length)}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full mr-1 sm:mr-2"></div>
              {activePoint.value.toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;