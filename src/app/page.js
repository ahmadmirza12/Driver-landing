import { Navbar } from "@/components/navbar";
import Image from "next/image";
import React from "react";
import line from "../public/images/line.png";
import girl from "../public/images/girl1.png";
import clock from "../public/images/clock.png";
import plane from "../public/images/plane.png";
import location from "../public/images/location.png";
import profile from "../public/images/profile.png";
import bag from "../public/images/bag.png";
import water from "../public/images/water.png";
import tri from "../public/images/tri.png";
import taxi from "../public/images/taxi.png";
import { Heart, Users, MapPin, Calendar, Navigation } from 'lucide-react';
import TestimonialsSection from "@/components/testimonials";
import BookingForm from "@/components/form";
import Footer from "@/components/footer";

const vehicles = [
  {
    title: "Executive Sedan",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&crop=center",
    desc: "e.g., Toyota Camry, Honda Accord",
  },
  {
    title: "Premium MPV",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop&crop=center",
    desc: "e.g., Toyota Vellfire, Alphard",
  },
  {
    title: "Luxury Sedan",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop&crop=center",
    desc: "e.g., Mercedes E-Class, S-Class",
  },
];

const features = [
  {
    title: "Choose Destination",
    description:
      "Select your pickup and drop-off locations with our easy-to-use booking system",
    icon: tri,
    color: "bg-amber-500", // Replaces #F0BB1F
  },
  {
    title: "Make Payment",
    description:
      "Secure payment options with transparent pricing and no hidden fees",
    icon: water,
    color: "bg-orange-500", // Replaces #F15A2B
  },
  {
    title: "Reach Airport in Comforted Vehicle",
    description:
      "Travel in comfort with our premium fleet and professional chauffeurs",
    icon: taxi,
    color: "bg-teal-700", // Replaces #006380
  },
];
const Landingpage = () => {
  return (
    <div className="min-h-screen font-body">
      <Navbar />
      
      {/* Hero Section - Stack on mobile/tablet, side-by-side on desktop */}
      <div className="flex flex-col lg:flex-row justify-between items-center py-6 lg:py-0">
        {/* Left side content - Center on mobile/tablet with increased width */}
        <div className="w-full lg:w-1/2 mb-8 lg:mb-0 px-6 sm:px-8 lg:pl-10 text-center lg:text-left z-10">
          <p className="text-yellow-600 text-sm font-medium mb-4 tracking-wide">
            LUXURY VEHICLE INTERIOR
          </p>

          <div className="mb-1 relative">
            <p className="text-gray-900 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Unmatch
            </p>
            <Image
              src={line}
              alt="Decorative line"
              className="w-[160px] sm:w-[200px] md:w-[280px] lg:w-[385px] h-[6px] sm:h-[8px] md:h-[10px] lg:h-[12px] absolute left-1/2 transform -translate-x-1/2 lg:left-32 lg:transform-none"
            />
          </div>

          <p className="text-gray-900 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-1">
            Professional
          </p>

          <p className="text-gray-900 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            Chauffeur Service
          </p>

          <div className="mb-6 lg:mb-8">
            <p className="text-gray-600 text-base leading-relaxed max-w-lg sm:max-w-xl lg:max-w-lg mx-auto lg:mx-0">
              Experience seamless, premium transportation across Malaysia. For
              business or leisure, ASRA delivers excellence in every journey
            </p>
          </div>

          <div>
            <button className="bg-[#1F5546] hover:bg-[#164139] text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-medium transition-colors text-base">
              Book Now
            </button>
          </div>
        </div>

        {/* Right side - Images - Hidden on small screens, visible on large screens */}
        <div className="hidden lg:flex w-full lg:w-1/2 relative justify-center lg:justify-end">
          <Image
            src={girl}
            alt="Person with suitcase"
            className="max-w-full h-auto"
          />
        </div>
      </div>

      {/* CATEGORY */}
      <div className="px-4 sm:px-6 md:px-10 lg:px-20 py-8 lg:py-12">
        <p className="text-yellow-600 text-sm font-medium mb-4 tracking-wide text-center">
          CATEGORY
        </p>
        <p className="text-gray-900 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-center mb-8 lg:mb-10">
          We Offer Best Services
        </p>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {/* Card 1 */}
          <div className="border border-[#E7E7E7EE] rounded-2xl p-6 lg:p-8 flex flex-col items-center text-center">
            <div className="mb-4">
              <Image src={clock} alt="Clock icon" className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-xl lg:text-2xl text-gray-900 font-bold mb-3">
              Hourly & Daily Charter
            </h3>
            <p className="text-base text-gray-600 font-medium leading-relaxed">
              Your personal chauffeur on-demand for business meetings, events,
              or city tours.
            </p>
          </div>

          {/* Card 2 - Featured */}
          <div className="border border-[#E7E7E7EE] bg-[#1F5546] rounded-2xl p-6 lg:p-8 flex flex-col items-center text-center">
            <div className="mb-4">
              <Image src={plane} alt="Plane icon" className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-xl lg:text-2xl text-white font-bold mb-3">
              Airport Transfers
            </h3>
            <p className="text-base text-[#D5D6DB] font-medium leading-relaxed">
              Punctual and stress-free pickups and drop-offs for KLIA, KLIA2,
              and Subang Airport.
            </p>
          </div>

          {/* Card 3 */}
          <div className="border border-[#E7E7E7EE] rounded-2xl p-6 lg:p-8 flex flex-col items-center text-center md:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <Image
                src={location}
                alt="Location icon"
                className="w-12 h-12 mx-auto"
              />
            </div>
            <h3 className="text-xl lg:text-2xl text-gray-900 font-bold mb-3">
              Point-to-Point
            </h3>
            <p className="text-base text-gray-600 font-medium leading-relaxed">
              Efficient and comfortable travel between any two locations of your
              choice.
            </p>
          </div>
        </div>
      </div>

      {/* FLEET SECTION */}
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-yellow-600 font-medium mb-4 text-sm tracking-wide">
              LUXURY FLEET
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              Our Executive Fleet
            </h2>
          </div>

          {/* Fleet Cards - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {vehicles.map((vehicle, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${
                  index === 2 ? 'sm:col-span-2 sm:max-w-md sm:mx-auto lg:col-span-1 lg:max-w-full' : ''
                }`}
              >
                <div className="relative bg-gray-200 h-64">
                  <img
                    src={vehicle.image}
                    alt={`${vehicle.title} vehicle`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                    {vehicle.title}
                  </h3>
                  <p className="text-base text-gray-600 mb-4">{vehicle.desc}</p>
                  <div className="flex items-center mb-4">
                    <Image
                      src={profile}
                      alt="Passenger icon"
                      className="w-6 h-6 mr-2"
                    />
                    <p className="text-base text-gray-600">4 Passengers</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Image src={bag} alt="Luggage icon" className="w-6 h-6 mr-2" />
                    <p className="text-base text-gray-600">2-3 Luggage</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

{/* ABOUT */}
<div className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-white">
  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
      <div>
        <div className="text-[#5E6282] font-medium mb-4 text-xs sm:text-sm tracking-wide">
          FAST & EASY
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 sm:mb-8">
          About ASRA
        </h2>
        <p className="text-[#A5A5A5] mb-8 sm:mb-12 text-sm sm:text-lg leading-relaxed">
          {"ASRA was founded on the principle of providing Malaysia's most reliable and professional chauffeur services. Our commitment to excellence is unwavering."}
        </p>
        <div className="space-y-6 sm:space-y-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-4 sm:space-x-6">
              <div
                className={`${feature.color} rounded-xl p-3 sm:p-4 flex-shrink-0`} // Use predefined Tailwind class
              >
                <Image
                  src={feature.icon}
                  alt={`${feature.title} icon`}
                  className="w-6 h-6 sm:w-8 sm:h-8"
                />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="max-w-sm sm:max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Car Image */}
          <div className="relative">
            <div className="p-2 sm:p-4 rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=200&fit=crop&crop=center"
                alt="Red SUV Car"
                className="w-full h-40 sm:h-48 object-cover rounded-2xl"
              />
            </div>
          </div>

          {/* Card Content */}
          <div className="p-2 sm:p-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Rider</h2>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 text-xs sm:text-sm">14-29 June |</span>
                <span className="text-gray-500 text-xs sm:text-sm">by Robbin j</span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </div>
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </div>
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <span className="text-gray-500 text-xs sm:text-sm">24 people going</span>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-red-500" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg absolute top-40 sm:top-48 lg:top-56 right-0 px-6 sm:px-8 py-2 sm:py-3 w-48 sm:w-56">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <img 
              src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=200&fit=crop&crop=center"
              alt="car"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-xs text-black">ongoing</p>
              <p className="text-xs text-gray-500">Booking</p>
            </div>
          </div>
          <div className="mt-2 sm:mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs sm:text-sm text-gray-700">40% completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
              <div className="bg-green-600 h-1.5 sm:h-2 rounded-full w-2/5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* TESTIMONIAL */}
      <TestimonialsSection/>
      {/* FORM */}
      <BookingForm/>
      {/* FOOTER */}
      <Footer/>
    </div>
  );
};

export default Landingpage;