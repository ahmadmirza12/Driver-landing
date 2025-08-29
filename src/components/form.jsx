"use client"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { updateBookingForm } from "@/redux/slices/bookingSlice"
import { get } from "@/services/api"

const BookingForm = () => {
  const dispatch = useDispatch()
  const state = useSelector((state) => state.authConfigs)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const timeoutRef = useRef(null)
  const [activeTab, setActiveTab] = useState("instant")

  const [vehicleData, setVehicleData] = useState({
    makes: [],
    models: [],
    modelsByMake: {},
  })

  // Dropdown states
  const [dropdownStates, setDropdownStates] = useState({
    serviceTypes: false,
    addOnServices: false,
    vehicleTypes: false,
    vehicleMakes: false,
    vehicleModels: false,
  })

  // State for selected vehicle type and make to filter models
  const [selectedVehicleType, setSelectedVehicleType] = useState("")
  const [selectedMake, setSelectedMake] = useState("")
  const [selectedModel, setSelectedModel] = useState("")

  const vehicleTypes = ["Sedan", "SUV", "Hatchback", "Luxury", "Van", "Bus"]

  const fetchVehicles = async () => {
    try {
      const response = await get("auth/vehicles/makes-models")
      console.log("Vehicles data:============>", response.data)
      if (response.data && response.data.data) {
        setVehicleData(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  const [formData, setFormData] = useState({
    serviceTypes: ["Airport Transfer"],
    requestedVehicles: [],
    addOnServices: ["None"],
    pickupLocation: "",
    pickupLatitude: null,
    pickupLongitude: null,
    dropoffLocations: [{ address: "", latitude: null, longitude: null }],
    pickupDateTime: "",
    rentalDays: 1,
    flightNumber: "",
    specialInstructions: "",
    passengerCount: 1,
    numOfVehicles: 1,
    bookingType: "quotation",
  })

  const [suggestions, setSuggestions] = useState({
    pickup: [],
    dropoff: {},
  })
  const [activeField, setActiveField] = useState(null)

  const fetchLocations = async (query, field, index = null) => {
    if (!query || query.length < 3) {
      if (field === "dropoff" && index !== null) {
        setSuggestions((prev) => ({
          ...prev,
          [field]: {
            ...prev[field],
            [index]: [],
          },
        }))
      } else {
        setSuggestions((prev) => ({
          ...prev,
          [field]: [],
        }))
      }
      return
    }

    try {
      const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}`)
      const data = await response.json()

      if (field === "dropoff" && index !== null) {
        setSuggestions((prev) => ({
          ...prev,
          [field]: {
            ...prev[field],
            [index]: data.features || [],
          },
        }))
      } else {
        setSuggestions((prev) => ({
          ...prev,
          [field]: data.features || [],
        }))
      }
    } catch (error) {
      console.error("Error fetching locations:", error)
      if (field === "dropoff" && index !== null) {
        setSuggestions((prev) => ({
          ...prev,
          [field]: {
            ...prev[field],
            [index]: [],
          },
        }))
      } else {
        setSuggestions((prev) => ({
          ...prev,
          [field]: [],
        }))
      }
    }
  }

  const handleLocationSelect = (location, field, index = null) => {
    const { name, country, state, city } = location.properties
    const displayName = [name, city, state, country].filter(Boolean).join(", ")

    if (field === "pickup") {
      setFormData((prev) => ({
        ...prev,
        pickupLocation: displayName,
        pickupLatitude: location.geometry.coordinates[1],
        pickupLongitude: location.geometry.coordinates[0],
      }))
    } else if (field === "dropoff" && index !== null) {
      setFormData((prev) => {
        const newDropoffLocations = [...prev.dropoffLocations]
        newDropoffLocations[index] = {
          address: displayName,
          latitude: location.geometry.coordinates[1],
          longitude: location.geometry.coordinates[0],
        }
        return {
          ...prev,
          dropoffLocations: newDropoffLocations,
        }
      })
    }

    if (field === "dropoff" && index !== null) {
      setSuggestions((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          [index]: [],
        },
      }))
    } else {
      setSuggestions((prev) => ({
        ...prev,
        [field]: [],
      }))
    }
    setActiveField(null)
  }

  const handleLocationChange = (e, field, index = null) => {
    const { value } = e.target

    if (field === "pickup") {
      setFormData((prev) => ({
        ...prev,
        pickupLocation: value,
        pickupLatitude: null,
        pickupLongitude: null,
      }))
    } else if (field === "dropoff" && index !== null) {
      setFormData((prev) => {
        const newDropoffLocations = [...prev.dropoffLocations]
        newDropoffLocations[index] = {
          ...newDropoffLocations[index],
          address: value,
          latitude: null,
          longitude: null,
        }
        return {
          ...prev,
          dropoffLocations: newDropoffLocations,
        }
      })
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      fetchLocations(value, field, index)
    }, 300)
  }

  const handleInputChange = (e, field = null, index = null) => {
    const { name, value, type } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }))
  }

  // Toggle dropdown visibility
  const toggleDropdown = (dropdownName) => {
    setDropdownStates((prev) => ({
      ...prev,
      [dropdownName]: !prev[dropdownName],
    }))
  }

  // Close all dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setDropdownStates({
          serviceTypes: false,
          addOnServices: false,
          vehicleTypes: false,
          vehicleMakes: false,
          vehicleModels: false,
        })
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Add new dropoff location
  const addDropoffLocation = () => {
    setFormData((prev) => ({
      ...prev,
      dropoffLocations: [...prev.dropoffLocations, { address: "", latitude: null, longitude: null }],
    }))
  }

  // Remove dropoff location
  const removeDropoffLocation = (index) => {
    if (formData.dropoffLocations.length > 1) {
      setFormData((prev) => ({
        ...prev,
        dropoffLocations: prev.dropoffLocations.filter((_, i) => i !== index),
      }))
    }
  }

  // Handle service type changes
  const handleServiceTypeChange = (service) => {
    setFormData((prev) => ({
      ...prev,
      serviceTypes: prev.serviceTypes.includes(service)
        ? prev.serviceTypes.filter((s) => s !== service)
        : [...prev.serviceTypes, service],
    }))
  }

  // Handle add-on service changes
  const handleAddOnServiceChange = (service) => {
    setFormData((prev) => ({
      ...prev,
      addOnServices: prev.addOnServices.includes(service)
        ? prev.addOnServices.filter((s) => s !== service)
        : [...prev.addOnServices, service],
    }))
  }

  // Add vehicle to the list
  const addVehicleToList = () => {
    if (selectedVehicleType && selectedMake && selectedModel) {
      if (formData.requestedVehicles.length >= formData.numOfVehicles) {
        toast.error(`Cannot add more than ${formData.numOfVehicles} vehicles.`)
        return
      }
      
      const vehicleObject = { 
        vehicleType: selectedVehicleType, 
        make: selectedMake, 
        model: selectedModel 
      }
      
      // Check if this exact vehicle is already in the list
      const exists = formData.requestedVehicles.some(
        (v) => v.vehicleType === vehicleObject.vehicleType && 
               v.make === vehicleObject.make && 
               v.model === vehicleObject.model
      )
      
      if (!exists) {
        setFormData((prev) => ({
          ...prev,
          requestedVehicles: [...prev.requestedVehicles, vehicleObject],
        }))
      } else {
        toast.error("This vehicle is already added.")
      }
      
      // Clear selections
      setSelectedVehicleType("")
      setSelectedMake("")
      setSelectedModel("")
    }
  }

  // Remove selected vehicle
  const removeSelectedItem = (item, type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((selectedItem) =>
        type === "requestedVehicles"
          ? !(selectedItem.vehicleType === item.vehicleType && selectedItem.make === item.make && selectedItem.model === item.model)
          : selectedItem !== item
      ),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    console.log("Form submitted:=====>", formData)
    dispatch(updateBookingForm(formData))

    try {
      toast.success("Booking request sent successfully!")

      if (state.token) {
        const params = new URLSearchParams()
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            params.append(key, typeof value === "object" ? JSON.stringify(value) : value)
          }
        })
        window.open(`http://localhost:3001/screens/signup?${params.toString()}`, "_blank")
      } else {
        const params = new URLSearchParams()
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            params.append(key, typeof value === "object" ? JSON.stringify(value) : value)
          }
        })
        sessionStorage.setItem("bookingParams", params.toString())
        window.open(`http://localhost:3001/screens/signup?${params.toString()}`, "_blank")
      }
    } catch (error) {
      console.error("Error submitting booking:", error)
      toast.error("Failed to send booking request. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const serviceTypes = ["Airport Transfer", "City Transfer"]
  const addOnServices = ["None", "Airport Assistance", "Wi-Fi", "Child Seat", "Meet & Greet", "Extra Luggage"]

  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-24 xl:px-32 py-10 sm:py-16 md:py-20 font-body bg-[#c8d5d1d9] rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-tl-[100px] rounded-br-[60px] sm:rounded-br-[80px] lg:rounded-br-[100px] overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex flex-row w-full max-w-md sm:max-w-lg md:max-w-[500px] mx-auto mb-6 bg-[#1F5546] rounded-lg p-1 space-x-2">
        <button
          onClick={() => {
            setActiveTab("instant")
            setFormData((prev) => ({ ...prev, bookingType: "instant" }))
          }}
          className={`px-3 sm:px-6 py-2 text-xs sm:text-sm font-medium rounded-lg flex-1 transition-all duration-200 ${
            activeTab === "instant" ? "bg-[#EAB308] text-black shadow-md" : "text-white hover:bg-[#2a6b5b]"
          }`}
        >
          Instant Booking
        </button>
        <button
          onClick={() => {
            setActiveTab("quote")
            setFormData((prev) => ({ ...prev, bookingType: "quotation" }))
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
        <div className=" p-4 sm:p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 sm:space-y-6">
              {/* Pickup Location */}
              <div className="relative">
                <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Pickup Location
                </label>
                <input
                  type="text"
                  id="pickupLocation"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={(e) => handleLocationChange(e, "pickup")}
                  onFocus={() => setActiveField("pickup")}
                  onBlur={() => setTimeout(() => setActiveField(null), 200)}
                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-900 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent"
                  placeholder="Start typing to search locations..."
                />
                {suggestions.pickup.length > 0 && activeField === "pickup" && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {suggestions.pickup.map((suggestion, index) => (
                      <div
                        key={index}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleLocationSelect(suggestion, "pickup")}
                      >
                        <div className="font-medium">{suggestion.properties.name || "Unnamed location"}</div>
                        <div className="text-sm text-gray-600">
                          {[suggestion.properties.city, suggestion.properties.state, suggestion.properties.country]
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
                <label htmlFor="pickupDateTime" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
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

              {/* Dropoff Locations */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Dropoff Locations</label>
                  <button
                    type="button"
                    onClick={addDropoffLocation}
                    className="bg-[#1F5546] text-white px-3 py-1 rounded text-xs hover:bg-teal-700"
                  >
                    Add Location
                  </button>
                </div>

                {formData.dropoffLocations.map((dropoff, dropoffIndex) => (
                  <div key={dropoffIndex} className="relative mb-4">
                    {formData.dropoffLocations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDropoffLocation(dropoffIndex)}
                        className="absolute top-2 right-2 z-10 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}

                    <input
                      type="text"
                      value={dropoff.address}
                      onChange={(e) => handleLocationChange(e, "dropoff", dropoffIndex)}
                      onFocus={() => setActiveField(`dropoff-${dropoffIndex}`)}
                      onBlur={() => setTimeout(() => setActiveField(null), 200)}
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-900 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent pr-16"
                      placeholder="Start typing to search locations..."
                    />

                    {suggestions.dropoff[dropoffIndex] &&
                      suggestions.dropoff[dropoffIndex].length > 0 &&
                      activeField === `dropoff-${dropoffIndex}` && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                          {suggestions.dropoff[dropoffIndex].map((suggestion, index) => (
                            <div
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleLocationSelect(suggestion, "dropoff", dropoffIndex)}
                            >
                              <div className="font-medium">{suggestion.properties.name || "Unnamed location"}</div>
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

              {/* Service Types - Multi-Select Dropdown */}
              <div className="dropdown-container relative">
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Service Types</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleDropdown("serviceTypes")}
                    className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md bg-white text-left flex justify-between items-center hover:border-[#1F5546] focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent transition-colors"
                  >
                    <span className="text-sm text-gray-700">
                      {formData.serviceTypes.length > 0
                        ? `${formData.serviceTypes.length} selected`
                        : "Select service types"}
                    </span>
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
                          className="p-3 hover:bg-gray-50 cursor-pointer flex items-center space-x-2 border-b border-gray-100 last:border-b-0"
                          onClick={() => handleServiceTypeChange(service)}
                        >
                          <div
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              formData.serviceTypes.includes(service)
                                ? "bg-[#1F5546] border-[#1F5546]"
                                : "border-gray-300"
                            }`}
                          >
                            {formData.serviceTypes.includes(service) && (
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

                {/* Selected Service Types */}
                {formData.serviceTypes.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.serviceTypes.map((service, index) => (
                      <div
                        key={index}
                        className="bg-[#1F5546] text-white px-3 py-1 rounded-full text-xs flex items-center space-x-1"
                      >
                        <span>{service}</span>
                        <button
                          type="button"
                          onClick={() => removeSelectedItem(service, "serviceTypes")}
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

              {/* Number of Vehicles */}
              <div>
                <label htmlFor="numOfVehicles" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Number of Vehicles
                </label>
                <input
                  id="numOfVehicles"
                  name="numOfVehicles"
                  value={formData.numOfVehicles}
                  onChange={handleInputChange}
                  type="number"
                  min="1"
                  placeholder="Number of vehicles"
                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent text-sm sm:text-base"
                />
              </div>

              {/* Requested Vehicles */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Requested Vehicles</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  {/* Vehicle Type */}
                  <div className="dropdown-container relative">
                    <select
                      value={selectedVehicleType}
                      onChange={(e) => setSelectedVehicleType(e.target.value)}
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent"
                    >
                      <option value="">Select Vehicle Type</option>
                      {vehicleTypes.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Vehicle Make */}
                  <div className="dropdown-container relative">
                    <select
                      value={selectedMake}
                      onChange={(e) => setSelectedMake(e.target.value)}
                      disabled={!selectedVehicleType}
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select Vehicle Make</option>
                      {vehicleData.makes.map((make, index) => (
                        <option key={index} value={make}>{make}</option>
                      ))}
                    </select>
                  </div>

                  {/* Vehicle Model */}
                  <div className="dropdown-container relative">
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      disabled={!selectedMake}
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select Vehicle Model</option>
                      {selectedMake && vehicleData.modelsByMake[selectedMake]?.map((model, index) => (
                        <option key={index} value={model}>{model}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Add Vehicle Button */}
                <button
                  type="button"
                  onClick={addVehicleToList}
                  disabled={!selectedVehicleType || !selectedMake || !selectedModel}
                  className="bg-[#1F5546] text-white px-4 py-2 rounded text-sm hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Vehicle
                </button>

                {/* Selected Vehicles */}
                {formData.requestedVehicles.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.requestedVehicles.map((vehicle, index) => (
                      <div
                        key={index}
                        className="bg-[#1F5546] text-white px-3 py-1 rounded-full text-xs flex items-center space-x-1"
                      >
                        <span className="capitalize">{`${vehicle.vehicleType}: ${vehicle.make} ${vehicle.model}`}</span>
                        <button
                          type="button"
                          onClick={() => removeSelectedItem(vehicle, "requestedVehicles")}
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

              {/* Add-on Services - Multi-Select Dropdown */}
              <div className="dropdown-container relative">
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

                {/* Selected Add-on Services */}
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
                          onClick={() => removeSelectedItem(service, "addOnServices")}
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

              {/* Two-column layout for other inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Flight Number */}
                <div>
                  <label htmlFor="flightNumber" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Flight Number <span className="text-gray-500">(Optional)</span>
                  </label>
                  <input
                    id="flightNumber"
                    name="flightNumber"
                    value={formData.flightNumber}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="e.g., KQ100"
                    className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent text-sm sm:text-base"
                  />
                </div>

                {/* Passenger Count */}
                <div>
                  <label htmlFor="passengerCount" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
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

                {/* Rental Days */}
                <div>
                  <label htmlFor="rentalDays" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Rental Days
                  </label>
                  <input
                    id="rentalDays"
                    name="rentalDays"
                    value={formData.rentalDays}
                    onChange={handleInputChange}
                    type="number"
                    min="1"
                    placeholder="Number of days"
                    className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Special Instructions - Full Width */}
              <div>
                <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Special Instructions <span className="text-gray-500">(Optional)</span>
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

            {/* Centered and Wider Button */}
            <div className="mt-6 sm:mt-8 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full max-w-7xl bg-[#EAB308] hover:bg-[#EAB308] disabled:opacity-50 disabled:cursor-not-allowed text-black px-8 sm:px-12 py-3 sm:py-4 rounded-md font-medium transition-colors duration-200 text-sm sm:text-base"
              >
                {loading ? "Creating ..." : "Create Booking"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BookingForm