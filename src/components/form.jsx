"use client";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateBookingForm } from "@/redux/slices/bookingSlice";
import { get } from "@/services/api";

const BookingForm = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.authConfigs);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);
  const [activeTab, setActiveTab] = useState("instant");

  const [vehicleData, setVehicleData] = useState({
    makes: [],
    models: [],
    modelsByMake: {},
  });

  const [dropdownStates, setDropdownStates] = useState({
    serviceTypes: false,
    addOnServices: false,
    vehicleTypes: false,
    vehicleMakes: false,
    vehicleModels: false,
  });

  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState([]);
  const [selectedMakes, setSelectedMakes] = useState([]);
  const [selectedModels, setSelectedModels] = useState([]);

  const vehicleTypes = ["Sedan", "SUV", "Hatchback", "Luxury", "Van", "Bus"];
  const serviceTypes = [
    "Airport Transfer",
    "City Transfer",
    "Daily Hire",
    "Full-Day Hire",
    "Multi-Day Hire",
    "Multi Hire",
  ];
  const addOnServices = ["None", "Airport Assistance", "Wi-Fi", "Child Seat", "Meet & Greet", "Extra Luggage"];

  const fetchVehicles = async () => {
    try {
      const response = await get("auth/vehicles/makes-models");
      console.log("Vehicles data:============>", response.data);
      if (response.data && response.data.data) {
        setVehicleData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const [formData, setFormData] = useState({
    serviceType: "Airport Transfer",
    addOnServices: ["None"],
    flightNumber: "",
    rentalDaysOption: "one",
    rentalDaysCount: "",
    numOfVehicles: [], // Array for number of vehicles per trip
    vehicles: [
      [
        {
          pickupLocation: "",
          pickupLatitude: null,
          pickupLongitude: null,
          dropoffLocation: "",
          dropoffLatitude: null,
          dropoffLongitude: null,
          staySpots: [{ address: "", latitude: null, longitude: null }],
          pickupDateTime: "",
          passengerCount: "",
          specialInstructions: "",
          vehicleType: "",
          make: "",
          model: "",
        },
      ],
    ],
  });

  const [suggestions, setSuggestions] = useState({
    pickup: [],
    dropoff: [],
    staySpots: {},
  });
  const [activeField, setActiveField] = useState(null);

  const fetchLocations = async (query, field, tripIndex = null, vehicleIndex = null, staySpotIndex = null) => {
    if (!query || query.length < 3) {
      if (field === "staySpots" && tripIndex !== null && vehicleIndex !== null && staySpotIndex !== null) {
        setSuggestions((prev) => ({
          ...prev,
          staySpots: {
            ...prev.staySpots,
            [`${tripIndex}-${vehicleIndex}-${staySpotIndex}`]: [],
          },
        }));
      } else if (field === "pickup" && tripIndex !== null && vehicleIndex !== null) {
        setSuggestions((prev) => ({
          ...prev,
          pickup: {
            ...prev.pickup,
            [`${tripIndex}-${vehicleIndex}`]: [],
          },
        }));
      } else if (field === "dropoff" && tripIndex !== null && vehicleIndex !== null) {
        setSuggestions((prev) => ({
          ...prev,
          dropoff: {
            ...prev.dropoff,
            [`${tripIndex}-${vehicleIndex}`]: [],
          },
        }));
      }
      return;
    }

    try {
      const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (field === "staySpots" && tripIndex !== null && vehicleIndex !== null && staySpotIndex !== null) {
        setSuggestions((prev) => ({
          ...prev,
          staySpots: {
            ...prev.staySpots,
            [`${tripIndex}-${vehicleIndex}-${staySpotIndex}`]: data.features || [],
          },
        }));
      } else if (field === "pickup" && tripIndex !== null && vehicleIndex !== null) {
        setSuggestions((prev) => ({
          ...prev,
          pickup: {
            ...prev.pickup,
            [`${tripIndex}-${vehicleIndex}`]: data.features || [],
          },
        }));
      } else if (field === "dropoff" && tripIndex !== null && vehicleIndex !== null) {
        setSuggestions((prev) => ({
          ...prev,
          dropoff: {
            ...prev.dropoff,
            [`${tripIndex}-${vehicleIndex}`]: data.features || [],
          },
        }));
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      if (field === "staySpots" && tripIndex !== null && vehicleIndex !== null && staySpotIndex !== null) {
        setSuggestions((prev) => ({
          ...prev,
          staySpots: {
            ...prev.staySpots,
            [`${tripIndex}-${vehicleIndex}-${staySpotIndex}`]: [],
          },
        }));
      } else if (field === "pickup" && tripIndex !== null && vehicleIndex !== null) {
        setSuggestions((prev) => ({
          ...prev,
          pickup: {
            ...prev.pickup,
            [`${tripIndex}-${vehicleIndex}`]: [],
          },
        }));
      } else if (field === "dropoff" && tripIndex !== null && vehicleIndex !== null) {
        setSuggestions((prev) => ({
          ...prev,
          dropoff: {
            ...prev.dropoff,
            [`${tripIndex}-${vehicleIndex}`]: [],
          },
        }));
      }
    }
  };

  const handleLocationSelect = (location, field, tripIndex, vehicleIndex, staySpotIndex = null) => {
    const { name, country, state, city } = location.properties;
    const displayName = [name, city, state, country].filter(Boolean).join(", ");

    setFormData((prev) => {
      const newVehicles = [...prev.vehicles];
      if (field === "pickup") {
        newVehicles[tripIndex][vehicleIndex] = {
          ...newVehicles[tripIndex][vehicleIndex],
          pickupLocation: displayName,
          pickupLatitude: location.geometry.coordinates[1],
          pickupLongitude: location.geometry.coordinates[0],
        };
      } else if (field === "dropoff") {
        newVehicles[tripIndex][vehicleIndex] = {
          ...newVehicles[tripIndex][vehicleIndex],
          dropoffLocation: displayName,
          dropoffLatitude: location.geometry.coordinates[1],
          dropoffLongitude: location.geometry.coordinates[0],
        };
      } else if (field === "staySpots" && staySpotIndex !== null) {
        const newStaySpots = [...newVehicles[tripIndex][vehicleIndex].staySpots];
        newStaySpots[staySpotIndex] = {
          address: displayName,
          latitude: location.geometry.coordinates[1],
          longitude: location.geometry.coordinates[0],
        };
        newVehicles[tripIndex][vehicleIndex] = {
          ...newVehicles[tripIndex][vehicleIndex],
          staySpots: newStaySpots,
        };
      }
      return { ...prev, vehicles: newVehicles };
    });

    if (field === "staySpots" && staySpotIndex !== null) {
      setSuggestions((prev) => ({
        ...prev,
        staySpots: {
          ...prev.staySpots,
          [`${tripIndex}-${vehicleIndex}-${staySpotIndex}`]: [],
        },
      }));
    } else if (field === "pickup") {
      setSuggestions((prev) => ({
        ...prev,
        pickup: {
          ...prev.pickup,
          [`${tripIndex}-${vehicleIndex}`]: [],
        },
      }));
    } else if (field === "dropoff") {
      setSuggestions((prev) => ({
        ...prev,
        dropoff: {
          ...prev.dropoff,
          [`${tripIndex}-${vehicleIndex}`]: [],
        },
      }));
    }
    setActiveField(null);
  };

  const handleLocationChange = (e, field, tripIndex, vehicleIndex, staySpotIndex = null) => {
    const { value } = e.target;

    setFormData((prev) => {
      const newVehicles = [...prev.vehicles];
      if (field === "pickup") {
        newVehicles[tripIndex][vehicleIndex] = {
          ...newVehicles[tripIndex][vehicleIndex],
          pickupLocation: value,
          pickupLatitude: null,
          pickupLongitude: null,
        };
      } else if (field === "dropoff") {
        newVehicles[tripIndex][vehicleIndex] = {
          ...newVehicles[tripIndex][vehicleIndex],
          dropoffLocation: value,
          dropoffLatitude: null,
          dropoffLongitude: null,
        };
      } else if (field === "staySpots" && staySpotIndex !== null) {
        const newStaySpots = [...newVehicles[tripIndex][vehicleIndex].staySpots];
        newStaySpots[staySpotIndex] = {
          address: value,
          latitude: null,
          longitude: null,
        };
        newVehicles[tripIndex][vehicleIndex] = {
          ...newVehicles[tripIndex][vehicleIndex],
          staySpots: newStaySpots,
        };
      }
      return { ...prev, vehicles: newVehicles };
    });

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      fetchLocations(value, field, tripIndex, vehicleIndex, staySpotIndex);
    }, 300);
  };

  const handleInputChange = (e, field, tripIndex = null, vehicleIndex = null) => {
    const { name, value, type } = e.target;

    if (tripIndex !== null && vehicleIndex !== null) {
      setFormData((prev) => {
        const newVehicles = [...prev.vehicles];
        newVehicles[tripIndex][vehicleIndex] = {
          ...newVehicles[tripIndex][vehicleIndex],
          [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
        };
        return { ...prev, vehicles: newVehicles };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
      }));
    }
  };

  const toggleDropdown = (dropdownName) => {
    setDropdownStates((prev) => ({
      ...prev,
      [dropdownName]: !prev[dropdownName],
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setDropdownStates({
          serviceTypes: false,
          addOnServices: false,
          vehicleTypes: false,
          vehicleMakes: false,
          vehicleModels: false,
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const addStaySpot = (tripIndex, vehicleIndex) => {
    setFormData((prev) => {
      const newVehicles = [...prev.vehicles];
      newVehicles[tripIndex][vehicleIndex] = {
        ...newVehicles[tripIndex][vehicleIndex],
        staySpots: [
          ...newVehicles[tripIndex][vehicleIndex].staySpots,
          { address: "", latitude: null, longitude: null },
        ],
      };
      return { ...prev, vehicles: newVehicles };
    });
  };

  const removeStaySpot = (tripIndex, vehicleIndex, staySpotIndex) => {
    setFormData((prev) => {
      const newVehicles = [...prev.vehicles];
      if (newVehicles[tripIndex][vehicleIndex].staySpots.length > 1) {
        newVehicles[tripIndex][vehicleIndex] = {
          ...newVehicles[tripIndex][vehicleIndex],
          staySpots: newVehicles[tripIndex][vehicleIndex].staySpots.filter((_, i) => i !== staySpotIndex),
        };
      }
      return { ...prev, vehicles: newVehicles };
    });
  };

  const handleServiceTypeChange = (service) => {
    if (service === "Airport Transfer" && formData.serviceType === "Airport Transfer") {
      toast.info("Airport Transfer cannot be deselected.");
      return;
    }
    setFormData((prev) => {
      const newVehicles = ["City Transfer", "Airport Transfer"].includes(service)
        ? [
            Array.from({ length: prev.numOfVehicles[0] || 1 }, () => ({
              pickupLocation: "",
              pickupLatitude: null,
              pickupLongitude: null,
              dropoffLocation: "",
              dropoffLatitude: null,
              dropoffLongitude: null,
              staySpots: [{ address: "", latitude: null, longitude: null }],
              pickupDateTime: "",
              passengerCount: "",
              specialInstructions: "",
              vehicleType: "",
              make: "",
              model: "",
            })),
          ]
        : ["Daily Hire", "Full-Day Hire", "Multi-Day Hire", "Multi Hire"].includes(service)
        ? Array.from(
            { length: prev.rentalDaysOption === "multiple" ? prev.rentalDaysCount || 1 : 1 },
            () =>
              Array.from({ length: prev.numOfVehicles[0] || 1 }, () => ({
                pickupLocation: "",
                pickupLatitude: null,
                pickupLongitude: null,
                dropoffLocation: "",
                dropoffLatitude: null,
                dropoffLongitude: null,
                staySpots: [{ address: "", latitude: null, longitude: null }],
                pickupDateTime: "",
                passengerCount: "",
                specialInstructions: "",
                vehicleType: "",
                make: "",
                model: "",
              }))
          )
        : [
            [
              {
                pickupLocation: "",
                pickupLatitude: null,
                pickupLongitude: null,
                dropoffLocation: "",
                dropoffLatitude: null,
                dropoffLongitude: null,
                staySpots: [{ address: "", latitude: null, longitude: null }],
                pickupDateTime: "",
                passengerCount: "",
                specialInstructions: "",
                vehicleType: "",
                make: "",
                model: "",
              },
            ],
          ];

      return {
        ...prev,
        serviceType: service,
        vehicles: newVehicles,
        rentalDaysOption: ["Daily Hire", "Full-Day Hire", "Multi-Day Hire", "Multi Hire"].includes(service)
          ? prev.rentalDaysOption
          : "one",
        rentalDaysCount: ["Daily Hire", "Full-Day Hire", "Multi-Day Hire", "Multi Hire"].includes(service)
          ? prev.rentalDaysCount
          : "",
        numOfVehicles: ["City Transfer", "Airport Transfer"].includes(service)
          ? prev.numOfVehicles
          : Array(prev.rentalDaysOption === "multiple" ? prev.rentalDaysCount || 1 : 1).fill(""),
        flightNumber: service === "Airport Transfer" ? prev.flightNumber : "",
      };
    });
    setSelectedVehicleTypes([]);
    setSelectedMakes([]);
    setSelectedModels([]);
    setDropdownStates((prev) => ({ ...prev, serviceTypes: false }));
  };

  const handleAddOnServiceChange = (service) => {
    setFormData((prev) => ({
      ...prev,
      addOnServices: prev.addOnServices.includes(service)
        ? prev.addOnServices.filter((s) => s !== service)
        : [...prev.addOnServices, service],
    }));
  };

  const handleVehicleTypeChange = (tripIndex, vehicleIndex, value) => {
    setSelectedVehicleTypes((prev) => {
      const newTypes = [...prev];
      newTypes[tripIndex] = newTypes[tripIndex] || [];
      newTypes[tripIndex][vehicleIndex] = value;
      return newTypes;
    });
    setSelectedMakes((prev) => {
      const newMakes = [...prev];
      newMakes[tripIndex] = newMakes[tripIndex] || [];
      newMakes[tripIndex][vehicleIndex] = "";
      return newMakes;
    });
    setSelectedModels((prev) => {
      const newModels = [...prev];
      newModels[tripIndex] = newModels[tripIndex] || [];
      newModels[tripIndex][vehicleIndex] = "";
      return newModels;
    });
    setFormData((prev) => {
      const newVehicles = [...prev.vehicles];
      newVehicles[tripIndex][vehicleIndex] = {
        ...newVehicles[tripIndex][vehicleIndex],
        vehicleType: value,
        make: "",
        model: "",
      };
      return { ...prev, vehicles: newVehicles };
    });
  };

  const handleMakeChange = (tripIndex, vehicleIndex, value) => {
    setSelectedMakes((prev) => {
      const newMakes = [...prev];
      newMakes[tripIndex] = newMakes[tripIndex] || [];
      newMakes[tripIndex][vehicleIndex] = value;
      return newMakes;
    });
    setSelectedModels((prev) => {
      const newModels = [...prev];
      newModels[tripIndex] = newModels[tripIndex] || [];
      newModels[tripIndex][vehicleIndex] = "";
      return newModels;
    });
    setFormData((prev) => {
      const newVehicles = [...prev.vehicles];
      newVehicles[tripIndex][vehicleIndex] = {
        ...newVehicles[tripIndex][vehicleIndex],
        make: value,
        model: "",
      };
      return { ...prev, vehicles: newVehicles };
    });
  };

  const handleModelChange = (tripIndex, vehicleIndex, value) => {
    setSelectedModels((prev) => {
      const newModels = [...prev];
      newModels[tripIndex] = newModels[tripIndex] || [];
      newModels[tripIndex][vehicleIndex] = value;
      return newModels;
    });
    setFormData((prev) => {
      const newVehicles = [...prev.vehicles];
      newVehicles[tripIndex][vehicleIndex] = {
        ...newVehicles[tripIndex][vehicleIndex],
        model: value,
      };
      return { ...prev, vehicles: newVehicles };
    });
  };

  const handleNumOfVehiclesChange = (tripIndex, value) => {
    const count = value === "" ? "" : Math.max(1, Number(value) || 1);
    setFormData((prev) => {
      const newNumOfVehicles = [...prev.numOfVehicles];
      newNumOfVehicles[tripIndex] = count;
      const newVehicles = [...prev.vehicles];
      newVehicles[tripIndex] = Array.from({ length: count || 1 }, (_, index) =>
        prev.vehicles[tripIndex][index] || {
          pickupLocation: "",
          pickupLatitude: null,
          pickupLongitude: null,
          dropoffLocation: "",
          dropoffLatitude: null,
          dropoffLongitude: null,
          staySpots: [{ address: "", latitude: null, longitude: null }],
          pickupDateTime: "",
          passengerCount: "",
          specialInstructions: "",
          vehicleType: "",
          make: "",
          model: "",
        }
      );
      return { ...prev, numOfVehicles: newNumOfVehicles, vehicles: newVehicles };
    });
    setSelectedVehicleTypes((prev) => {
      const newTypes = [...prev];
      newTypes[tripIndex] = Array(count || 1).fill("");
      return newTypes;
    });
    setSelectedMakes((prev) => {
      const newMakes = [...prev];
      newMakes[tripIndex] = Array(count || 1).fill("");
      return newMakes;
    });
    setSelectedModels((prev) => {
      const newModels = [...prev];
      newModels[tripIndex] = Array(count || 1).fill("");
      return newModels;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Transform formData into the Redux slice's bookingData structure
    const bookingData = {
      numOfVehicles: formData.numOfVehicles[0] || formData.vehicles[0].length,
      serviceTypes: [formData.serviceType],
      requestedVehicles: formData.vehicles.flat().map((vehicle) => ({
        vehicleType: vehicle.vehicleType,
        make: vehicle.make,
        model: vehicle.model,
      })),
      addOnServices: formData.addOnServices,
      pickupLocation: formData.vehicles[0][0].pickupLocation,
      pickupLatitude: formData.vehicles[0][0].pickupLatitude,
      pickupLongitude: formData.vehicles[0][0].pickupLongitude,
      dropoffLocations: formData.vehicles
        .flat()
        .map((vehicle) => ({
          address: vehicle.dropoffLocation,
          latitude: vehicle.dropoffLatitude,
          longitude: vehicle.dropoffLongitude,
          stops: vehicle.staySpots,
        })),
      pickupDateTime: formData.vehicles[0][0].pickupDateTime,
      rentalDays: formData.rentalDaysOption === "multiple" ? formData.rentalDaysCount : 1,
      flightNumber: formData.serviceType === "Airport Transfer" ? formData.flightNumber : "",
      specialInstructions: formData.vehicles[0][0].specialInstructions,
      passengerCount: formData.vehicles[0][0].passengerCount,
      bookingType: activeTab === "instant" ? "booking" : "quotation",
    };

    console.log("Form submitted bookingData:", bookingData);
    dispatch(updateBookingForm(bookingData));

    try {
      toast.success("Booking request sent successfully!");
      const params = new URLSearchParams();
      params.set("booking", JSON.stringify(bookingData));
      const redirectUrl = `http://localhost:3001/screens/signup?${params.toString()}`;
      sessionStorage.setItem("bookingParams", params.toString());
      window.open(redirectUrl, "_blank");
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error("Failed to send booking request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isTransferService = ["City Transfer", "Airport Transfer"].includes(formData.serviceType);
  const isHireService = ["Daily Hire", "Full-Day Hire", "Multi-Day Hire", "Multi Hire"].includes(
    formData.serviceType
  );

  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-24 xl:px-32 py-10 sm:py-16 md:py-20 font-body bg-[#c8d5d1d9] rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-tl-[100px] rounded-br-[60px] sm:rounded-br-[80px] lg:rounded-br-[100px] overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex flex-row w-full max-w-md sm:max-w-lg md:max-w-[500px] mx-auto mb-6 bg-[#1F5546] rounded-lg p-1 space-x-2">
        <button
          onClick={() => {
            setActiveTab("instant");
            setFormData((prev) => ({ ...prev, bookingType: "booking" }));
          }}
          className={`px-3 sm:px-6 py-2 text-xs sm:text-sm font-medium rounded-lg flex-1 transition-all duration-200 ${
            activeTab === "instant" ? "bg-[#EAB308] text-black shadow-md" : "text-white hover:bg-[#2a6b5b]"
          }`}
        >
          Instant Booking
        </button>
        <button
          onClick={() => {
            setActiveTab("quote");
            setFormData((prev) => ({ ...prev, bookingType: "quotation" }));
          }}
          className={`px-3 sm:px-6 py-2 text-xs sm:text-sm font-medium rounded-lg flex-1 transition-all duration-200 ${
            activeTab === "quote" ? "bg-[#EAB308] text-black shadow-md" : "text-white hover:bg-[#2a6b5b]"
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
        <div className="p-4 sm:p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 sm:space-y-6">
              {/* Service Type */}
              <div className="dropdown-container">
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Service Type</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleDropdown("serviceTypes")}
                    className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md bg-white text-left flex justify-between items-center hover:border-[#1F5546] focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent transition-colors"
                  >
                    <span className="text-sm text-gray-700">{formData.serviceType || "Select service type"}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${dropdownStates.serviceTypes ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {dropdownStates.serviceTypes && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-auto">
                      {serviceTypes.map((service, index) => (
                        <div
                          key={index}
                          className={`p-3 hover:bg-gray-50 cursor-pointer flex items-center space-x-2 border-b border-gray-100 last:border-b-0 ${
                            service === "Airport Transfer" && formData.serviceType === "Airport Transfer"
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={() => handleServiceTypeChange(service)}
                        >
                          <div
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              formData.serviceType === service ? "bg-[#1F5546] border-[#1F5546]" : "border-gray-300"
                            }`}
                          >
                            {formData.serviceType === service && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm text-gray-700">{service}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Add-on Services */}
              {(isTransferService || isHireService) && (
                <div className="dropdown-container">
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Add-on Services</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => toggleDropdown("addOnServices")}
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md bg-white text-left flex justify-between items-center hover:border-[#1F5546] focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent transition-colors"
                    >
                      <span className="text-sm text-gray-700">
                        {formData.addOnServices.length > 0
                          ? `${formData.addOnServices.length} services selected`
                          : "Select add-on services"}
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform ${dropdownStates.addOnServices ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {dropdownStates.addOnServices && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-auto">
                        {addOnServices.map((service, index) => (
                          <div
                            key={index}
                            className="p-3 hover:bg-gray-50 cursor-pointer flex items-center space-x-2 border-b border-gray-100 last:border-b-0"
                            onClick={() => handleAddOnServiceChange(service)}
                          >
                            <div
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                formData.addOnServices.includes(service)
                                  ? "bg-[#1F5546] border-[#1F5546]"
                                  : "border-gray-300"
                              }`}
                            >
                              {formData.addOnServices.includes(service) && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                            <span className="text-sm text-gray-700">{service}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {formData.addOnServices.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.addOnServices.map((service, index) => (
                        <div
                          key={index}
                          className="bg-[#1F5546] text-white px-3 py-1 rounded-full text-xs flex items-center space-x-1"
                        >
                          <span>{service}</span>
                          <button
                            type="button"
                            onClick={() => handleAddOnServiceChange(service)}
                            className="hover:bg-red-500 rounded-full p-0.5 transition-colors"
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Number of Vehicles for Transfer Services */}
              {isTransferService && (
                <div>
                  <label htmlFor="numOfVehicles" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Number of Vehicles
                  </label>
                  <input
                    id="numOfVehicles"
                    name="numOfVehicles"
                    value={formData.numOfVehicles[0] || ""}
                    onChange={(e) => handleNumOfVehiclesChange(0, e.target.value)}
                    type="number"
                    min="1"
                    placeholder="Enter number of vehicles"
                    className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent text-sm sm:text-base"
                  />
                </div>
              )}

              {/* Number of Trips for Hire Services */}
              {isHireService && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Number of Trips</label>
                  <div className="flex space-x-4 mb-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="rentalDaysOption"
                        value="one"
                        checked={formData.rentalDaysOption === "one"}
                        onChange={() => {
                          setFormData((prev) => ({
                            ...prev,
                            rentalDaysOption: "one",
                            rentalDaysCount: "",
                            numOfVehicles: [""],
                            vehicles: [
                              Array.from({ length: prev.numOfVehicles[0] || 1 }, (_, index) =>
                                prev.vehicles[0]?.[index] || {
                                  pickupLocation: "",
                                  pickupLatitude: null,
                                  pickupLongitude: null,
                                  dropoffLocation: "",
                                  dropoffLatitude: null,
                                  dropoffLongitude: null,
                                  staySpots: [{ address: "", latitude: null, longitude: null }],
                                  pickupDateTime: "",
                                  passengerCount: "",
                                  specialInstructions: "",
                                  vehicleType: "",
                                  make: "",
                                  model: "",
                                }
                              ),
                            ],
                          }));
                          setSelectedVehicleTypes([Array(formData.numOfVehicles[0] || 1).fill("")]);
                          setSelectedMakes([Array(formData.numOfVehicles[0] || 1).fill("")]);
                          setSelectedModels([Array(formData.numOfVehicles[0] || 1).fill("")]);
                        }}
                        className="mr-2"
                      />
                      One
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="rentalDaysOption"
                        value="multiple"
                        checked={formData.rentalDaysOption === "multiple"}
                        onChange={() => {
                          setFormData((prev) => ({
                            ...prev,
                            rentalDaysOption: "multiple",
                            vehicles: Array.from({ length: prev.rentalDaysCount || 1 }, () =>
                              Array.from({ length: prev.numOfVehicles[0] || 1 }, () => ({
                                pickupLocation: "",
                                pickupLatitude: null,
                                pickupLongitude: null,
                                dropoffLocation: "",
                                dropoffLatitude: null,
                                dropoffLongitude: null,
                                staySpots: [{ address: "", latitude: null, longitude: null }],
                                pickupDateTime: "",
                                passengerCount: "",
                                specialInstructions: "",
                                vehicleType: "",
                                make: "",
                                model: "",
                              }))
                            ),
                            numOfVehicles: Array(prev.rentalDaysCount || 1).fill(""),
                          }));
                          setSelectedVehicleTypes(
                            Array(formData.rentalDaysCount || 1).fill().map(() => Array(1).fill(""))
                          );
                          setSelectedMakes(
                            Array(formData.rentalDaysCount || 1).fill().map(() => Array(1).fill(""))
                          );
                          setSelectedModels(
                            Array(formData.rentalDaysCount || 1).fill().map(() => Array(1).fill(""))
                          );
                        }}
                        className="mr-2"
                      />
                      Multiple
                    </label>
                  </div>
                  {formData.rentalDaysOption === "multiple" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Number of Trips
                      </label>
                      <input
                        type="number"
                        name="rentalDaysCount"
                        value={formData.rentalDaysCount}
                        onChange={(e) => {
                          const count = e.target.value === "" ? "" : Math.max(1, Number(e.target.value) || 1);
                          setFormData((prev) => ({
                            ...prev,
                            rentalDaysCount: count,
                            vehicles: Array.from({ length: count || 1 }, (_, index) =>
                              prev.vehicles[index] ||
                              Array.from({ length: prev.numOfVehicles[index] || 1 }, () => ({
                                pickupLocation: "",
                                pickupLatitude: null,
                                pickupLongitude: null,
                                dropoffLocation: "",
                                dropoffLatitude: null,
                                dropoffLongitude: null,
                                staySpots: [{ address: "", latitude: null, longitude: null }],
                                pickupDateTime: "",
                                passengerCount: "",
                                specialInstructions: "",
                                vehicleType: "",
                                make: "",
                                model: "",
                              }))
                            ),
                            numOfVehicles: Array(count || 1).fill(""),
                          }));
                          setSelectedVehicleTypes(
                            Array(count || 1).fill().map(() => Array(1).fill(""))
                          );
                          setSelectedMakes(
                            Array(count || 1).fill().map(() => Array(1).fill(""))
                          );
                          setSelectedModels(
                            Array(count || 1).fill().map(() => Array(1).fill(""))
                          );
                        }}
                        min="1"
                        placeholder="Enter number of trips"
                        className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent text-sm sm:text-base"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Vehicle Details Boxes */}
              {(isTransferService || isHireService) &&
                formData.vehicles.map((tripVehicles, tripIndex) => (
                  <div key={tripIndex} className="border border-gray-300 p-4 rounded-md mb-4">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                      {isHireService ? `Trip ${tripIndex + 1}` : "Transfer"}
                    </h2>
                    {isHireService && (
                      <div className="mb-4">
                        <label
                          htmlFor={`numOfVehicles-${tripIndex}`}
                          className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                        >
                          Number of Vehicles
                        </label>
                        <input
                          id={`numOfVehicles-${tripIndex}`}
                          name={`numOfVehicles-${tripIndex}`}
                          value={formData.numOfVehicles[tripIndex] || ""}
                          onChange={(e) => handleNumOfVehiclesChange(tripIndex, e.target.value)}
                          type="number"
                          min="1"
                          placeholder="Enter number of vehicles"
                          className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent text-sm sm:text-base"
                        />
                      </div>
                    )}
                    {tripVehicles.map((vehicle, vehicleIndex) => (
                      <div key={vehicleIndex} className="border border-gray-200 p-4 rounded-md mb-2">
                        <h3 className="text-lg font-medium text-gray-700 mb-2">
                          Vehicle {vehicleIndex + 1}
                        </h3>
                        <div className="space-y-4">
                          {/* Pickup Location */}
                          <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                              Pickup Location
                            </label>
                            <input
                              type="text"
                              value={vehicle.pickupLocation}
                              onChange={(e) => handleLocationChange(e, "pickup", tripIndex, vehicleIndex)}
                              onFocus={() => setActiveField(`pickup-${tripIndex}-${vehicleIndex}`)}
                              onBlur={() => setTimeout(() => setActiveField(null), 200)}
                              className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-900 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent"
                              placeholder="Start typing to search pickup location..."
                            />
                            {suggestions.pickup[`${tripIndex}-${vehicleIndex}`] &&
                              suggestions.pickup[`${tripIndex}-${vehicleIndex}`].length > 0 &&
                              activeField === `pickup-${tripIndex}-${vehicleIndex}` && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                  {suggestions.pickup[`${tripIndex}-${vehicleIndex}`].map((suggestion, index) => (
                                    <div
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        handleLocationSelect(suggestion, "pickup", tripIndex, vehicleIndex)
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

                          {/* Dropoff Location */}
                          <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                              Drop-off Location
                            </label>
                            <input
                              type="text"
                              value={vehicle.dropoffLocation}
                              onChange={(e) => handleLocationChange(e, "dropoff", tripIndex, vehicleIndex)}
                              onFocus={() => setActiveField(`dropoff-${tripIndex}-${vehicleIndex}`)}
                              onBlur={() => setTimeout(() => setActiveField(null), 200)}
                              className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-900 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent"
                              placeholder="Start typing to search drop-off location..."
                            />
                            {suggestions.dropoff[`${tripIndex}-${vehicleIndex}`] &&
                              suggestions.dropoff[`${tripIndex}-${vehicleIndex}`].length > 0 &&
                              activeField === `dropoff-${tripIndex}-${vehicleIndex}` && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                  {suggestions.dropoff[`${tripIndex}-${vehicleIndex}`].map((suggestion, index) => (
                                    <div
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        handleLocationSelect(suggestion, "dropoff", tripIndex, vehicleIndex)
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

                          {/* Pickup Date & Time */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                              Pickup Date & Time
                            </label>
                            <input
                              name="pickupDateTime"
                              value={vehicle.pickupDateTime}
                              onChange={(e) => handleInputChange(e, "pickupDateTime", tripIndex, vehicleIndex)}
                              type="datetime-local"
                              className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent text-sm sm:text-base"
                              placeholder="Select date and time"
                            />
                          </div>

                          {/* Stay Spots */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium text-gray-700">Stay Spots</label>
                              <button
                                type="button"
                                onClick={() => addStaySpot(tripIndex, vehicleIndex)}
                                className="bg-[#1F5546] text-white px-3 py-1 rounded text-xs hover:bg-teal-700"
                              >
                                Add Stay Spot
                              </button>
                            </div>
                            {vehicle.staySpots.map((staySpot, staySpotIndex) => (
                              <div key={staySpotIndex} className="relative mb-4">
                                {vehicle.staySpots.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeStaySpot(tripIndex, vehicleIndex, staySpotIndex)}
                                    className="absolute top-2 right-2 z-10 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                                  >
                                    Remove
                                  </button>
                                )}
                                <input
                                  type="text"
                                  value={staySpot.address}
                                  onChange={(e) =>
                                    handleLocationChange(e, "staySpots", tripIndex, vehicleIndex, staySpotIndex)
                                  }
                                  onFocus={() =>
                                    setActiveField(`staySpots-${tripIndex}-${vehicleIndex}-${staySpotIndex}`)
                                  }
                                  onBlur={() => setTimeout(() => setActiveField(null), 200)}
                                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-900 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent pr-16"
                                  placeholder="Start typing to search stay spots..."
                                />
                                {suggestions.staySpots[`${tripIndex}-${vehicleIndex}-${staySpotIndex}`] &&
                                  suggestions.staySpots[`${tripIndex}-${vehicleIndex}-${staySpotIndex}`].length > 0 &&
                                  activeField === `staySpots-${tripIndex}-${vehicleIndex}-${staySpotIndex}` && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                      {suggestions.staySpots[
                                        `${tripIndex}-${vehicleIndex}-${staySpotIndex}`
                                      ].map((suggestion, index) => (
                                        <div
                                          key={index}
                                          className="p-2 hover:bg-gray-100 cursor-pointer"
                                          onClick={() =>
                                            handleLocationSelect(
                                              suggestion,
                                              "staySpots",
                                              tripIndex,
                                              vehicleIndex,
                                              staySpotIndex
                                            )
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
                            ))}
                          </div>

                          {/* Passenger Count */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                              Passenger Count
                            </label>
                            <input
                              name="passengerCount"
                              value={vehicle.passengerCount}
                              onChange={(e) => handleInputChange(e, "passengerCount", tripIndex, vehicleIndex)}
                              type="number"
                              min="1"
                              placeholder="Enter number of passengers"
                              className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent text-sm sm:text-base"
                            />
                          </div>

                          {/* Special Instructions */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                              Special Instructions <span className="text-gray-500">(Optional)</span>
                            </label>
                            <textarea
                              name="specialInstructions"
                              value={vehicle.specialInstructions}
                              onChange={(e) => handleInputChange(e, "specialInstructions", tripIndex, vehicleIndex)}
                              placeholder="e.g., Please call when you arrive"
                              className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent text-sm sm:text-base min-h-[80px]"
                            />
                          </div>

                          {/* Vehicle Type Selection */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                              Vehicle Type
                            </label>
                            <div className="space-y-3">
                              <div className="dropdown-container relative">
                                <select
                                  value={
                                    selectedVehicleTypes[tripIndex]?.[vehicleIndex] || ""
                                  }
                                  onChange={(e) => handleVehicleTypeChange(tripIndex, vehicleIndex, e.target.value)}
                                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent"
                                >
                                  <option value="">Select Vehicle Type</option>
                                  {vehicleTypes.map((type, index) => (
                                    <option key={index} value={type}>
                                      {type}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="dropdown-container relative">
                                <select
                                  value={selectedMakes[tripIndex]?.[vehicleIndex] || ""}
                                  onChange={(e) => handleMakeChange(tripIndex, vehicleIndex, e.target.value)}
                                  disabled={!selectedVehicleTypes[tripIndex]?.[vehicleIndex]}
                                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <option value="">Select Vehicle Make</option>
                                  {vehicleData.makes.map((make, index) => (
                                    <option key={index} value={make}>
                                      {make}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="dropdown-container relative">
                                <select
                                  value={selectedModels[tripIndex]?.[vehicleIndex] || ""}
                                  onChange={(e) => handleModelChange(tripIndex, vehicleIndex, e.target.value)}
                                  disabled={!selectedMakes[tripIndex]?.[vehicleIndex]}
                                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <option value="">Select Vehicle Model</option>
                                  {selectedMakes[tripIndex]?.[vehicleIndex] &&
                                    vehicleData.modelsByMake[
                                      selectedMakes[tripIndex][vehicleIndex]
                                    ]?.map((model, index) => (
                                      <option key={index} value={model}>
                                        {model}
                                      </option>
                                    ))}
                                </select>
                              </div>
                            </div>
                            {vehicle.vehicleType && (
                              <div className="mt-2">
                                <span className="bg-[#1F5546] text-white px-3 py-1 rounded-full text-xs">
                                  {`${vehicle.vehicleType}: ${vehicle.make} ${vehicle.model}`}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

              {/* Flight Number for Airport Transfer */}
              {formData.serviceType === "Airport Transfer" && (
                <div>
                  <label htmlFor="flightNumber" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Flight Number <span className="text-gray-500">(Optional)</span>
                  </label>
                  <input
                    id="flightNumber"
                    name="flightNumber"
                    value={formData.flightNumber || ""}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="e.g., KQ100"
                    className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent text-sm sm:text-base"
                  />
                </div>
              )}

              {/* Submit Button */}
              <div className="mt-6 sm:mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#EAB308] hover:bg-[#EAB308] disabled:opacity-50 disabled:cursor-not-allowed text-black px-8 sm:px-12 py-3 sm:py-4 rounded-md font-medium transition-colors duration-200 text-sm sm:text-base"
                >
                  {loading ? "Creating ..." : "Create Booking"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;