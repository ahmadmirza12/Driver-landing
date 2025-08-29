"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { MdArrowForward, MdLogin, MdEventAvailable } from "react-icons/md";

export const Navbar = () => {
  const state = useSelector((state) => state.authConfigs);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBookNow = () => {
    router.push("http://localhost:3001/screens/signup", "_blank");
  };

  // Sidebar animation variants
  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    closed: {
      x: "100%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  // Menu items animation variants
  const menuItemVariants = {
    open: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    closed: {
      opacity: 0,
      y: 20,
      x: 20,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  // Backdrop animation
  const backdropVariants = {
    open: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    closed: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  // Logo animation
  const logoVariants = {
    hover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 25 },
    },
  };

  // Link button animation
  const linkButtonVariants = {
    hover: {
      scale: 1.05,
      y: -2,
      transition: { type: "spring", stiffness: 400, damping: 25 },
    },
    tap: {
      scale: 0.95,
      transition: { type: "spring", stiffness: 400, damping: 25 },
    },
  };

  // Hamburger line animations
  const line1Variants = {
    closed: { rotate: 0, y: 0 },
    open: { rotate: 45, y: 8 },
  };

  const line2Variants = {
    closed: { opacity: 1 },
    open: { opacity: 0 },
  };

  const line3Variants = {
    closed: { rotate: 0, y: 0 },
    open: { rotate: -45, y: -8 },
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-40 font-body text-white px-4 py-4 transition-all duration-300 ${
          scrolled
            ? "bg-[#1F5546]/95 backdrop-blur-md shadow-2xl"
            : "bg-[#1F5546]"
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center cursor-pointer"
            variants={logoVariants}
            whileHover="hover"
          >
            <div className="relative">
              <motion.h1
                className="text-xl md:text-2xl font-bold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-white">ASRA</span>{" "}
                <span className="text-[#EAB308] relative">
                  Chauffeur
                  <motion.div
                    className="absolute -bottom-1 left-0 h-0.5 bg-[#EAB308]"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  />
                </span>
              </motion.h1>
            </div>
          </motion.div>

          {/* Desktop Menu */}
          <motion.div
            className="hidden md:flex items-center space-x-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, staggerChildren: 0.1 }}
          >
            {["Services", "Our Fleet", "About Us"].map((item, index) => (
              <motion.a
                key={item}
                href="#"
                className="relative hover:text-[#EAB308] transition-colors group"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                {item}
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5 bg-[#EAB308] origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}

            {/* Book Now Link Button */}
            <motion.a
              href="http://localhost:3001/screens/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#EAB308] transition-colors relative group font-medium px-4 py-2 rounded-lg hover:bg-white/5"
              variants={linkButtonVariants}
              whileHover="hover"
              whileTap="tap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <motion.div
                  className="w-5 h-5 text-[#EAB308] opacity-80 group-hover:opacity-100"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <MdEventAvailable size={20} />
                </motion.div>
                Book Now
                <motion.div
                  className="transform transition-transform group-hover:translate-x-1"
                  whileHover={{ x: 3 }}
                >
                </motion.div>
              </span>
              <motion.div
                className="absolute -bottom-1 left-4 right-4 h-0.5 bg-[#EAB308] origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>

            {/* Login Link Button */}
            <motion.a
              href="http://localhost:3001/screens/login"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#EAB308] transition-colors relative group font-medium px-4 py-2 rounded-lg hover:bg-white/5"
              variants={linkButtonVariants}
              whileHover="hover"
              whileTap="tap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <motion.div
                  className="w-5 h-5 text-[#EAB308] opacity-80 group-hover:opacity-100"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <MdLogin size={20} />
                </motion.div>
                Login
                <motion.div
                  className="transform transition-transform group-hover:translate-x-1"
                  whileHover={{ x: 3 }}
                >
                </motion.div>
              </span>
              <motion.div
                className="absolute -bottom-1 left-4 right-4 h-0.5 bg-[#EAB308] origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          </motion.div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <motion.button
              onClick={toggleSidebar}
              className="text-white focus:outline-none p-2 rounded-lg relative"
              aria-label="Toggle menu"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="w-6 h-6 relative">
                <motion.span
                  className="absolute top-0 left-0 w-full h-0.5 bg-white rounded-full"
                  variants={line1Variants}
                  animate={isOpen ? "open" : "closed"}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="absolute top-3 left-0 w-full h-0.5 bg-white rounded-full"
                  variants={line2Variants}
                  animate={isOpen ? "open" : "closed"}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="absolute top-6 left-0 w-full h-0.5 bg-white rounded-full"
                  variants={line3Variants}
                  animate={isOpen ? "open" : "closed"}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden fixed top-0 right-0 h-full w-80 bg-gradient-to-br from-[#1F5546] to-[#2A6B5B] z-50 shadow-2xl"
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="flex justify-between items-center p-6 border-b border-white/10">
                <motion.h2
                  className="text-xl font-bold text-white"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Menu
                </motion.h2>
                <motion.button
                  onClick={toggleSidebar}
                  className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </div>

              {/* Menu Items */}
              <div className="flex-1 flex flex-col justify-center items-center space-y-8 p-6">
                {["Services", "Our Fleet", "About Us"].map((item, index) => (
                  <motion.a
                    key={item}
                    href="#"
                    className="text-white hover:text-[#EAB308] transition-colors text-xl font-medium relative group"
                    variants={menuItemVariants}
                    onClick={toggleSidebar}
                    whileHover={{ scale: 1.05, x: 10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-[#EAB308] rounded-full opacity-0 group-hover:opacity-100"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    {item}
                  </motion.a>
                ))}

                {/* Mobile Link Buttons */}
                <div className="mt-8 space-y-4 w-full max-w-xs">
                  {/* Book Now Link Button */}
                  <motion.a
                    href="http://localhost:3001/screens/signup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center text-white hover:text-[#EAB308] border border-white/30 hover:border-[#EAB308]/50 px-6 py-4 rounded-xl font-medium group relative overflow-hidden w-full transition-all duration-300"
                    variants={menuItemVariants}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={toggleSidebar}
                  >
                    <motion.div className="absolute inset-0 bg-[#EAB308]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="flex items-center gap-3 relative z-10">
                      <motion.div 
                        className="w-8 h-8 bg-[#EAB308]/10 border border-[#EAB308]/30 rounded-lg flex items-center justify-center group-hover:bg-[#EAB308]/20"
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <MdEventAvailable size={18} className="text-[#EAB308]" />
                      </motion.div>
                      <span className="font-medium">Book Now</span>
                      <motion.div
                        whileHover={{ x: 3 }}
                        className="ml-auto"
                      >
                      </motion.div>
                    </div>
                  </motion.a>

                  {/* Login Link Button */}
                  <motion.a
                    href="http://localhost:3001/screens/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center text-white hover:text-[#EAB308] border border-white/30 hover:border-[#EAB308]/50 px-6 py-4 rounded-xl font-medium group relative overflow-hidden w-full transition-all duration-300"
                    variants={menuItemVariants}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={toggleSidebar}
                  >
                    <motion.div className="absolute inset-0 bg-[#EAB308]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="flex items-center gap-3 relative z-10">
                      <motion.div 
                        className="w-8 h-8 bg-[#EAB308]/10 border border-[#EAB308]/30 rounded-lg flex items-center justify-center group-hover:bg-[#EAB308]/20"
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <MdLogin size={18} className="text-[#EAB308]" />
                      </motion.div>
                      <span className="font-medium">Login</span>
                      <motion.div
                        whileHover={{ x: 3 }}
                        className="ml-auto"
                      >
                      </motion.div>
                    </div>
                  </motion.a>
                </div>
              </div>

              {/* Decorative Elements */}
              <motion.div
                className="absolute top-20 right-6 w-20 h-20 border border-[#EAB308]/20 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute bottom-20 left-6 w-12 h-12 border border-[#EAB308]/30 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};