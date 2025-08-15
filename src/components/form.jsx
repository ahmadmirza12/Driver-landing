"use client";
import { post } from "@/services/api";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateBookingForm } from "@/redux/slices/bookingSlice";

const BookingForm = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.authConfigs);
  console.log("state", state);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);
  const [activeTab, setActiveTab] = useState("instant");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:=====>", formData);
    dispatch(updateBookingForm(formData));
    
    // Create URLSearchParams object and append all form data
    const params = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        // Handle nested objects like coordinates
        if (typeof value === 'object') {
          params.append(key, JSON.stringify(value));
        } else {
          params.append(key, value);
        }
      }
    });
    
    handleClick(params.toString());
  };
  
  const handleClick = (params = '') => {
    if (state.token) {
      window.open(`/screens/createOrder?${params}`, '_blank');
    } else {
      // Store the params in session storage to use after login
      if (params) {
        sessionStorage.setItem('bookingParams', params);
      }
      window.open('/screens/login', '_blank');
    }
  };

  // Format date for datetime-local input (YYYY-MM-DDTHH:MM)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    serviceType: "Airport Transfer",
    vehicleType: "Sedan",
    vehicleBrandName: "Select",
    addOnService: "None",
    pickupLocation: "",
    pickupLocationCoords: null,
    dropoffLocation: "",
    dropoffLocationCoords: null,
    pickupDateTime: "",
    flightNumber: "",
    specialInstructions: "",
    passengerCount: 1,
    estimatedPrice: 0,
  });

  const [suggestions, setSuggestions] = useState({
    pickup: [],
    dropoff: [],
  });
  const [activeField, setActiveField] = useState(null);

  const fetchLocations = async (query, field) => {
    if (!query || query.length < 3) {
      setSuggestions((prev) => ({
        ...prev,
        [field]: [],
      }));
      return;
    }

    try {
      const response = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      setSuggestions((prev) => ({
        ...prev,
        [field]: data.features || [],
      }));
    } catch (error) {
      console.error("Error fetching locations:", error);
      setSuggestions((prev) => ({
        ...prev,
        [field]: [],
      }));
    }
  };

  const handleLocationSelect = (location, field) => {
    const { name, country, state, city } = location.properties;
    const displayName = [name, city, state, country].filter(Boolean).join(", ");

    setFormData((prev) => ({
      ...prev,
      [`${field}Location`]: displayName,
      [`${field}LocationCoords`]: {
        lat: location.geometry.coordinates[1],
        lng: location.geometry.coordinates[0],
      },
    }));

    setSuggestions((prev) => ({
      ...prev,
      [field]: [],
    }));

    setActiveField(null);
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    const field = name === "pickupLocation" ? "pickup" : "dropoff";

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      [`${field}LocationCoords`]: null,
    }));

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      fetchLocations(value, field);
    }, 300);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    // Skip if it's a location field (handled separately)
    if (name === "pickupLocation" || name === "dropoffLocation") {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const serviceTypes = ["Airport Transfer", "City Transfer"];
  const vehicleTypes = ["Sedan", "SUV", "Van"];
  const vehicleBrands = [
    "Select",
    "Toyota Camry",
    "Toyota Corolla",
    "Honda Accord",
    "Honda Civic",
    "BMW 3 Series",
    "Mercedes C-Class",
    "Audi A4",
    "Lexus ES",
    "Cadillac CTS",
    "Nissan Altima",
    "Hyundai Sonata",
  ];
  const addOnServices = ["None", "Airport Assistance"];

  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-24 xl:px-32 py-10 sm:py-16 md:py-20 font-body bg-gray-100 rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-tl-[100px] rounded-br-[60px] sm:rounded-br-[80px] lg:rounded-br-[100px] overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex flex-row w-full max-w-md sm:max-w-lg md:max-w-[500px] mx-auto mb-6 bg-[#1F5546] rounded-lg p-1 space-x-2">
        <button
          onClick={() => setActiveTab("instant")}
          className={`px-3 sm:px-6 py-2 text-xs sm:text-sm font-medium rounded-lg flex-1 transition-all duration-200 ${
            activeTab === "instant"
              ? "bg-[#EAB308] text-black shadow-md"
              : "text-white hover:bg-[#2a6b5b]"
          }`}
        >
          Instant Booking
        </button>
        <button
          onClick={() => setActiveTab("quote")}
          className={`px-3 sm:px-6 py-2 text-xs sm:text-sm font-medium rounded-lg flex-1 transition-all duration-200 ${
            activeTab === "quote"
              ? "bg-[#EAB308] text-black shadow-md"
              : "text-white hover:bg-[#2a6b5b]"
          }`}
        >
          Request A Quote
        </button>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="w-full mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Left Column */}
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label
                    htmlFor="serviceType"
                    className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                  >
                    Service Type
                  </label>
                  <div className="relative">
                    <select
                      id="serviceType"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500 appearance-none focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent text-sm sm:text-base"
                    >
                      {serviceTypes.map((service, index) => (
                        <option key={index} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-black"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="vehicleBrandName"
                    className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                  >
                    Vehicle Brand/Name
                  </label>
                  <div className="relative">
                    <select
                      id="vehicleBrandName"
                      name="vehicleBrandName"
                      value={formData.vehicleBrandName}
                      onChange={handleInputChange}
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500 appearance-none focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent text-sm sm:text-base"
                    >
                      {vehicleBrands.map((brand, index) => (
                        <option key={index} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-black"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <label
                    htmlFor="pickupLocation"
                    className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                  >
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    id="pickupLocation"
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handleLocationChange}
                    onFocus={() => setActiveField("pickup")}
                    onBlur={() => setTimeout(() => setActiveField(null), 200)}
                    className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-900 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent"
                    placeholder="Start typing to search locations..."
                  />
                  {suggestions.pickup.length > 0 &&
                    activeField === "pickup" && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {suggestions.pickup.map((suggestion, index) => (
                          <div
                            key={index}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() =>
                              handleLocationSelect(suggestion, "pickup")
                            }
                          >
                            <div className="font-medium">
                              {suggestion.properties.name || "Unnamed location"}
                            </div>
                            <div className="text-sm text-gray-600">
                              {[
                                suggestion.properties.city,
                                suggestion.properties.state,
                                suggestion.properties.country,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
                <div className="relative">
                  <label
                    htmlFor="vehicleType"
                    className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                  >
                    Vehicle Type
                  </label>
                  <div className="relative">
                    <select
                      id="vehicleType"
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleInputChange}
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500 appearance-none focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent text-sm sm:text-base"
                    >
                      {vehicleTypes.map((type, index) => (
                        <option key={index} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-black"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label
                    htmlFor="addOnService"
                    className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                  >
                    Add-on Services
                  </label>
                  <div className="relative">
                    <select
                      id="addOnService"
                      name="addOnService"
                      value={formData.addOnService}
                      onChange={handleInputChange}
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500 appearance-none focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent text-sm sm:text-base"
                    >
                      {addOnServices.map((service, index) => (
                        <option key={index} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-black"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="flightNumber"
                    className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                  >
                    Flight Number{" "}
                    <span className="text-gray-500">(Optional)</span>
                  </label>
                  <input
                    id="flightNumber"
                    name="flightNumber"
                    value={formData.flightNumber}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Number"
                    className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent text-sm sm:text-base"
                  />
                </div>

                <div className="relative">
                  <label
                    htmlFor="dropoffLocation"
                    className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                  >
                    Dropoff Location
                  </label>
                  <input
                    type="text"
                    id="dropoffLocation"
                    name="dropoffLocation"
                    value={formData.dropoffLocation}
                    onChange={handleLocationChange}
                    onFocus={() => setActiveField("dropoff")}
                    onBlur={() => setTimeout(() => setActiveField(null), 200)}
                    className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-900 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent"
                    placeholder="Start typing to search locations..."
                  />
                  {suggestions.dropoff.length > 0 &&
                    activeField === "dropoff" && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {suggestions.dropoff.map((suggestion, index) => (
                          <div
                            key={index}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() =>
                              handleLocationSelect(suggestion, "dropoff")
                            }
                          >
                            <div className="font-medium">
                              {suggestion.properties.name || "Unnamed location"}
                            </div>
                            <div className="text-sm text-gray-600">
                              {[
                                suggestion.properties.city,
                                suggestion.properties.state,
                                suggestion.properties.country,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>

                <div>
                  <label
                    htmlFor="passengerCount"
                    className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                  >
                    Passenger Count
                  </label>
                  <input
                    id="passengerCount"
                    name="passengerCount"
                    value={formData.passengerCount}
                    onChange={handleInputChange}
                    type="number"
                    min="1"
                    placeholder="Number of passengers"
                    className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
              <div>
                <label
                  htmlFor="pickupDateTime"
                  className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                >
                  Pickup Date & Time
                </label>
                <input
                  id="pickupDateTime"
                  name="pickupDateTime"
                  value={formData.pickupDateTime}
                  onChange={handleInputChange}
                  type="datetime-local"
                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent text-sm sm:text-base"
                />
              </div>
              <div>
                <label
                  htmlFor="estimatedPrice"
                  className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                >
                  Estimated Price
                </label>
                <input
                  id="estimatedPrice"
                  name="estimatedPrice"
                  value={formData.estimatedPrice}
                  onChange={handleInputChange}
                  type="number"
                  step="0.01"
                  placeholder="e.g., 50.00"
                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent text-sm sm:text-base"
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="specialInstructions"
                  className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                >
                  Special Instructions{" "}
                  <span className="text-gray-500">(Optional)</span>
                </label>
                <textarea
                  id="specialInstructions"
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  placeholder="e.g., Please call when you arrive"
                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent text-sm sm:text-base min-h-[80px]"
                />
              </div>
            </div>

            <div className="mt-6 sm:mt-8 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-[#1F5546] hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-md font-medium transition-colors duration-200 text-sm sm:text-base"
              >
                {loading ? "Creating Order..." : "Create Booking"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
