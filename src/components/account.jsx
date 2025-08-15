"use client";

import { useEffect, useState } from "react";
import {
  MdEdit,
  MdLock,
  MdHelp,
  MdPrivacyTip,
  MdLogout,
  MdClose,
  MdDelete,
} from "react-icons/md";
import { X, FileText, Upload, Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { get, put, post } from "@/services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Logout Modal Component
const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">Sign Out</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <MdClose size={24} />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <MdLogout size={32} className="text-red-500" />
            </div>
          </div>
          <div className="text-center mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Are you sure you want to sign out?
            </h4>
            <p className="text-gray-600 text-sm">
              {"You'll need to sign in again to access your account."}
            </p>
          </div>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 text-white bg-[#1F5546] hover:bg-[#164139] rounded-xl font-medium transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

// Document Display Component
const DocumentDisplay = ({ documents, onRemove, isEditable }) => {
  console.log("DocumentDisplay - documents:", documents);

  return (
    <div className="space-y-4">
      {documents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc, index) => (
            <div
              key={index}
              className="relative border border-gray-200 rounded-lg p-3"
            >
              <div className="flex items-center space-x-2">
                <FileText size={20} className="text-gray-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Document {index + 1}
                  </p>
                  <a
                    href={doc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    View Document
                  </a>
                </div>
                {isEditable && (
                  <button
                    onClick={() => onRemove(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <MdDelete size={20} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// View Profile Modal Component
const ViewProfileModal = ({
  isOpen,
  onClose,
  profileData,
  onProfileUpdate,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    avatarUrl: "",
    isCompany: false,
    companyName: "",
    companyDetails: "",
    documentUrls: [],
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [selectedDocumentFiles, setSelectedDocumentFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    console.log("ViewProfileModal - profileData received:", profileData);

    if (profileData) {
      const newFormData = {
        name: profileData.name || "",
        phone: profileData.phone || "",
        email: profileData.email || "",
        avatarUrl: profileData.avatarUrl || "",
        isCompany: profileData.customer?.isCompany || false,
        companyName: profileData.customer?.companyName || "",
        companyDetails: profileData.customer?.companyDetails || "",
        documentUrls: profileData.customer?.documentUrls || [],
      };

      console.log("ViewProfileModal - setting formData:", newFormData);
      setFormData(newFormData);
      setImagePreview(profileData.avatarUrl || null);
    }
  }, [profileData]);

  const removeDocument = (index) => {
    console.log("Removing document at index:", index);
    const updatedDocuments = formData.documentUrls.filter(
      (_, i) => i !== index
    );
    console.log("Updated documents after removal:", updatedDocuments);

    setFormData({
      ...formData,
      documentUrls: updatedDocuments,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log("Avatar file selected:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    // Validate file
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("File is too large. Maximum size is 10MB.");
      return;
    }

    const validImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validImageTypes.includes(file.type)) {
      toast.error("Invalid file type. Only images are allowed for avatar.");
      return;
    }

    setSelectedAvatarFile(file);

    // Show preview
    const previewUrl = URL.createObjectURL(file);
    console.log("Setting avatar preview:", previewUrl);
    setImagePreview(previewUrl);
  };

  const handleDocumentChange = (e) => {
    const files = Array.from(e.target.files);
    console.log(
      "Document files selected:",
      files.map((f) => ({ name: f.name, size: f.size, type: f.type }))
    );

    // Validate files
    const validFiles = [];
    const maxSize = 10 * 1024 * 1024; // 10MB

    files.forEach((file) => {
      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large. Maximum size is 10MB.`);
        return;
      }

      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!validTypes.includes(file.type)) {
        toast.error(
          `File ${file.name} has invalid type. Only images and PDF/DOC files are allowed.`
        );
        return;
      }

      validFiles.push(file);
    });

    console.log("Valid document files after filtering:", validFiles);
    setSelectedDocumentFiles(validFiles);
  };

  const uploadSingleFile = async (file) => {
    try {
      console.log("=== UPLOADING SINGLE FILE ===");
      console.log("File details:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      const formDataUpload = new FormData();
      formDataUpload.append("files", file);

      const response = await post("files/upload-multiple", formDataUpload);

      console.log("Response data:", response.data);
      console.log("Response success:", response.data?.success);
      console.log("Response files:", response.data?.data?.files);

      if (
        response.data &&
        response.data.success &&
        response.data.data &&
        response.data.data.files
      ) {
        const uploadedUrl = response.data.data.files[0].url;
        console.log("Single file uploaded successfully - URL:", uploadedUrl);
        return uploadedUrl;
      } else {
        console.error("Single file upload failed - Invalid response structure");
        throw new Error(response.data?.message || "Failed to upload file");
      }
    } catch (error) {
      console.error("=== SINGLE FILE UPLOAD ERROR ===");
      console.error("Error details:", error);
      console.error("Error message:", error.message);
      console.error("Error response:", error.response?.data);
      throw error;
    }
  };

  const uploadMultipleFiles = async (files) => {
    try {
      const formDataUpload = new FormData();
      files.forEach((file, index) => {
        formDataUpload.append("files", file);
      });

      const response = await post("files/upload-multiple", formDataUpload);

      console.log("Response data:", response.data);
      console.log("Response success:", response.data?.success);
      console.log("Response files:", response.data?.data?.files);

      if (
        response.data &&
        response.data.success &&
        response.data.data &&
        response.data.data.files
      ) {
        const uploadedUrls = response.data.data.files.map((file) => file.url);
        console.log(
          "Multiple files uploaded successfully - URLs:",
          uploadedUrls
        );
        return uploadedUrls;
      } else {
        console.error(
          "Multiple files upload failed - Invalid response structure"
        );
        throw new Error(response.data?.message || "Failed to upload files");
      }
    } catch (error) {
      console.error("Error details:", error);
      console.error("Error message:", error.message);
      console.error("Error response:", error.response?.data);
      throw error;
    }
  };

  const handleUpdateProfile = async () => {
    console.log("=== STARTING PROFILE UPDATE PROCESS ===");
    console.log("Current form data:", formData);
    console.log("Selected avatar file:", selectedAvatarFile);
    console.log("Selected document files:", selectedDocumentFiles);

    // Validate required fields
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (formData.isCompany && !formData.companyName.trim()) {
      toast.error("Company name is required for company accounts");
      return;
    }

    setUploading(true);

    try {
      let avatarUrl = formData.avatarUrl;
      let updatedDocumentUrls = [...formData.documentUrls];

      console.log("Initial avatarUrl:", avatarUrl);
      console.log("Initial documentUrls:", updatedDocumentUrls);

      // Upload avatar if selected
      if (selectedAvatarFile) {
        toast.info("Uploading avatar...");

        try {
          avatarUrl = await uploadSingleFile(selectedAvatarFile);
          toast.success("Avatar uploaded successfully!");
        } catch (error) {
          console.error("Avatar upload failed:", error);
          toast.error(`Avatar upload failed: ${error.message}`);
          setUploading(false);
          return;
        }
      } else {
        console.log("No avatar file selected, keeping existing avatar");
      }

      // Upload documents if selected (only for company accounts)
      if (formData.isCompany && selectedDocumentFiles.length > 0) {
        toast.info("Uploading documents...");

        try {
          const documentUrls = await uploadMultipleFiles(selectedDocumentFiles);
          updatedDocumentUrls = [...updatedDocumentUrls, ...documentUrls];
          console.log("All document URLs after upload:", updatedDocumentUrls);
          toast.success("Documents uploaded successfully!");
        } catch (error) {
          console.error("Document upload failed:", error);
          toast.error(`Document upload failed: ${error.message}`);
          setUploading(false);
          return;
        }
      } else if (formData.isCompany) {
        console.log("No document files selected for company account");
      } else {
        console.log("Individual account - no documents needed");
      }

      // Prepare payload for profile update
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        avatarUrl: avatarUrl,
        isCompany: formData.isCompany,
        companyName: formData.isCompany ? formData.companyName.trim() : "",
        companyDetails: formData.isCompany
          ? formData.companyDetails.trim()
          : "",
        documentUrls: formData.isCompany ? updatedDocumentUrls : [],
      };

      console.log(JSON.stringify(payload, null, 2));

      const response = await put("auth/profile", payload);

      console.log("Response data:", response.data);
      console.log("Response success:", response.data?.success);
      console.log("Updated user data:", response.data?.data?.user);

      if (response.data && response.data.success) {
        console.log("Profile updated successfully!");
        toast.success("Profile updated successfully!");
        onProfileUpdate(response.data.data.user);
        onClose();

        // Reset form state
        setSelectedAvatarFile(null);
        setSelectedDocumentFiles([]);
        setImagePreview(null);
      } else {
        console.error("Profile update failed:", response.data);
        toast.error(
          response.data?.error ||
            response.data?.message ||
            "Failed to update profile"
        );
      }
    } catch (error) {
      console.error("Error response:", error.response?.data);
      toast.error(`Error updating profile: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-[#1F5546] to-[#2D7A5F] p-6 text-white">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">Edit Profile</h3>
            <button
              onClick={onClose}
              className="hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4 overflow-hidden border-4 border-gray-100">
                {imagePreview ? (
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1F5546] to-[#2D7A5F] flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {getInitials(formData.name)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full max-w-md">
              <label className="block text-sm font-medium text-[#060606] mb-2">
                Profile Image
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm"
                />
                <Camera size={20} className="text-gray-600" />
              </div>
              {selectedAvatarFile && (
                <div className="mt-2 text-sm text-gray-600">
                  <p>Selected: {selectedAvatarFile.name}</p>
                </div>
              )}
            </div>
          </div>

          {/* Account Type Toggle */}
          <div className="border border-gray-200 rounded-lg p-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isCompany}
                onChange={(e) =>
                  setFormData({ ...formData, isCompany: e.target.checked })
                }
                className="w-5 h-5 text-[#1F5546] border-gray-300 rounded focus:ring-[#1F5546]"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Company Account
                </span>
                <p className="text-xs text-gray-500">
                  Check this if you want to register as a company instead of an
                  individual
                </p>
              </div>
            </label>
          </div>

          {/* Basic Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#060606] mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1F5546] focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#060606] mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1F5546] focus:border-transparent"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          {/* Email Field (Non-editable) */}
          <div>
            <label className="block text-sm font-medium text-[#060606] mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed
            </p>
          </div>

          {/* Company Fields - Show only when isCompany is true */}
          {formData.isCompany && (
            <div className="border-t border-gray-200 pt-6 space-y-6">
              <h4 className="text-lg font-semibold text-gray-900">
                Company Information
              </h4>

              <div>
                <label className="block text-sm font-medium text-[#060606] mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1F5546] focus:border-transparent"
                  placeholder="Enter your company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#060606] mb-2">
                  Company Details
                </label>
                <textarea
                  value={formData.companyDetails}
                  onChange={(e) =>
                    setFormData({ ...formData, companyDetails: e.target.value })
                  }
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent"
                  placeholder="Describe your company and services"
                />
              </div>

              {/* Document Upload Section */}
              <div>
                <label className="block text-sm font-medium text-[#060606] mb-2">
                  Upload Company Documents
                </label>
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="file"
                    accept="image/*,application/pdf,.doc,.docx"
                    multiple
                    onChange={handleDocumentChange}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm"
                  />
                  <Upload size={20} className="text-gray-600" />
                </div>
                {selectedDocumentFiles.length > 0 && (
                  <div className="mb-4 text-sm text-gray-600">
                    <p>{selectedDocumentFiles.length} document(s) selected:</p>
                    <ul className="list-disc list-inside text-xs">
                      {selectedDocumentFiles.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Current Documents Display */}
                {formData.documentUrls.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Current Documents:
                    </p>
                    <DocumentDisplay
                      documents={formData.documentUrls}
                      onRemove={removeDocument}
                      isEditable={true}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateProfile}
              disabled={uploading}
              className={`flex-1 bg-[#1F5546] text-white py-3 px-4 rounded-lg hover:bg-[#164139] transition-colors font-medium ${
                uploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {uploading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Section Component
const ProfileSection = ({ profile, onViewClick }) => {
  const profileImage = profile?.avatarUrl;

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <div className="flex flex-col items-center lg:items-start border border-gray-300 rounded-xl p-6 sm:p-8 lg:p-10">
      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-4 overflow-hidden">
        {profileImage ? (
          <img
            src={profileImage || "/placeholder.svg"}
            alt="Profile"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="w-full h-full bg-gradient-to-br from-[#1F5546] to-[#2D7A5F] flex items-center justify-center"
          style={{ display: profileImage ? "none" : "flex" }}
        >
          <span className="text-white text-2xl font-bold">
            {getInitials(profile?.name)}
          </span>
        </div>
      </div>
      <div className="text-center lg:text-left mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          {profile?.name?.toUpperCase() || "USER NAME"}
        </h2>
        <p className="text-sm text-gray-600">
          {profile?.email || "email@example.com"}
        </p>
        {profile?.customer?.isCompany && profile?.customer?.companyName && (
          <p className="text-sm text-gray-500 mt-1">
            {profile.customer.companyName}
          </p>
        )}
        <div className="flex items-center justify-center lg:justify-start mt-2 space-x-4 text-xs text-gray-500">
          <span
            className={`px-2 py-1 rounded-full ${
              profile?.isVerified
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {profile?.isVerified ? "Verified" : "Unverified"}
          </span>
          <span
            className={`px-2 py-1 rounded-full ${
              profile?.isActive
                ? "bg-blue-100 text-blue-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {profile?.isActive ? "Active" : "Inactive"}
          </span>
          <span
            className={`px-2 py-1 rounded-full ${
              profile?.customer?.isCompany
                ? "bg-purple-100 text-purple-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {profile?.customer?.isCompany ? "Company" : "Individual"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <button
          onClick={onViewClick}
          className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
        >
          <MdEdit size={18} className="mr-2" />
          <span className="text-sm">Edit profile</span>
        </button>
      </div>
    </div>
  );
};

// Menu Item Component
const MenuItem = ({
  icon: Icon,
  text,
  isActive,
  onClick,
  activeColor,
  link,
  isSignOut,
}) => {
  if (isSignOut) {
    return (
      <div
        className={`p-4 rounded-lg flex items-center transition-colors cursor-pointer ${
          isActive ? activeColor : "bg-gray-50 hover:bg-gray-100"
        }`}
        onClick={onClick}
      >
        <Icon
          size={20}
          className={`mr-3 ${isActive ? "text-white" : "text-gray-600"}`}
        />
        <span className={isActive ? "text-white font-medium" : "text-gray-700"}>
          {text}
        </span>
      </div>
    );
  }

  return (
    <Link
      href={link}
      className={`p-4 rounded-lg flex items-center transition-colors cursor-pointer ${
        isActive ? activeColor : "bg-gray-50 hover:bg-gray-100"
      }`}
      onClick={onClick}
    >
      <Icon
        size={20}
        className={`mr-3 ${isActive ? "text-white" : "text-gray-600"}`}
      />
      <span className={isActive ? "text-white font-medium" : "text-gray-700"}>
        {text}
      </span>
    </Link>
  );
};

// Main Account Component
const Account = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const menuItems = [
    {
      icon: MdLock,
      text: "Change Password",
      activeColor: "bg-[#1F5546] hover:bg-[#164139]",
      link: "/screens/changePassword",
    },
    {
      icon: MdHelp,
      text: "Help & Support",
      activeColor: "bg-[#1F5546] hover:bg-[#164139]",
      link: "/screens/help&support",
    },
    {
      icon: MdPrivacyTip,
      text: "Privacy Policy",
      activeColor: "bg-[#1F5546] hover:bg-[#164139]",
      link: "/screens/privacyPolicy",
    },
    {
      icon: MdLogout,
      text: "Sign Out",
      activeColor: "bg-[#1F5546] hover:bg-[#164139]",
      isSignOut: true,
    },
  ];

  const handleMenuClick = (text, link) => {
    setActiveMenu(text);
    if (text === "Sign Out") {
      setShowLogoutModal(true);
    }
  };

  const handleLogoutConfirm = () => {
    console.log("Signing out...");
    dispatch(logout());
    localStorage.removeItem("token");
    setShowLogoutModal(false);
    toast.success("Signed out successfully!");
    router.replace("/screens/login");
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
    setActiveMenu(null);
  };

  const handleViewProfile = () => {
    setShowViewModal(true);
  };

  const handleProfileUpdate = (updatedProfile) => {
    console.log("Profile updated in main component:", updatedProfile);
    setProfile(updatedProfile);
  };

  const getProfile = async () => {
    try {
      setLoading(true);
      console.log("Fetching profile data...");

      const response = await get("auth/profile");

      console.log("=== GET PROFILE API RESPONSE ===");
      console.log("Full response:", response);
      console.log("Response data:", response.data);

      if (response.data.success && response.data.data.user) {
        console.log(
          "Profile data loaded successfully:",
          response.data.data.user
        );
        setProfile(response.data.data.user);
        toast.success("Profile loaded successfully!");
      } else {
        console.error(
          "Failed to fetch profile data:",
          response.error || response
        );
        toast.error("Failed to load profile data");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error("Error loading profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E8F6F2] flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F5546] mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#E8F6F2] p-4 sm:p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">
            <span className="text-[#1F5546]">ASRA</span>{" "}
            <span className="text-[#EAB308]">Chauffeur</span>
          </h1>
        </div>
        <div className="w-full mx-auto">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
            Account
          </h1>
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <ProfileSection
                profile={profile}
                onViewClick={handleViewProfile}
              />
              <div className="flex-1 space-y-2 border border-gray-300 rounded-xl">
                {menuItems.map((item) => (
                  <MenuItem
                    key={item.text}
                    icon={item.icon}
                    text={item.text}
                    isActive={activeMenu === item.text}
                    onClick={() => handleMenuClick(item.text, item.link)}
                    activeColor={item.activeColor}
                    link={item.link}
                    isSignOut={item.isSignOut}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />

      <ViewProfileModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        onProfileUpdate={handleProfileUpdate}
        profileData={profile}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default Account;
