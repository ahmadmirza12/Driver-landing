"use client"

import { useState } from "react"
import { X, Calendar, Clock, Palette, Upload, Check } from "lucide-react"
import { MdClose } from "react-icons/md"

// Date Picker Modal
export const DatePickerModal = ({ isOpen, onClose, onSelect, selectedDate, title = "Select Date" }) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date())
  const [viewDate, setViewDate] = useState(new Date())

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const handleDateSelect = (date) => {
    setCurrentDate(date)
  }

  const handleConfirm = () => {
    onSelect(currentDate)
    onClose()
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(viewDate)
    newDate.setMonth(viewDate.getMonth() + direction)
    setViewDate(newDate)
  }

  const isToday = (date) => {
    const today = new Date()
    return date && date.toDateString() === today.toDateString()
  }

  const isSelected = (date) => {
    return date && currentDate && date.toDateString() === currentDate.toDateString()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="bg-gradient-to-r from-[#1F5546] to-[#2D7A5F] p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="w-6 h-6" />
              <h3 className="text-xl font-bold">{title}</h3>
            </div>
            <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h4 className="text-lg font-semibold text-gray-800">
              {months[viewDate.getMonth()]} {viewDate.getFullYear()}
            </h4>
            <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(viewDate).map((date, index) => (
              <button
                key={index}
                onClick={() => date && handleDateSelect(date)}
                disabled={!date}
                className={`
                  h-10 w-10 rounded-lg text-sm font-medium transition-all duration-200
                  ${!date ? "invisible" : ""}
                  ${isSelected(date) ? "bg-[#1F5546] text-white shadow-lg scale-105" : ""}
                  ${isToday(date) && !isSelected(date) ? "bg-[#E8F6F2] text-[#1F5546] font-bold" : ""}
                  ${!isSelected(date) && !isToday(date) ? "hover:bg-gray-100 text-gray-700" : ""}
                `}
              >
                {date?.getDate()}
              </button>
            ))}
          </div>

          {/* Selected Date Display */}
          {currentDate && (
            <div className="mt-6 p-4 bg-[#E8F6F2] rounded-lg">
              <p className="text-sm text-gray-600">Selected Date:</p>
              <p className="text-lg font-semibold text-[#1F5546]">
                {currentDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-[#1F5546] text-white py-3 px-4 rounded-lg hover:bg-[#164139] transition-colors font-medium"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Time Picker Modal
export const TimePickerModal = ({ isOpen, onClose, onSelect, selectedTime, title = "Select Time" }) => {
  const [hours, setHours] = useState(selectedTime ? selectedTime.split(":")[0] : "12")
  const [minutes, setMinutes] = useState(selectedTime ? selectedTime.split(":")[1] : "00")
  const [period, setPeriod] = useState(selectedTime && Number.parseInt(selectedTime.split(":")[0]) >= 12 ? "PM" : "AM")

  const hourOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"))
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"))

  const handleConfirm = () => {
    let hour24 = Number.parseInt(hours)
    if (period === "PM" && hour24 !== 12) hour24 += 12
    if (period === "AM" && hour24 === 12) hour24 = 0

    const timeString = `${hour24.toString().padStart(2, "0")}:${minutes}`
    onSelect(timeString)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="bg-gradient-to-r from-[#1F5546] to-[#2D7A5F] p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6" />
              <h3 className="text-xl font-bold">{title}</h3>
            </div>
            <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Time Display */}
          <div className="text-center mb-8">
            <div className="text-4xl font-bold text-[#1F5546] mb-2">
              {hours}:{minutes} {period}
            </div>
            <p className="text-gray-500">Selected Time</p>
          </div>

          {/* Time Selectors */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <label className="text-sm font-medium text-gray-600 mb-2">Hour</label>
              <select
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-16 h-12 text-center border-2 border-gray-200 rounded-lg focus:border-[#1F5546] focus:outline-none text-lg font-semibold"
              >
                {hourOptions.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-2xl font-bold text-gray-400 mt-6">:</div>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <label className="text-sm font-medium text-gray-600 mb-2">Minute</label>
              <select
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="w-16 h-12 text-center border-2 border-gray-200 rounded-lg focus:border-[#1F5546] focus:outline-none text-lg font-semibold"
              >
                {minuteOptions.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                ))}
              </select>
            </div>

            {/* AM/PM */}
            <div className="flex flex-col items-center">
              <label className="text-sm font-medium text-gray-600 mb-2">Period</label>
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => setPeriod("AM")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    period === "AM" ? "bg-[#1F5546] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  AM
                </button>
                <button
                  onClick={() => setPeriod("PM")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    period === "PM" ? "bg-[#1F5546] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  PM
                </button>
              </div>
            </div>
          </div>

          {/* Quick Time Buttons */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {["09:00", "12:00", "15:00", "18:00", "20:00", "22:00"].map((time) => (
              <button
                key={time}
                onClick={() => {
                  const [h, m] = time.split(":")
                  const hour12 =
                    Number.parseInt(h) > 12
                      ? (Number.parseInt(h) - 12).toString().padStart(2, "0")
                      : Number.parseInt(h) === 0
                        ? "12"
                        : h
                  setHours(hour12)
                  setMinutes(m)
                  setPeriod(Number.parseInt(h) >= 12 ? "PM" : "AM")
                }}
                className="py-2 px-3 text-sm bg-gray-100 hover:bg-[#E8F6F2] hover:text-[#1F5546] rounded-lg transition-colors"
              >
                {time}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-[#1F5546] text-white py-3 px-4 rounded-lg hover:bg-[#164139] transition-colors font-medium"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Color Picker Modal
export const ColorPickerModal = ({ isOpen, onClose, onSelect, selectedColor, title = "Select Color" }) => {
  const [currentColor, setCurrentColor] = useState(selectedColor || "#1F5546")
  const [customColor, setCustomColor] = useState(selectedColor || "#1F5546")

  const predefinedColors = [
    "#1F5546",
    "#2D7A5F",
    "#EAB308",
    "#DC2626",
    "#2563EB",
    "#7C3AED",
    "#059669",
    "#D97706",
    "#DB2777",
    "#4F46E5",
    "#0891B2",
    "#65A30D",
    "#DC2626",
    "#EA580C",
    "#CA8A04",
    "#16A34A",
    "#0D9488",
    "#0EA5E9",
    "#6366F1",
    "#8B5CF6",
    "#A855F7",
    "#EC4899",
    "#F43F5E",
    "#EF4444",
  ]

  const handleColorSelect = (color) => {
    setCurrentColor(color)
    setCustomColor(color)
  }

  const handleConfirm = () => {
    onSelect(currentColor)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="bg-gradient-to-r from-[#1F5546] to-[#2D7A5F] p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Palette className="w-6 h-6" />
              <h3 className="text-xl font-bold">{title}</h3>
            </div>
            <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Color Preview */}
          <div className="text-center mb-6">
            <div
              className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-gray-200 shadow-lg"
              style={{ backgroundColor: currentColor }}
            ></div>
            <p className="text-lg font-semibold text-gray-800">{currentColor}</p>
          </div>

          {/* Custom Color Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">Custom Color</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value)
                  setCurrentColor(e.target.value)
                }}
                className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value)
                  setCurrentColor(e.target.value)
                }}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:border-[#1F5546] focus:outline-none"
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Predefined Colors */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-3">Predefined Colors</label>
            <div className="grid grid-cols-6 gap-3">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                    currentColor === color ? "border-gray-800 shadow-lg" : "border-gray-200"
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {currentColor === color && <Check className="w-5 h-5 text-white mx-auto" />}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-[#1F5546] text-white py-3 px-4 rounded-lg hover:bg-[#164139] transition-colors font-medium"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// File Picker Modal
export const FilePickerModal = ({ isOpen, onClose, onSelect, acceptedTypes = "image/*", title = "Select File" }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFileSelect = (file) => {
    setSelectedFile(file)

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleConfirm = () => {
    if (selectedFile) {
      onSelect(selectedFile)
      onClose()
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="bg-gradient-to-r from-[#1F5546] to-[#2D7A5F] p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Upload className="w-6 h-6" />
              <h3 className="text-xl font-bold">{title}</h3>
            </div>
            <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* File Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
              dragActive ? "border-[#1F5546] bg-[#E8F6F2]" : "border-gray-300 hover:border-[#1F5546] hover:bg-gray-50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop your file here, or{" "}
              <label className="text-[#1F5546] cursor-pointer hover:underline">
                browse
                <input
                  type="file"
                  accept={acceptedTypes}
                  onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </p>
            <p className="text-sm text-gray-500">Supports: {acceptedTypes.replace("*", "all formats")}</p>
          </div>

          {/* File Preview */}
          {selectedFile && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                {preview ? (
                  <img
                    src={preview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedFile(null)
                    setPreview(null)
                  }}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <MdClose size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedFile}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                selectedFile
                  ? "bg-[#1F5546] text-white hover:bg-[#164139]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Select File
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
