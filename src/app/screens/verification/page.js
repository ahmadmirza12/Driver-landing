"use client"

import { useState, useRef, useEffect } from "react"
import { useDispatch } from "react-redux"
import { useRouter, useSearchParams } from "next/navigation"
import { post } from "@/services/api"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { resetSignup } from "../../../redux/signupSlice"

const AuthenticationCode = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const purpose = searchParams.get("purpose")
  const name = searchParams.get("name")
  const password = searchParams.get("password")
  const sendOtp = searchParams.get("sendOtp")
  const dispatch = useDispatch()

  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isResending, setIsResending] = useState(false)
  const inputRefs = useRef([])

  // Countdown timer effect
  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  useEffect(() => {
    setCountdown(60)
  }, [])

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    const newOtp = [...otp]
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i]
    }
    setOtp(newOtp)
    const nextIndex = Math.min(pastedData.length, 5)
    inputRefs.current[nextIndex]?.focus()
  }

  const handleContinue = async () => {
    const code = otp.join("")
    if (code.length !== 6) {
      toast.error("Please enter the complete 6-digit code.")
      return
    }

    if (!email || !purpose) {
      toast.error("Required data not found. Please go back to signup.")
      return
    }

    setIsLoading(true)
    try {
      const response = await post("auth/verify-otp", {
        email,
        purpose,
        otp: code,
      })
      console.log("otpp========================>", response.data)

      if (response.data.success === true) {
        toast.success("Verification successful!")
        dispatch(resetSignup())
        try {
          if (purpose === "registration") {
            const query = new URLSearchParams({
              email,
              purpose,
              name: name || "",
              verificationToken: encodeURIComponent(response.data.data.verificationToken),
              password: password || "",
            }).toString()
            router.push(`/screens/number?${query}`)
          } else if (purpose === "password-reset") {
            const query = new URLSearchParams({
              email,
              verificationToken: encodeURIComponent(response.data.data.verificationToken),
            }).toString()
            router.push(`/screens/resetPassword?${query}`)
          } else {
            toast.error("Invalid purpose. Please try again.")
          }
        } catch (navError) {
          toast.error("Failed to navigate to the next screen. Please try again.")
        }
      } else {
        const errorMsg = response.data.message || "Verification failed. Please try again."
        toast.error(errorMsg)
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "An error occurred during verification."
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!email || !purpose) {
      toast.error("Required data not found. Please try again.")
      return
    }

    setIsResending(true)

    try {
      let response

      if (purpose === "registration") {
        response = await post("auth/send-verification-otp", {
          email,
          purpose: purpose || "registration",
          name: name || "",
        })
      } else if (purpose === "password-reset") {
        response = await post("auth/send-verification-otp", {
          email,
          purpose: purpose || "password-reset",
        })
      } else {
        toast.error("Invalid purpose. Please try again.")
        return
      }

      if (response.data.success === true) {
        toast.success("A new verification code has been sent to your email.")

        // Clear the OTP inputs and focus on first input
        setOtp(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus()

        // Start 60-second countdown
        setCountdown(60)
      } else {
        const errorMsg = response.data.message || "Failed to send verification code. Please try again."
        toast.error(errorMsg)
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to send verification code. Please try again."
      toast.error(errorMsg)
    } finally {
      setIsResending(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && otp.every((digit) => digit !== "")) {
      handleContinue()
    }
  }

  const isComplete = otp.every((digit) => digit !== "")
  const canResend = countdown === 0 && !isResending

  return (
    <div className="min-h-screen bg-[#E8F6F2] font-body flex items-center justify-center px-4">
      <ToastContainer
        position="top-right"
        hideProgressBar={false}
        autoClose={5000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="absolute top-8 left-8">
        <h1 className="text-2xl font-bold">
          <span className="text-[#1F5546]">ASRA</span> <span className="text-[#EAB308]">Chauffeur</span>
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8 w-full max-w-md">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#1F5546] mb-4">Enter Authentication Code</h2>
          <p className="text-black leading-relaxed">
            Enter the 6-digit code we just sent to {email || "your email address"}.
          </p>
          {sendOtp && <p className="text-[red] mt-2">{sendOtp}</p>}
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#1F5546] mb-4">Verification Code</label>
            <div className="flex gap-3 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onKeyPress={handleKeyPress}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F5546] focus:border-[#1F5546] outline-none transition-colors bg-white"
                />
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleResendCode}
              disabled={!canResend}
              className={`text-sm transition-colors flex items-center justify-center mx-auto ${
                canResend ? "text-[#1F5546] hover:text-[#2a7a5e] cursor-pointer" : "text-gray-400 cursor-not-allowed"
              }`}
            >
              {isResending ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 mr-2"
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
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                    ></path>
                  </svg>
                  Sending...
                </>
              ) : countdown > 0 ? (
                `Resend OTP in ${countdown}s`
              ) : (
                "Didn't receive the code? Resend OTP"
              )}
            </button>
          </div>

          <button
            onClick={handleContinue}
            disabled={!isComplete || isLoading}
            className={`w-full py-3 px-4 rounded-lg transition-colors font-medium flex items-center justify-center ${
              isComplete && !isLoading
                ? "bg-[#1F5546] hover:bg-[#2a7a5e] text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                  ></path>
                </svg>
                Verifying...
              </>
            ) : (
              "Continue"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthenticationCode
