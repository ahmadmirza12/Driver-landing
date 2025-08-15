"use client"
import { useState } from "react"
import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { useSearchParams } from "next/navigation"
import { post } from "@/services/api"
import { User, Building2, Upload, X, FileText, Image } from "lucide-react"
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setToken } from "@/redux/slices/authSlice";
const Number = () => {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [accountType, setAccountType] = useState("individual")
  const [companyName, setCompanyName] = useState("")
  const [companyDetails, setCompanyDetails] = useState("")
  const [documentUrls, setDocumentUrls] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const name = searchParams.get("name")
  const verificationToken = decodeURIComponent(searchParams.get("verificationToken") || "")
  const password = searchParams.get("password")
  const router = useRouter()
  const dispatch = useDispatch()

  const handleContinue = async () => {
    if (!phoneNumber) {
      alert("Please enter a valid phone number")
      return
    }

    if (!verificationToken) {
      alert("Verification token is missing. Please go back and verify your email again.")
      return
    }

    if (accountType === "company" && (!companyName || !companyDetails)) {
      alert("Please fill in all company details")
      return
    }

    setIsSubmitting(true)
    try {
      const registrationData = {
        email: email || "",
        phone: phoneNumber,
        name: name || "",
        password: password || "",
        verificationToken: verificationToken || "",
        isCompany: accountType === "company",
        ...(accountType === "company" && {
          companyName,
          companyDetails,
          documentUrls,
        }),
      }

      console.log("Registration data:", registrationData)
      const response = await post("auth/register/customer", registrationData)
      console.log("Registration successful:", response.data)

      toast.success(response.data.message)
      dispatch(setToken(response.data.data.token))
      await localStorage.setItem("token", response.data.data.token)
      router.push("/screens/dashboard")
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message)
      toast.error(error.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendCode = () => {
    console.log("Resending code...")
  }

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files)
    if (files.length === 0) return

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ]
    const maxSize = 5 * 1024 * 1024

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} has an unsupported type. Allowed: PDF, DOC, DOCX, JPG, PNG.`)
        return
      }
      if (file.size > maxSize) {
        alert(`File ${file.name} exceeds the 5MB size limit.`)
        return
      }
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append("files", file)
      })

      const response = await post("files/upload-multiple", formData)
      console.log("Response:", response.data)

      if (response.data && response.data.success && response.data.data && response.data.data.files) {
        const uploadedUrls = response.data.data.files.map((file) => file.url)

        if (uploadedUrls.length === 0) {
          throw new Error("No URLs returned from the server.")
        }

        setDocumentUrls([...documentUrls, ...uploadedUrls])
        setUploadedFiles([...uploadedFiles, ...files])

      } else {
        throw new Error("Invalid response structure from server.")
      }
    } catch (error) {
      console.error("Failed to upload files:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      })
      alert(error.response?.data?.message || "Failed to upload files. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const removeDocument = (index) => {
    const updatedUrls = documentUrls.filter((_, i) => i !== index)
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index)
    setDocumentUrls(updatedUrls)
    setUploadedFiles(updatedFiles)
  }

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-4 h-4" />
    }
    return <FileText className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-[#E8F6F2] flex font-body items-center justify-center px-4 py-8">
      <div className="absolute top-8 left-8">
        <h1 className="text-2xl font-bold text-left">
          <span className="text-[#1F5546]">ASRA</span>
          <span className="text-[#EAB308]">Chauffeur</span>
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-left">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#060606] mb-4">{"Let's Get Started"}</h2>
          <p className="text-[#060606] leading-relaxed">Create your account</p>
        </div>

        <div className="space-y-6">
          {/* Beautiful Account Type Selection */}
          <div>
            <label className="block text-sm font-medium text-[#060606] mb-4">Account Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Individual Account */}
              <div
                onClick={() => setAccountType("individual")}
                className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  accountType === "individual"
                    ? "border-[#1F5546] bg-[#1F5546]/5 shadow-lg"
                    : "border-gray-200 hover:border-[#1F5546]/50 hover:shadow-md"
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div
                    className={`p-3 rounded-full transition-colors ${
                      accountType === "individual"
                        ? "bg-[#1F5546] text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#060606]">Individual</h3>
                    <p className="text-xs text-gray-500 mt-1">Personal account</p>
                  </div>
                </div>
                {accountType === "individual" && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-[#1F5546] rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>

              {/* Company Account */}
              <div
                onClick={() => setAccountType("company")}
                className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  accountType === "company"
                    ? "border-[#1F5546] bg-[#1F5546]/5 shadow-lg"
                    : "border-gray-200 hover:border-[#1F5546]/50 hover:shadow-md"
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div
                    className={`p-3 rounded-full transition-colors ${
                      accountType === "company"
                        ? "bg-[#1F5546] text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#060606]">Company</h3>
                    <p className="text-xs text-gray-500 mt-1">Business account</p>
                  </div>
                </div>
                {accountType === "company" && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-[#1F5546] rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#060606] mb-2">Enter Your Number</label>
            <PhoneInput
              international
              defaultCountry="US"
              value={phoneNumber}
              onChange={setPhoneNumber}
              placeholder="Mobile number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors placeholder-gray-400"
              inputClassName="flex-1 px-4 py-3 border-none focus:ring-0 outline-none"
              buttonClassName="border-r-0 rounded-l-lg"
            />
          </div>

          <p className="text-sm text-[#727272] transition-colors text-left">
            You will receive an SMS verification that may apply message and data rates.
          </p>
          {/* Company Details */}
          {accountType === "company" && (
            <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
              <div>
                <label className="block text-sm font-medium text-[#060606] mb-2">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent transition-colors placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#060606] mb-2">Company Details</label>
                <textarea
                  value={companyDetails}
                  onChange={(e) => setCompanyDetails(e.target.value)}
                  placeholder="Enter company details, description, etc."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent transition-colors placeholder-gray-400 resize-vertical"
                />
              </div>

              {/* Beautiful File Upload */}
              <div>
                <label className="block text-sm font-medium text-[#060606] mb-3">Company Documents</label>
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className={`relative block w-full p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-300 ${
                      isUploading
                        ? "border-blue-300 bg-blue-50"
                        : "border-gray-300 hover:border-[#1F5546] hover:bg-[#1F5546]/5"
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-4">
                      <div className={`p-4 rounded-full ${isUploading ? "bg-blue-100" : "bg-gray-100"}`}>
                        <Upload className={`w-8 h-8 ${isUploading ? "text-blue-600" : "text-gray-400"}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#060606]">
                          {isUploading ? "Uploading files..." : "Click to upload documents"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PDF, DOC, DOCX, JPG, PNG up to 5MB each
                        </p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Uploaded Files Display */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-600 mb-3 font-medium">Uploaded Documents:</p>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 rounded-lg border border-green-100"
                        >
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className="flex-shrink-0 text-green-600">
                              {getFileIcon(file)}
                            </div>
                            <span className="text-sm text-gray-700 truncate font-medium">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <button
                            onClick={() => removeDocument(index)}
                            className="ml-3 p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                            disabled={isUploading}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Phone Input */}
          

          <button
            onClick={handleContinue}
            disabled={isSubmitting || isUploading}
            className="w-full bg-[#1F5546] text-white py-3 px-4 rounded-lg hover:bg-[#164038] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Registering..." : "Continue"}
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Number