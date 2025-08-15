"use client";
import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Mike Taylor",
      location: "Lahore, Pakistan",
      text: "On the Windows talking painted pasture yet its express parties use. Sure last upon he same as knew next.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      color: "border-blue-500"
    },
    {
      id: 2,
      name: "Chris Thomas",
      role: "CTO of Red Button",
      text: "Excellent service and outstanding results. The team delivered exactly what we needed on time and within budget.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      color: "border-red-500"
    },
    {
      id: 3,
      name: "Sarah Wilson",
      role: "Product Manager",
      text: "Outstanding work quality and professional service. Highly recommended for any business looking to grow.",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
      color: "border-green-500"
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getNextIndex = () => (currentIndex + 1) % testimonials.length;

  // Animation variants for the testimonial cards
  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: 45 },
    visible: { opacity: 1, y: 0, rotateX: 0 },
    exit: { opacity: 0, y: -50, rotateX: -45 }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-16">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-16 items-start">
        {/* Left Column - Header */}
        <div className="w-full lg:w-1/2">
          <p className="text-xs sm:text-sm font-medium text-gray-500 tracking-wider uppercase mb-3 sm:mb-4">
            TESTIMONIALS
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6 lg:mb-12">
            What People Say<br />About Us.
          </h2>
          
          {/* Pagination dots */}
          <div className="flex space-x-2 sm:space-x-3">
            {testimonials.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Column - Testimonial Cards */}
        <div className="w-full lg:w-1/2 flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 items-center md:justify-center lg:justify-start">
          <div className="relative w-full sm:w-[18rem] md:w-[22rem] lg:w-[24rem] h-[260px] sm:h-[300px] md:h-[340px] lg:h-[360px]">
            {/* Background card (next testimonial) */}
            <div className="absolute top-3 sm:top-4 md:top-6 left-3 sm:left-4 md:left-6 lg:left-8 w-full sm:w-[18rem] md:w-[22rem] lg:w-[24rem] bg-white rounded-2xl shadow-sm p-3 sm:p-4 md:p-6 border border-gray-100 opacity-40 z-0">
              <div className="relative">
                <div className="absolute -top-4 sm:-top-6 md:-top-8 -left-4 sm:-left-6 md:-left-8 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src={testimonials[getNextIndex()].avatar}
                    alt={testimonials[getNextIndex()].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="pt-4 sm:pt-6 md:pt-8 pl-4 sm:pl-6 md:pl-8">
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                    {testimonials[getNextIndex()].text}
                  </p>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-xs sm:text-sm">{testimonials[getNextIndex()].name}</h4>
                    <p className="text-gray-500 text-[10px] sm:text-xs">
                      {testimonials[getNextIndex()].location || testimonials[getNextIndex()].role}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main testimonial card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="relative z-10 w-full sm:w-[18rem] md:w-[22rem] lg:w-[24rem] bg-white rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 border border-gray-100"
              >
                <div className="relative">
                  <div className="absolute -top-4 sm:-top-6 md:-top-8 -left-4 sm:-left-6 md:-left-8 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full overflow-hidden flex-shrink-0">
                    <img 
                      src={testimonials[currentIndex].avatar}
                      alt={testimonials[currentIndex].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="pt-4 sm:pt-6 md:pt-8 pl-4 sm:pl-6 md:pl-8">
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                      {testimonials[currentIndex].text}
                    </p>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm">{testimonials[currentIndex].name}</h4>
                      <p className="text-gray-500 text-[10px] sm:text-xs">
                        {testimonials[currentIndex].location || testimonials[currentIndex].role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation arrows */}
          <div className="flex sm:flex-col justify-center sm:justify-start space-x-3 sm:space-x-0 sm:space-y-2 md:space-y-4 sm:ml-2 md:ml-6 lg:ml-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={prevTestimonial}
              className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 border-2 border-gray-200 hover:border-[#EAB308] bg-white rounded-full flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Previous testimonial"
            >
              <ChevronUp className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-600" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextTestimonial}
              className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 border-2 border-gray-200 hover:border-[#EAB308] bg-white rounded-full flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Next testimonial"
            >
              <ChevronDown className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-600" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}