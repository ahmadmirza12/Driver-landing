"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { post, get } from "@/services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- SVG Icons ---
const CalendarIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className || "h-5 w-5 text-gray-400"}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm1 5a1 1 0 100 2h8a1 1 0 100-2H7z"
      clipRule="evenodd"
    />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className || "h-5 w-5 text-gray-400"}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
      clipRule="evenodd"
    />
  </svg>
);

const LocationMarkerIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className || "h-5 w-5 text-gray-400"}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.05 4.05a7 7 0 119.9 9.9L10 20l-4.95-5.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
      clipRule="evenodd"
    />
  </svg>
);

const CarIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className || "h-5 w-5 text-gray-400"}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 2a2 2 0 00-2 2v1H6a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2V4a2 2 0 00-2-2zM8 4V3a1 1 0 112 0v1H8zm-2 5a1 1 0 100 2h8a1 1 0 100-2H6z"
      clipRule="evenodd"
    />
  </svg>
);

const UserIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className || "h-5 w-5 text-gray-400"}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const PhoneIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className || "h-5 w-5 text-gray-400"}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

const SparklesIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className || "h-6 w-6"}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 16l-4 4 4-4 3.293-3.293a1 1 0 011.414 0l2.293 2.293m-3-3l-3.293-3.293a1 1 0 010-1.414L16 5l4 4-4 4-3.293-3.293a1 1 0 01-1.414 0z"
    />
  </svg>
);

const CheckCircleIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className || "h-6 w-6"}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const TagIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className || "h-5 w-5"}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zm0 0v12a2 2 0 002 2h5a2 2 0 002-2V5a2 2 0 00-2-2H7z"
    />
  </svg>
);

const SpinnerIcon = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const SearchIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className || "h-4 w-4 text-gray-400"}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

// --- Helper Functions ---
const calculateDays = (start, end) => {
  if (!start || !end) return 0;
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (
    isNaN(startDate.getTime()) ||
    isNaN(endDate.getTime()) ||
    endDate < startDate
  )
    return 0;
  const diffTime = endDate.getTime() - startDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-GB", {
    ...defaultOptions,
    ...options,
  });
};

// --- Location Search Components ---
const LocationSuggestion = ({
  location,
  onSelect,
  field,
  serviceIndex,
  vehicleIndex,
}) => {
  const { name, country, state, city } = location.properties;
  const displayName = [name, city, state, country].filter(Boolean).join(", ");
  const [lon, lat] = location.geometry.coordinates;

  return (
    <div
      className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
      onClick={() => onSelect(location, field, serviceIndex, vehicleIndex)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect(location, field, serviceIndex, vehicleIndex);
        }
      }}
    >
      <div className="flex items-center">
        <SearchIcon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
          <p className="text-xs text-gray-500 truncate">
            {[city, state, country].filter(Boolean).join(", ")}
          </p>
          <p className="text-xs text-gray-400">
            Lat: {lat.toFixed(4)}, Lon: {lon.toFixed(4)}
          </p>
        </div>
      </div>
    </div>
  );
};

const LocationSuggestionsDropdown = ({
  suggestions,
  field,
  serviceIndex,
  vehicleIndex,
  onSelect,
}) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div 
      className="absolute z-50 w-full mt-1  rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto"
      role="listbox"
    >
      {suggestions.map((location, index) => (
        <LocationSuggestion
          key={`${location.id}-${index}`}
          location={location}
          onSelect={onSelect}
          field={field}
          serviceIndex={serviceIndex}
          vehicleIndex={vehicleIndex}
        />
      ))}
    </div>
  );
};

// --- Components ---
const InputField = ({
  name,
  label,
  icon,
  inputRef,
  suggestions,
  onSelect,
  activeField,
  serviceIndex = 0,
  vehicleIndex = 0,
  ...props
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputFocus = () => {
    if (props.value && props.value.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputChange = (e) => {
    props.onChange(e);
    setShowSuggestions(true);
  };

  const fieldKey = activeField
    ? activeField.split("-").slice(0, 3).join("-")
    : null;
  const currentSuggestions =
    fieldKey === `${name}-${serviceIndex}-${vehicleIndex}`
      ? suggestions
      : [];

  return (
    <div className="relative" ref={wrapperRef}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={name}
          name={name}
          ref={inputRef}
          className={`w-full ${
            icon ? "pl-10" : "pl-4"
          } pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F5546] focus:border-[#1F5546] transition ${
            showSuggestions ? "rounded-b-none border-b-0" : ""
          } ${props.error ? "border-red-500" : ""}`}
          {...props}
          autoComplete="off"
          onFocus={handleInputFocus}
          onChange={handleInputChange}
        />
        {showSuggestions &&
          currentSuggestions &&
          currentSuggestions.length > 0 && (
            <LocationSuggestionsDropdown
              suggestions={currentSuggestions}
              field={name}
              serviceIndex={serviceIndex}
              vehicleIndex={vehicleIndex}
              onSelect={onSelect}
            />
          )}
      </div>
      {props.error && (
        <p className="mt-1 text-sm text-red-600">{props.error}</p>
      )}
    </div>
  );
};

const QuantityStepper = ({ value, onChange, disabled = false }) => {
  const increment = () => {
    if (!disabled) onChange(value + 1);
  };
  const decrement = () => {
    if (!disabled && value > 1) {
      onChange(value - 1);
    }
  };

  return (
    <div className="flex items-center justify-center rounded-lg border border-gray-300 ">
      <button
        type="button"
        onClick={decrement}
        className="px-3 py-2 text-xl font-bold text-gray-500 hover:bg-gray-100 rounded-l-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        disabled={disabled || value <= 1}
      >
        -
      </button>
      <span className="px-4 py-2 text-base font-semibold text-gray-800 border-l border-r w-12 text-center">
        {value}
      </span>
      <button
        type="button"
        onClick={increment}
        className="px-3 py-2 text-xl font-bold text-gray-500 hover:bg-gray-100 rounded-r-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled}
      >
        +
      </button>
    </div>
  );
};

const Checkbox = ({ label, isChecked, onChange, disabled = false }) => (
  <label className={`flex items-center space-x-3 cursor-pointer p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
    <input
      type="checkbox"
      checked={isChecked}
      onChange={onChange}
      disabled={disabled}
      className="h-5 w-5 rounded border-gray-300 text-[#1F5546] focus:ring-[#1F5546] disabled:cursor-not-allowed"
    />
    <span className="text-gray-700 font-medium">{label}</span>
  </label>
);

const ServiceForm = ({
  service,
  index,
  handleServiceChange,
  handleVehicleDetailChange,
  handleVehicleTypeChange,
  handleMakeChange,
  handleModelChange,
  handleAdditionalServiceChange,
  handleLocationChange,
  handleLocationSelect,
  suggestions,
  activeField,
  addVehicle,
  removeVehicle,
  removeService,
  isOnlyService,
  vehicleData,
  bookingType,
  formErrors = {},
}) => {
  const totalDays = calculateDays(service.startDate, service.endDate);
  const isTransferService = ["airport", "p2p"].includes(service.serviceType);
  const isHireService = service.serviceType === "hourly";

  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);

  const getServiceErrorKey = (field) => `service_${index}_${field}`;

  return (
    <div className="p-6  rounded-xl relative ">
      <h3 className="text-xl font-semibold text-[#1F5546] mb-6">
        Service #{index + 1}
      </h3>
      {!isOnlyService && (
        <button
          type="button"
          onClick={() => removeService(index)}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
          disabled={isOnlyService}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Type *
          </label>
          <select
            name="serviceType"
            value={service.serviceType}
            onChange={(e) => handleServiceChange(index, e)}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#1F5546] focus:border-[#1F5546] transition ${
              formErrors[getServiceErrorKey('serviceType')] ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          >
            <option value="airport">Airport Transfer</option>
            <option value="p2p">Point to Point Transfer</option>
            <option value="hourly">Daily / Hourly Use</option>
          </select>
          {formErrors[getServiceErrorKey('serviceType')] && (
            <p className="mt-1 text-sm text-red-600">{formErrors[getServiceErrorKey('serviceType')]}</p>
          )}
        </div>

        <InputField
          name="time"
          label="Pickup Time"
          type="time"
          value={service.time}
          onChange={(e) => handleServiceChange(index, e)}
          icon={<ClockIcon />}
          error={formErrors[getServiceErrorKey('time')]}
        />

        <InputField
          name="startDate"
          label="Start Date *"
          type="date"
          value={service.startDate}
          onChange={(e) => handleServiceChange(index, e)}
          required
          icon={<CalendarIcon />}
          error={formErrors[getServiceErrorKey('startDate')]}
        />

        <InputField
          name="endDate"
          label="End Date (for multi-day)"
          type="date"
          value={service.endDate}
          onChange={(e) => handleServiceChange(index, e)}
          icon={<CalendarIcon />}
          error={formErrors[getServiceErrorKey('endDate')]}
        />

        {isHireService && (
          <>
            <InputField
              name="hours"
              label="Duration (hours per day) *"
              type="number"
              min="1"
              max="24"
              value={service.hours}
              onChange={(e) => handleServiceChange(index, e)}
              required
              error={formErrors[getServiceErrorKey('hours')]}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City Usage Area *
              </label>
              <select
                name="cityUsageArea"
                value={service.cityUsageArea}
                onChange={(e) => handleServiceChange(index, e)}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#1F5546] focus:border-[#1F5546] transition ${
                  formErrors[getServiceErrorKey('cityUsageArea')] ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Select City</option>
                <option value="Kuala Lumpur / Klang Valley">Kuala Lumpur / Klang Valley</option>
                <option value="Penang">Penang</option>
                <option value="Johor Bahru (JB)">Johor Bahru (JB)</option>
                <option value="Kuching">Kuching</option>
                <option value="Kota Kinabalu">Kota Kinabalu</option>
                <option value="Langkawi">Langkawi</option>
              </select>
              {formErrors[getServiceErrorKey('cityUsageArea')] && (
                <p className="mt-1 text-sm text-red-600">{formErrors[getServiceErrorKey('cityUsageArea')]}</p>
              )}
            </div>
          </>
        )}
      </div>

      {totalDays > 1 && (
        <div className="mt-4 text-right text-sm font-medium text-gray-600 bg-gray-100 p-2 rounded-md">
          Total Duration: {totalDays} days
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <InputField
          name="pickup"
          label={
            isHireService ? "Pickup Location (Optional)" : "Pickup Location *"
          }
          value={service.pickup}
          onChange={(e) => handleLocationChange(e, "pickup", index)}
          required={!isHireService}
          icon={<LocationMarkerIcon />}
          inputRef={pickupRef}
          serviceIndex={index}
          vehicleIndex={0}
          suggestions={suggestions.pickup[`${index}-0`]}
          onSelect={handleLocationSelect}
          activeField={activeField}
          error={formErrors[getServiceErrorKey('pickup')]}
        />

        <InputField
          name="dropoff"
          label={
            isHireService
              ? "Drop-off Location (Optional)"
              : "Drop-off Location *"
          }
          value={service.dropoff}
          onChange={(e) => handleLocationChange(e, "dropoff", index)}
          required={!isHireService}
          icon={<LocationMarkerIcon />}
          inputRef={dropoffRef}
          serviceIndex={index}
          vehicleIndex={0}
          suggestions={suggestions.dropoff[`${index}-0`]}
          onSelect={handleLocationSelect}
          activeField={activeField}
          error={formErrors[getServiceErrorKey('dropoff')]}
        />
      </div>

      {service.serviceType === "airport" && (
        <div className="mt-6">
          <InputField
            name="flightNumber"
            label="Flight Number"
            value={service.flightNumber}
            onChange={(e) => handleServiceChange(index, e)}
            placeholder="e.g., MH370"
            error={formErrors[getServiceErrorKey('flightNumber')]}
          />
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="text-lg font-semibold text-[#1F5546] mb-4">
          Vehicles Required *
        </h4>
        {service.vehicles.map((vehicle, vIndex) => {
          const vehicleErrorKey = `service_${index}_vehicle_${vIndex}`;
          return (
            <div
              key={vehicle.id}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 mt-6 p-4  rounded-lg border border-gray-200"
            >
              <div className="space-y-2 md:col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Type *
                    </label>
                    <select
                      value={vehicle.type}
                      onChange={(e) =>
                        handleVehicleTypeChange(index, vIndex, e.target.value)
                      }
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#1F5546] focus:border-[#1F5546] transition ${
                        formErrors[`${vehicleErrorKey}_type`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Hatchback">Hatchback</option>
                      <option value="Luxury">Luxury</option>
                      <option value="Van">Van</option>
                      <option value="Bus">Bus</option>
                    </select>
                    {formErrors[`${vehicleErrorKey}_type`] && (
                      <p className="mt-1 text-sm text-red-600">{formErrors[`${vehicleErrorKey}_type`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Make *
                    </label>
                    <select
                      value={vehicle.make}
                      onChange={(e) =>
                        handleMakeChange(index, vIndex, e.target.value)
                      }
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#1F5546] focus:border-[#1F5546] transition ${
                        formErrors[`${vehicleErrorKey}_make`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                      disabled={!vehicle.type}
                    >
                      <option value="">Select Make</option>
                      {(vehicleData.makes || []).map((make) => (
                        <option key={make} value={make}>
                          {make}
                        </option>
                      ))}
                    </select>
                    {formErrors[`${vehicleErrorKey}_make`] && (
                      <p className="mt-1 text-sm text-red-600">{formErrors[`${vehicleErrorKey}_make`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Model *
                    </label>
                    <select
                      value={vehicle.model}
                      onChange={(e) =>
                        handleModelChange(index, vIndex, e.target.value)
                      }
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#1F5546] focus:border-[#1F5546] transition ${
                        formErrors[`${vehicleErrorKey}_model`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                      disabled={!vehicle.make}
                    >
                      <option value="">Select Model</option>
                      {((vehicleData.modelsByMake && vehicleData.modelsByMake[vehicle.make]) || []).map(
                        (model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        )
                      )}
                    </select>
                    {formErrors[`${vehicleErrorKey}_model`] && (
                      <p className="mt-1 text-sm text-red-600">{formErrors[`${vehicleErrorKey}_model`]}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end justify-between">
                <div className="w-full md:w-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:text-right">
                    Quantity *
                  </label>
                  <div className="flex items-center justify-between md:justify-end gap-2">
                    <QuantityStepper
                      value={vehicle.quantity}
                      onChange={(newQuantity) => {
                        const syntheticEvent = {
                          target: { name: "quantity", value: newQuantity },
                        };
                        handleVehicleDetailChange(index, vIndex, syntheticEvent);
                      }}
                      disabled={!vehicle.type}
                    />
                    {formErrors[`${vehicleErrorKey}_quantity`] && (
                      <p className="text-xs text-red-600 mt-1">{formErrors[`${vehicleErrorKey}_quantity`]}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => removeVehicle(index, vIndex)}
                      className="text-gray-400 hover:text-red-500 disabled:opacity-50 transition-colors p-1"
                      disabled={service.vehicles.length === 1 || !vehicle.type}
                      title="Remove vehicle"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => addVehicle(index)}
          className="text-sm font-semibold text-[#1F5546] hover:text-teal-700 transition-colors mt-2"
          disabled={!service.vehicles[0]?.type}
        >
          + Add another vehicle type
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="text-lg font-semibold text-[#1F5546] mb-4">
          Additional Services
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            "Baby Seat",
            "Tour Guide",
            "Wheelchair Accessible",
            "Wi-Fi",
            "Meet & Greet",
          ].map((addon) => (
            <Checkbox
              key={addon}
              label={addon}
              isChecked={service.additionalServices.includes(addon)}
              onChange={() => handleAdditionalServiceChange(index, addon)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Payload Creator ---
// Create the complete payload with all data in a single object
const createCompletePayload = (services, contactInfo, remarks, bookingType) => ({
  bookingType: bookingType,
  contactInfo: {
    name: contactInfo.name.trim(),
    phone: contactInfo.phone.trim(),
  },
  remarks: remarks.trim(),
  services: services.map((service) => ({
    id: service.id,
    serviceType: service.serviceType,
    startDate: service.startDate,
    endDate: service.endDate,
    time: service.time,
    pickup: {
      address: service.pickup.trim(),
      latitude: service.pickupLatitude || null,
      longitude: service.pickupLongitude || null,
    },
    dropoff: {
      address: service.dropoff.trim(),
      latitude: service.dropoffLatitude || null,
      longitude: service.dropoffLongitude || null,
    },
    flightNumber: service.flightNumber.trim() || "",
    hours: service.hours || null,
    cityUsageArea: service.cityUsageArea || "",
    additionalServices: service.additionalServices || [],
    vehicles: service.vehicles.map((vehicle) => ({
      id: vehicle.id,
      type: vehicle.type,
      make: vehicle.make,
      model: vehicle.model,
      quantity: vehicle.quantity,
    })),
    estimatedDistance: 0,
    estimatedDuration: 0,
  })),
  metadata: {
    source: "web_quotation_form",
    totalServices: services.length,
    totalVehicles: services.reduce(
      (acc, service) =>
        acc + service.vehicles.reduce((vAcc, v) => vAcc + v.quantity, 0),
      0
    ),
    totalQuantity: services.reduce(
      (acc, service) => acc + service.vehicles.reduce((vAcc, v) => vAcc + v.quantity, 0),
      0
    ),
    hasCoordinates: services.some(
      (service) =>
        (service.pickupLatitude && service.pickupLongitude) ||
        (service.dropoffLatitude && service.dropoffLongitude)
    ),
    serviceTypes: services.map(s => s.serviceType),
    hasAdditionalServices: services.some(s => (s.additionalServices || []).length > 0),
    createdAt: new Date().toISOString(),
    formVersion: "2.0", // Version for future compatibility
  },
  pricing: {
    subtotal: 0, // This would be calculated by your pricing engine
    taxes: 0,
    total: 0,
    currency: "MYR", // Default currency
    breakdown: {
      baseFare: 0,
      distanceFare: 0,
      waitingTime: 0,
      additionalServices: 0,
      taxes: 0,
    },
    services: services.map((service, index) => ({
      serviceIndex: index,
      serviceType: service.serviceType,
      estimatedCost: 0,
      vehicleBreakdown: service.vehicles.map((vehicle, vIndex) => ({
        vehicleIndex: vIndex,
        type: vehicle.type,
        quantity: vehicle.quantity,
        estimatedCost: 0,
      })),
    })),
  },
});

// Create and send params to next page using URL search params
const createAndSendParams = async (services, contactInfo, remarks, bookingType, router, toast, setLoading) => {
  try {
    // Create complete payload
    const completePayload = createCompletePayload(services, contactInfo, remarks, bookingType);

    // Calculate estimated distances if coordinates are available (Haversine formula)
    completePayload.services.forEach((service) => {
      if (
        service.pickup.latitude &&
        service.pickup.longitude &&
        service.dropoff.latitude &&
        service.dropoff.longitude &&
        service.pickup.latitude !== 0 &&
        service.pickup.longitude !== 0 &&
        service.dropoff.latitude !== 0 &&
        service.dropoff.longitude !== 0
      ) {
        const R = 6371; // Earth's radius in km
        const dLat = ((service.dropoff.latitude - service.pickup.latitude) * Math.PI) / 180;
        const dLon = ((service.dropoff.longitude - service.pickup.longitude) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((service.pickup.latitude * Math.PI) / 180) *
          Math.cos((service.dropoff.latitude * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        service.estimatedDistance = Math.round(distance * 100) / 100; // Round to 2 decimals
      }
    });

    // Create URL parameters
    const params = new URLSearchParams();
    
    // Main single payload - encoded as JSON string (URL encoded for safety)
    params.set("payload", encodeURIComponent(JSON.stringify(completePayload)));
    
    // Add individual parameters for backward compatibility and easy access
    params.set("bookingType", bookingType);
    params.set("contactName", contactInfo.name.trim());
    params.set("contactPhone", contactInfo.phone.trim());
    params.set("remarks", encodeURIComponent(remarks.trim()));
    params.set("totalServices", services.length.toString());
    params.set("totalVehicles", completePayload.metadata.totalVehicles.toString());
    params.set("hasCoordinates", completePayload.metadata.hasCoordinates.toString());
    params.set("timestamp", new Date().toISOString());
    
    // Add service-specific parameters for quick access
    services.forEach((service, serviceIndex) => {
      const serviceKey = `service_${serviceIndex}`;
      params.set(`${serviceKey}_type`, service.serviceType);
      params.set(`${serviceKey}_startDate`, service.startDate || "");
      params.set(`${serviceKey}_endDate`, service.endDate || "");
      params.set(`${serviceKey}_time`, service.time || "");
      params.set(`${serviceKey}_pickup`, encodeURIComponent(service.pickup || ""));
      params.set(`${serviceKey}_dropoff`, encodeURIComponent(service.dropoff || ""));
      params.set(`${serviceKey}_flightNumber`, service.flightNumber || "");
      params.set(`${serviceKey}_hours`, service.hours?.toString() || "");
      params.set(`${serviceKey}_cityUsageArea`, service.cityUsageArea || "");
      
      // Coordinates
      params.set(`${serviceKey}_pickupLat`, service.pickupLatitude?.toString() || "");
      params.set(`${serviceKey}_pickupLng`, service.pickupLongitude?.toString() || "");
      params.set(`${serviceKey}_dropoffLat`, service.dropoffLatitude?.toString() || "");
      params.set(`${serviceKey}_dropoffLng`, service.dropoffLongitude?.toString() || "");
      
      // Vehicles for this service
      service.vehicles.forEach((vehicle, vehicleIndex) => {
        const vKey = `${serviceKey}_vehicle_${vehicleIndex}`;
        params.set(`${vKey}_id`, vehicle.id);
        params.set(`${vKey}_type`, vehicle.type);
        params.set(`${vKey}_make`, vehicle.make);
        params.set(`${vKey}_model`, vehicle.model);
        params.set(`${vKey}_quantity`, vehicle.quantity.toString());
      });
      
      // Additional services
      service.additionalServices.forEach((addon, addonIndex) => {
        params.set(`${serviceKey}_addon_${addonIndex}`, addon);
      });
    });

    // Store in sessionStorage for backup and recovery
    try {
      sessionStorage.setItem("bookingCompletePayload", JSON.stringify(completePayload));
      sessionStorage.setItem("bookingParams", params.toString());
      sessionStorage.setItem("bookingData", JSON.stringify({
        services,
        contactInfo,
        remarks,
        bookingType,
        timestamp: new Date().toISOString()
      }));
    } catch (storageError) {
      console.warn("Failed to save to sessionStorage:", storageError);
    }

    // Enhanced logging for debugging (in development only)
    if (process.env.NODE_ENV === 'development') {
      console.log("=== COMPLETE BOOKING PAYLOAD ===");
      console.log("📋 Booking Type:", bookingType);
      console.log("👤 Contact Info:", {
        name: contactInfo.name,
        phone: contactInfo.phone
      });
      console.log("💬 Remarks:", remarks);
      console.log("🚗 Services Summary:", {
        totalServices: services.length,
        totalVehicles: completePayload.metadata.totalVehicles,
        serviceTypes: completePayload.metadata.serviceTypes,
        hasCoordinates: completePayload.metadata.hasCoordinates
      });
      console.log("📍 Coordinates Available:", completePayload.metadata.hasCoordinates);
      console.log("💰 Pricing Structure:", completePayload.pricing);
      console.log("🔗 Full Payload Size:", JSON.stringify(completePayload).length, "characters");
      console.log("========================");
    }

    // Navigate to review page with search params
    const redirectUrl = `http://localhost:3001/screens/signup?${params.toString()}`;
    router.push(redirectUrl);

    // Show success message
    toast.success(`Redirecting to review with ${services.length} service(s) and ${completePayload.metadata.totalVehicles} vehicle(s)...`);

    return { 
      success: true, 
      url: redirectUrl,
      params: params.toString(),
      completePayload,
      metadata: completePayload.metadata
    };
    
  } catch (error) {
    console.error("❌ Error creating booking parameters:", error);
    toast.error("Failed to create booking parameters. Please try again.");
    return { 
      success: false, 
      error: error.message,
      params: null,
      completePayload: null 
    };
  }
};

// Validation function
const validateForm = (services, contactInfo) => {
  const errors = {};
  
  // Validate contact info
  if (!contactInfo.name?.trim()) {
    errors.contactName = 'Name is required';
  }
  if (!contactInfo.phone?.trim()) {
    errors.contactPhone = 'Phone number is required';
  }
  
  // Validate services
  services.forEach((service, serviceIndex) => {
    if (!service.startDate) {
      errors[`service-${serviceIndex}-date`] = 'Start date is required';
    }
    if (!service.time) {
      errors[`service-${serviceIndex}-time`] = 'Time is required';
    }
    // Add more validations as needed
  });
  
  return errors;
};

const CreateOrder = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Form, 2: Review, 3: Confirmation
  const [showSubmittingModal, setShowSubmittingModal] = useState(false);
  const [bookingType, setBookingType] = useState("quotation"); // 'quotation' or 'booking'
  const [suggestions, setSuggestions] = useState({
    pickup: {},
    dropoff: {},
  });
  const [activeField, setActiveField] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const timeoutRef = useRef(null);
  const locationSearchRefs = useRef({});

  // Fetch vehicle data
  const [vehicleData, setVehicleData] = useState({
    makes: [],
    modelsByMake: {},
  });

  const fetchVehicles = async () => {
    try {
      const response = await get("auth/vehicles/makes-models");
      if (response.data && response.data.data) {
        setVehicleData(response.data.data);
      } else {
        // Fallback data
        setVehicleData({
          makes: ["Toyota", "Honda", "BMW", "Mercedes", "Hyundai"],
          modelsByMake: {
            Toyota: ["Camry", "Corolla", "RAV4", "Alphard", "Vellfire"],
            Honda: ["Civic", "Accord", "CR-V"],
            BMW: ["3 Series", "5 Series", "7 Series", "X5"],
            Mercedes: ["C-Class", "E-Class", "S-Class", "V-Class"],
            Hyundai: ["Staria", "Santa Fe"],
          },
        });
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error("Failed to fetch vehicle data. Using default options.");
      // Set fallback data
      setVehicleData({
        makes: ["Toyota", "Honda", "BMW", "Mercedes", "Hyundai"],
        modelsByMake: {
          Toyota: ["Camry", "Corolla", "RAV4", "Alphard", "Vellfire"],
          Honda: ["Civic", "Accord", "CR-V"],
          BMW: ["3 Series", "5 Series", "7 Series", "X5"],
          Mercedes: ["C-Class", "E-Class", "S-Class", "V-Class"],
          Hyundai: ["Staria", "Santa Fe"],
        },
      });
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Form state using the new quotation structure with coordinates
  const initialService = {
    id: `s-${Date.now()}`,
    serviceType: "airport", // Default to airport transfer
    startDate: "",
    endDate: "",
    time: "",
    pickup: "",
    pickupLatitude: null,
    pickupLongitude: null,
    dropoff: "",
    dropoffLatitude: null,
    dropoffLongitude: null,
    flightNumber: "",
    hours: 4,
    cityUsageArea: "Kuala Lumpur / Klang Valley",
    additionalServices: [],
    vehicles: [
      {
        id: `v-${Date.now()}`,
        type: "",
        make: "",
        model: "",
        quantity: 1,
      },
    ],
  };

  const [services, setServices] = useState([JSON.parse(JSON.stringify(initialService))]);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    phone: "",
  });
  const [remarks, setRemarks] = useState("");

  // Initialize booking type from URL params
  useEffect(() => {
    const bookingTypeFromParams = searchParams.get("bookingType");
    if (bookingTypeFromParams && ["quotation", "booking"].includes(bookingTypeFromParams)) {
      setBookingType(bookingTypeFromParams);
    }
  }, [searchParams]);

  // Initialize form from sessionStorage or URL params
  useEffect(() => {
    try {
      // Check sessionStorage first
      const storedData = sessionStorage.getItem("bookingData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (parsedData.services && parsedData.contactInfo) {
          setServices(parsedData.services);
          setContactInfo(parsedData.contactInfo);
          setRemarks(parsedData.remarks || "");
          setIsFormInitialized(true);
          return;
        }
      }

      // Check URL params for payload
      const payloadParam = searchParams.get("payload");
      if (payloadParam) {
        try {
          const decodedPayload = JSON.parse(decodeURIComponent(payloadParam));
          if (decodedPayload.services && decodedPayload.contactInfo) {
            setServices(decodedPayload.services);
            setContactInfo(decodedPayload.contactInfo);
            setRemarks(decodedPayload.remarks || "");
            setBookingType(decodedPayload.bookingType || "quotation");
            setIsFormInitialized(true);
          }
        } catch (decodeError) {
          console.warn("Failed to decode payload from URL:", decodeError);
        }
      }
    } catch (error) {
      console.error("Error initializing form from stored data:", error);
    }
  }, [searchParams]);

  // Location search function
  const fetchLocations = useCallback(
    async (query, field, serviceIndex, vehicleIndex) => {
      if (!query || query.length < 2) return;

      try {
        const response = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(
            query
          )}&limit=5&lang=en`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const validFeatures = (data.features || []).filter((feature) => {
          const [lon, lat] = feature.geometry.coordinates;
          return (
            typeof lat === "number" &&
            typeof lon === "number" &&
            lat >= -90 &&
            lat <= 90 &&
            lon >= -180 &&
            lon <= 180
          );
        });

        setSuggestions((prev) => ({
          ...prev,
          [field]: {
            ...prev[field],
            [`${serviceIndex}-${vehicleIndex}`]: validFeatures,
          },
        }));
      } catch (error) {
        console.error("[CreateOrder] Error fetching locations:", error);
        toast.error("Error fetching location suggestions. Please try again.");
      }
    },
    []
  );

  // Debounce function
  const debounce = useCallback((func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }, []);

  const debouncedLocationSearch = useCallback(
    debounce((query, field, serviceIndex, vehicleIndex) => {
      fetchLocations(query, field, serviceIndex, vehicleIndex);
    }, 300),
    [debounce, fetchLocations]
  );

  // Location handlers
  const handleLocationSelect = useCallback(
    (location, field, serviceIndex, vehicleIndex = 0) => {
      const { name, country, state, city } = location.properties;
      const displayName = [name, city, state, country]
        .filter(Boolean)
        .join(", ");
      const [longitude, latitude] = location.geometry.coordinates;

      if (
        typeof latitude !== "number" ||
        typeof longitude !== "number" ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
      ) {
        toast.error(
          "Invalid coordinates selected. Please choose another location."
        );
        return;
      }

      setServices((prevServices) => {
        const newServices = prevServices.map((service, sIndex) =>
          sIndex === serviceIndex
            ? {
                ...service,
                ...(field === "pickup" && {
                  pickup: displayName,
                  pickupLatitude: Number(latitude.toFixed(6)),
                  pickupLongitude: Number(longitude.toFixed(6)),
                }),
                ...(field === "dropoff" && {
                  dropoff: displayName,
                  dropoffLatitude: Number(latitude.toFixed(6)),
                  dropoffLongitude: Number(longitude.toFixed(6)),
                }),
              }
            : service
        );

        // Clear suggestions after selection
        setSuggestions((prev) => ({
          ...prev,
          [field]: {
            ...prev[field],
            [`${serviceIndex}-${vehicleIndex}`]: [],
          },
        }));

        return newServices;
      });

      setActiveField(null);

      // Clear location errors
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`service_${serviceIndex}_${field}`];
        return newErrors;
      });

      // Restore focus to the input after selection
      setTimeout(() => {
        const inputElement =
          locationSearchRefs.current[
            `${field}-${serviceIndex}-${vehicleIndex}`
          ];
        if (inputElement) {
          inputElement.focus();
        }
      }, 100);
    },
    []
  );

  const handleLocationChange = useCallback(
    (e, field, serviceIndex, vehicleIndex = 0) => {
      const { value } = e.target;
      const inputKey = `${field}-${serviceIndex}-${vehicleIndex}`;

      // Store reference to current input
      locationSearchRefs.current[inputKey] = e.target;

      // Update service state
      setServices((prevServices) => {
        const newServices = prevServices.map((service, sIndex) =>
          sIndex === serviceIndex
            ? {
                ...service,
                ...(field === "pickup" && {
                  pickup: value,
                  pickupLatitude: null,
                  pickupLongitude: null,
                }),
                ...(field === "dropoff" && {
                  dropoff: value,
                  dropoffLatitude: null,
                  dropoffLongitude: null,
                }),
              }
            : service
        );
        return newServices;
      });

      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set active field for suggestions
      setActiveField(`${field}-${serviceIndex}-${vehicleIndex}`);

      // Clear location errors when user starts typing
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`service_${serviceIndex}_${field}`];
        return newErrors;
      });

      // Debounced search
      timeoutRef.current = setTimeout(() => {
        debouncedLocationSearch(value, field, serviceIndex, vehicleIndex);
      }, 300);
    },
    [debouncedLocationSearch]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Form handlers
  const handleContactInfoChange = (e) => {
    const { name, value } = e.target;
    setContactInfo({ ...contactInfo, [name]: value });
    
    // Clear errors when user starts typing
    setFormErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`contact_${name}`];
      return newErrors;
    });
  };

  const handleServiceChange = (serviceIndex, e) => {
    const { name, value } = e.target;
    setServices((currentServices) =>
      currentServices.map((service, i) =>
        i === serviceIndex ? { ...service, [name]: value } : service
      )
    );

    // Clear service errors when user starts typing
    setFormErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`service_${serviceIndex}_${name}`];
      return newErrors;
    });
  };

  const handleVehicleDetailChange = (serviceIndex, vehicleIndex, e) => {
    const { name, value } = e.target || e;
    const processedValue =
      name === "quantity" ? Math.max(1, parseInt(value, 10) || 1) : value;

    setServices((currentServices) =>
      currentServices.map((service, sIdx) => {
        if (sIdx !== serviceIndex) return service;
        const updatedVehicles = service.vehicles.map((vehicle, vIdx) => {
          if (vIdx !== vehicleIndex) return vehicle;
          return { ...vehicle, [name]: processedValue };
        });
        return { ...service, vehicles: updatedVehicles };
      })
    );

    // Clear vehicle errors when user starts typing
    setFormErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`service_${serviceIndex}_vehicle_${vehicleIndex}_${name}`];
      return newErrors;
    });
  };

  const handleVehicleTypeChange = (serviceIndex, vehicleIndex, value) => {
    setServices((prevServices) =>
      prevServices.map((service, sIdx) => {
        if (sIdx !== serviceIndex) return service;
        const updatedVehicles = service.vehicles.map((vehicle, vIdx) => {
          if (vIdx !== vehicleIndex) return vehicle;
          return {
            ...vehicle,
            type: value,
            make: value ? vehicle.make : "",
            model: value ? vehicle.model : "",
          };
        });
        return { ...service, vehicles: updatedVehicles };
      })
    );

    // Clear vehicle errors when type changes
    setFormErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`service_${serviceIndex}_vehicle_${vehicleIndex}_type`];
      delete newErrors[`service_${serviceIndex}_vehicle_${vehicleIndex}_make`];
      delete newErrors[`service_${serviceIndex}_vehicle_${vehicleIndex}_model`];
      return newErrors;
    });
  };

  const handleMakeChange = (serviceIndex, vehicleIndex, value) => {
    setServices((prevServices) =>
      prevServices.map((service, sIdx) => {
        if (sIdx !== serviceIndex) return service;
        const updatedVehicles = service.vehicles.map((vehicle, vIdx) => {
          if (vIdx !== vehicleIndex) return vehicle;
          return {
            ...vehicle,
            make: value,
            model: value ? vehicle.model : "",
          };
        });
        return { ...service, vehicles: updatedVehicles };
      })
    );

    // Clear model error when make changes
    setFormErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`service_${serviceIndex}_vehicle_${vehicleIndex}_make`];
      delete newErrors[`service_${serviceIndex}_vehicle_${vehicleIndex}_model`];
      return newErrors;
    });
  };

  const handleModelChange = (serviceIndex, vehicleIndex, value) => {
    setServices((prevServices) =>
      prevServices.map((service, sIdx) => {
        if (sIdx !== serviceIndex) return service;
        const updatedVehicles = service.vehicles.map((vehicle, vIdx) => {
          if (vIdx !== vehicleIndex) return vehicle;
          return { ...vehicle, model: value };
        });
        return { ...service, vehicles: updatedVehicles };
      })
    );

    // Clear model error when model changes
    setFormErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`service_${serviceIndex}_vehicle_${vehicleIndex}_model`];
      return newErrors;
    });
  };

  const handleAdditionalServiceChange = (serviceIndex, serviceName) => {
    setServices((currentServices) =>
      currentServices.map((service, i) => {
        if (i !== serviceIndex) return service;
        const currentAddons = service.additionalServices || [];
        const newAddons = currentAddons.includes(serviceName)
          ? currentAddons.filter((s) => s !== serviceName)
          : [...currentAddons, serviceName];
        return { ...service, additionalServices: newAddons };
      })
    );
  };

  const addVehicle = (serviceIndex) => {
    const newVehicleId = `v-${Date.now() + Math.random()}`;
    const updatedServices = [...services];
    updatedServices[serviceIndex].vehicles.push({
      id: newVehicleId,
      type: "",
      make: "",
      model: "",
      quantity: 1,
    });
    setServices(updatedServices);
  };

  const removeVehicle = (serviceIndex, vehicleIndex) => {
    if (services[serviceIndex].vehicles.length > 1) {
      const updatedServices = [...services];
      // Clear errors for this vehicle
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`service_${serviceIndex}_vehicle_${vehicleIndex}_type`];
        delete newErrors[`service_${serviceIndex}_vehicle_${vehicleIndex}_make`];
        delete newErrors[`service_${serviceIndex}_vehicle_${vehicleIndex}_model`];
        delete newErrors[`service_${serviceIndex}_vehicle_${vehicleIndex}_quantity`];
        return newErrors;
      });
      
      updatedServices[serviceIndex].vehicles.splice(vehicleIndex, 1);
      setServices(updatedServices);
    }
  };

  const addService = () => {
    const newServiceId = `s-${Date.now() + Math.random()}`;
    setServices([
      ...services,
      {
        ...initialService,
        id: newServiceId,
        vehicles: [
          { id: `v-${Date.now() + Math.random()}`, type: "", make: "", model: "", quantity: 1 },
        ],
        additionalServices: [],
      },
    ]);
  };

  const removeService = (index) => {
    if (services.length > 1) {
      // Clear suggestions for this service
      setSuggestions((prev) => ({
        pickup: Object.fromEntries(
          Object.entries(prev.pickup).filter(
            ([key]) => !key.startsWith(`${index}-`)
          )
        ),
        dropoff: Object.fromEntries(
          Object.entries(prev.dropoff).filter(
            ([key]) => !key.startsWith(`${index}-`)
          )
        ),
      }));
      
      // Clear errors for this service
      setFormErrors(prev => {
        const newErrors = { ...prev };
        Object.keys(newErrors).forEach(key => {
          if (key.startsWith(`service_${index}_`)) {
            delete newErrors[key];
          }
        });
        return newErrors;
      });
      
      setServices(services.filter((_, i) => i !== index));
    }
  };

  // Enhanced Validation with error state management
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    // Validate contact info
    if (!contactInfo.name.trim()) {
      newErrors['contact_name'] = "Full name is required.";
      isValid = false;
    } else if (!/^[a-zA-Z\s]{2,}$/.test(contactInfo.name.trim())) {
      newErrors['contact_name'] = "Full name must contain at least 2 letters and only letters and spaces.";
      isValid = false;
    }
    
    if (!contactInfo.phone.trim()) {
      newErrors['contact_phone'] = "Phone number is required.";
      isValid = false;
    } else if (!/^\+?\d{8,15}$/.test(contactInfo.phone.trim())) {
      newErrors['contact_phone'] = "Phone number must be 8-15 digits, optionally starting with '+'.";
      isValid = false;
    }

    // Validate services
    services.forEach((service, serviceIndex) => {
      const servicePrefix = `service_${serviceIndex}_`;
      
      // Validate dates
      if (!service.startDate) {
        newErrors[`${servicePrefix}startDate`] = `Start date is required for Service ${serviceIndex + 1}.`;
        isValid = false;
      } else {
        const startDate = new Date(service.startDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (startDate < today) {
          newErrors[`${servicePrefix}startDate`] = `Start date for Service ${serviceIndex + 1} cannot be in the past.`;
          isValid = false;
        }
      }
      
      if (service.endDate) {
        const endDate = new Date(service.endDate);
        const startDate = new Date(service.startDate);
        if (endDate < startDate) {
          newErrors[`${servicePrefix}endDate`] = `End date for Service ${serviceIndex + 1} cannot be before start date.`;
          isValid = false;
        }
      }

      // Validate service type specific fields
      if (service.serviceType === "airport") {
        if (
          service.flightNumber &&
          !/^[A-Z]{2}\d{1,4}$/.test(service.flightNumber)
        ) {
          newErrors[`${servicePrefix}flightNumber`] = `Flight number for Service ${serviceIndex + 1} must be in the format like 'MH370'.`;
          isValid = false;
        }
      }

      if (service.serviceType === "hourly") {
        if (!service.hours || service.hours < 1 || service.hours > 24) {
          newErrors[`${servicePrefix}hours`] = `Hours for Service ${serviceIndex + 1} must be between 1 and 24.`;
          isValid = false;
        }
        if (!service.cityUsageArea) {
          newErrors[`${servicePrefix}cityUsageArea`] = `City usage area is required for Service ${serviceIndex + 1}.`;
          isValid = false;
        }
      }

      // Validate locations for non-hourly services
      if (service.serviceType !== "hourly") {
        if (!service.pickup.trim()) {
          newErrors[`${servicePrefix}pickup`] = `Pickup location is required for Service ${serviceIndex + 1}.`;
          isValid = false;
        } else if (service.pickup.trim().length < 3) {
          newErrors[`${servicePrefix}pickup`] = `Pickup location for Service ${serviceIndex + 1} must be at least 3 characters long.`;
          isValid = false;
        }
        
        if (!service.dropoff.trim()) {
          newErrors[`${servicePrefix}dropoff`] = `Drop-off location is required for Service ${serviceIndex + 1}.`;
          isValid = false;
        } else if (service.dropoff.trim().length < 3) {
          newErrors[`${servicePrefix}dropoff`] = `Drop-off location for Service ${serviceIndex + 1} must be at least 3 characters long.`;
          isValid = false;
        }
      }

      // Validate vehicles
      if (service.vehicles.length === 0) {
        newErrors[`${servicePrefix}vehicles`] = `At least one vehicle is required for Service ${serviceIndex + 1}.`;
        isValid = false;
      }

      service.vehicles.forEach((vehicle, vehicleIndex) => {
        const vehiclePrefix = `${servicePrefix}vehicle_${vehicleIndex}_`;
        
        if (!vehicle.type) {
          newErrors[`${vehiclePrefix}type`] = `Vehicle type is required for Vehicle ${vehicleIndex + 1} in Service ${serviceIndex + 1}.`;
          isValid = false;
        }
        if (!vehicle.make) {
          newErrors[`${vehiclePrefix}make`] = `Vehicle make is required for Vehicle ${vehicleIndex + 1} in Service ${serviceIndex + 1}.`;
          isValid = false;
        }
        if (!vehicle.model) {
          newErrors[`${vehiclePrefix}model`] = `Vehicle model is required for Vehicle ${vehicleIndex + 1} in Service ${serviceIndex + 1}.`;
          isValid = false;
        }
        if (vehicle.quantity < 1 || vehicle.quantity > 10) {
          newErrors[`${vehiclePrefix}quantity`] = `Vehicle quantity must be between 1 and 10 for Vehicle ${vehicleIndex + 1} in Service ${serviceIndex + 1}.`;
          isValid = false;
        }
      });
    });

    setFormErrors(newErrors);
    
    // Show toast errors only if validation fails
    if (!isValid && Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError);
    }

    return isValid;
  }, [contactInfo, services]);

  // Submit handler with enhanced parameter passing
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setShowSubmittingModal(true);

    try {
      // Create and send parameters using the enhanced function
      const result = await createAndSendParams(
        services,
        contactInfo,
        remarks,
        bookingType,
        router,
        toast,
        setLoading
      );

      if (result.success) {
        // Show success message
        toast.success("Booking request created successfully! Redirecting to review...");
        
        // Set current step to review (if you want to show review within the same component)
        // setCurrentStep(2);
        
        console.log("✅ Booking parameters sent successfully:", {
          url: result.url,
          totalServices: services.length,
          totalVehicles: result.completePayload?.metadata?.totalVehicles || 0
        });
      } else {
        throw new Error(result.error || "Unknown error occurred");
      }
      
    } catch (error) {
      console.error("Submission error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create quotation request. Please try again.";
      toast.error(errorMessage);
    } finally {
      setShowSubmittingModal(false);
      setLoading(false);
    }
  };

  // Handle form navigation (for internal navigation within the app)
  const handleProceedToReview = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    
    // Create params for internal navigation
    createAndSendParams(
      services,
      contactInfo,
      remarks,
      bookingType,
      router,
      toast,
      setLoading
    );
  };

  // Handle back to form
  const handleBackToForm = () => {
    setCurrentStep(1);
    setFormErrors({});
  };

  // Render based on step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Form Step
        return (
          <>
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
              Request a Quotation
            </h2>
            <p className="text-center text-gray-500 mb-10">
              Fill in the details below and our team will get back to you
              shortly with a customized quotation.
            </p>

            <form onSubmit={handleSubmit} className="space-y-14">
              <div className="p-4 rounded-xl">
                <h3 className="text-xl font-semibold text-[#1F5546] mb-4">
                  Contact Information *
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    name="name"
                    label="Full Name *"
                    value={contactInfo.name}
                    onChange={handleContactInfoChange}
                    required
                    icon={<UserIcon />}
                    error={formErrors['contact_name']}
                  />
                  <InputField
                    name="phone"
                    label="Phone Number *"
                    type="tel"
                    value={contactInfo.phone}
                    onChange={handleContactInfoChange}
                    required
                    icon={<PhoneIcon />}
                    error={formErrors['contact_phone']}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Booking Type
                    </label>
                    <div className="relative">
                      <select
                        value={bookingType}
                        onChange={(e) => setBookingType(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F5546] focus:border-[#1F5546] transition"
                      >
                        <option value="quotation">Quotation</option>
                        <option value="booking">Booking</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {services.map((service, index) => (
                <ServiceForm
                  key={service.id}
                  service={service}
                  index={index}
                  handleServiceChange={handleServiceChange}
                  handleVehicleDetailChange={handleVehicleDetailChange}
                  handleVehicleTypeChange={handleVehicleTypeChange}
                  handleMakeChange={handleMakeChange}
                  handleModelChange={handleModelChange}
                  handleAdditionalServiceChange={handleAdditionalServiceChange}
                  handleLocationChange={handleLocationChange}
                  handleLocationSelect={handleLocationSelect}
                  suggestions={suggestions}
                  activeField={activeField}
                  addVehicle={addVehicle}
                  removeVehicle={removeVehicle}
                  removeService={removeService}
                  isOnlyService={services.length === 1}
                  vehicleData={vehicleData}
                  bookingType={bookingType}
                  formErrors={formErrors}
                />
              ))}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={addService}
                  className="text-[#1F5546] font-semibold py-2 px-4 border-2 border-dashed border-[#1F5546] rounded-lg hover:bg-[#1F5546] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  + Add Another Service
                </button>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#1F5546] mb-4">
                  Overall Remarks
                </h3>
                <textarea
                  name="remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F5546] focus:border-[#1F5546] transition resize-none"
                  placeholder="Any special requests or additional information..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#1F5546] hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <SpinnerIcon />
                      Submit Request
                    </>
                  ) : (
                    "Submit & Review"
                  )}
                </button>
              </div>
            </form>
          </>
        );

      case 2: // Review Step
        // Parse the payload from URL params for review display
        const payloadParam = searchParams.get("payload");
        let reviewData = null;
        
        try {
          if (payloadParam) {
            reviewData = JSON.parse(decodeURIComponent(payloadParam));
          }
        } catch (error) {
          console.error("Error parsing review data:", error);
        }

        return (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
              Review Your Booking
            </h2>
            <p className="text-center text-gray-500 mb-10">
              Please review your details before proceeding to signup.
            </p>
            
            {reviewData ? (
              <>
                <div className=" rounded-xl shadow-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-[#1F5546] mb-4">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Name:</span>
                      <p className="text-gray-900 ml-2">{reviewData.contactInfo.name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Phone:</span>
                      <p className="text-gray-900 ml-2">{reviewData.contactInfo.phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium text-gray-700">Type:</span>
                      <p className="text-gray-900 ml-2 capitalize">{reviewData.bookingType}</p>
                    </div>
                  </div>
                </div>

                <div className=" rounded-xl shadow-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-[#1F5546] mb-4">
                    Services Summary
                  </h3>
                  {reviewData.services.map((service, index) => (
                    <div key={service.id} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:mb-0">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Service #{index + 1}: {service.serviceType.replace(/^\w/, c => c.toUpperCase())}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Date:</span>
                          <p className="text-gray-900 ml-2">{service.startDate}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Time:</span>
                          <p className="text-gray-900 ml-2">{service.time}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Pickup:</span>
                          <p className="text-gray-900 ml-2 truncate">{service.pickup.address}</p>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Drop-off: {service.dropoff.address}
                        <br />
                        Vehicles: {service.vehicles.length} types, Total: {service.vehicles.reduce((sum, v) => sum + v.quantity, 0)} vehicles
                      </div>
                      {service.additionalServices.length > 0 && (
                        <div className="mt-2 text-xs text-gray-600">
                          Additional Services: {service.additionalServices.join(", ")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {reviewData.remarks && (
                  <div className=" rounded-xl shadow-lg p-6 mb-6">
                    <h3 className="text-xl font-semibold text-[#1F5546] mb-4">
                      Remarks
                    </h3>
                    <p className="text-gray-700">{reviewData.remarks}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={handleBackToForm}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    Back to Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Navigate to signup with the same params
                      const currentParams = new URLSearchParams(window.location.search);
                      router.push(`/signup?${currentParams.toString()}`);
                    }}
                    disabled={loading}
                    className="flex-1 bg-[#1F5546] hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <SpinnerIcon />
                        Processing...
                      </>
                    ) : (
                      "Proceed to Signup"
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No review data available. Please go back and submit the form.</p>
                <button
                  onClick={handleBackToForm}
                  className="mt-4 bg-[#1F5546] hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Back to Form
                </button>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
            <p className="text-gray-600 mb-6">Your booking request has been submitted successfully.</p>
            <button
              onClick={handleBackToForm}
              className="bg-[#1F5546] hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Create New Request
            </button>
          </div>
        );
    }
  };

  // Submitting Modal
  if (showSubmittingModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className=" rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center space-x-3 mb-4">
            <SpinnerIcon />
            <h3 className="text-lg font-semibold text-gray-900">
              Processing Your Request
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            We're preparing your booking details and redirecting you to the review page...
          </p>
          <div className="text-sm text-gray-500 text-center">
            Services: {services.length} | Vehicles: {services.reduce((sum, s) => sum + s.vehicles.reduce((vSum, v) => vSum + v.quantity, 0), 0)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-12 lg:px-24 xl:px-32 py-10 sm:py-16 md:py-20 font-body bg-[#c8d5d1d9] rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-tl-[100px] rounded-br-[60px] sm:rounded-br-[80px] lg:rounded-br-[100px] overflow-hidden">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Main Content */}
      <div className="w-full mx-auto">
        {/* Step Indicator */}
        {currentStep > 1 && (
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <button
                onClick={handleBackToForm}
                className="text-[#1F5546] hover:underline"
              >
                Edit Form
              </button>
              <span>/</span>
              <span className={currentStep === 2 ? "font-medium" : ""}>
                Review
              </span>
              {currentStep === 2 && <span>/ Signup</span>}
            </div>
          </div>
        )}
        
        {renderStepContent()}
      </div>
    </div>
  );
};

export default CreateOrder;