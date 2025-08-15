"use client";
import React, { useState } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { MdLocationPin } from "react-icons/md";
import Image from 'next/image';
import ride from "@/public/images/ride.png";

const ActiveRide = () => {
  const [showModal, setShowModal] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showInfoWindow, setShowInfoWindow] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCt1aq0GevUtpMApMtlnOt6AjeW8mamUCw",
  });

  // Map configuration
  const mapContainerStyle = {
    width: '100%',
    height: '100%',
  };

  const center = {
    lat: 38.9072,
    lng: -77.0369,
  };

  const currentLocation = {
    lat: 38.9072,
    lng: -77.0369,
  };

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    styles: [
      {
        "featureType": "all",
        "elementType": "geometry.fill",
        "stylers": [{ "weight": "2.00" }]
      },
      {
        "featureType": "all",
        "elementType": "geometry.stroke",
        "stylers": [{ "color": "#9c9c9c" }]
      },
      {
        "featureType": "all",
        "elementType": "labels.text",
        "stylers": [{ "visibility": "on" }]
      },
      {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [{ "color": "#f2f2f2" }]
      },
      {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [{ "color": "#ffffff" }]
      },
      {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [{ "color": "#ffffff" }]
      },
      {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [{ "visibility": "off" }]
      },
      {
        "featureType": "road",
        "elementType": "all",
        "stylers": [{ "saturation": -100 }, { "lightness": 45 }]
      },
      {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [{ "color": "#eeeeee" }]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#7b7b7b" }]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#ffffff" }]
      },
      {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [{ "visibility": "simplified" }]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [{ "visibility": "off" }]
      },
      {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [{ "visibility": "off" }]
      },
      {
        "featureType": "water",
        "elementType": "all",
        "stylers": [{ "color": "#46bcec" }, { "visibility": "on" }]
      },
      {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [{ "color": "#c8d7d4" }]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#070707" }]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#ffffff" }]
      }
    ]
  };

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-screen">Loading map...</div>;
  }

  const handleRateUsClick = () => {
    setShowModal(false);
    setShowRatingModal(true);
  };

  const handleStarClick = (star) => {
    setRating(star);
  };

  const handleSubmitRating = () => {
    // Handle rating submission (e.g., send to backend)
    console.log("Rating:", rating, "Comment:", comment);
    setShowRatingModal(false);
  };

  return (
    <div className="relative h-screen bg-sky-50 p-6 overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-sky-50 z-30 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-800">Active Ride</h1>
        </div>
      </div>

      {/* Google Map */}
      <div className="absolute inset-0 bg-white py-24 px-10 z-20">
        <div className="mb-7">
          <div className="flex justify-between items-center">
            <p className="text-black font-semibold text-lg">Your current location</p>
            <p className="text-[#18173C] text-sm">See on map</p>
          </div>
          <div className="flex items-center gap-2">
            <MdLocationPin className="text-[#1F5546] text-2xl" />
            <div>
              <p className="text-black text-lg">18th Avenue</p>
              <p className="text-gray-500 text-sm">637 Superior Trail</p>
            </div>
          </div>
        </div>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={15}
          options={mapOptions}
        >
          <Marker
            position={currentLocation}
            icon={{
              url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23ef4444'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Ccircle cx='12' cy='12' r='6' fill='white'/%3E%3Ccircle cx='12' cy='12' r='2' fill='%23ef4444'/%3E%3C/svg%3E",
              scaledSize: new window.google.maps.Size(24, 24)
            }}
            onClick={() => setShowInfoWindow(true)}
          />
          {showInfoWindow && (
            <InfoWindow
              position={currentLocation}
              onCloseClick={() => setShowInfoWindow(false)}
            >
              <div className="p-2">
                <div className="font-medium text-sm mb-1">Your current location</div>
                <div className="text-gray-600 text-xs">1301 Avenue</div>
                <div className="text-gray-600 text-xs">6517 Superior Trail</div>
                <div className="text-blue-600 text-xs mt-1 cursor-pointer">See on map</div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="mb-6">
              <div className="relative mx-auto w-24 h-24 mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image src={ride} alt="ride" width={130} height={130} />
                </div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Your Ride is Successfully Completed
            </h3>
            <button
              onClick={handleRateUsClick}
              className="bg-[#1F5546] hover:bg-teal-800 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
            >
              Rate us
            </button>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center relative">
            <button
              onClick={() => setShowRatingModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Rate Your Ride</h3>
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Leave a comment..."
              className="w-full p-2 border rounded-md mb-4 resize-none"
              rows="4"
            />
            <button
              onClick={handleSubmitRating}
              className="bg-[#1F5546] hover:bg-teal-800 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
            >
              Submit Rating
            </button>
          </div>
        </div>
      )}

      {/* Active Ride Card */}
      <div className="absolute bottom-6 right-6 bg-[#1F5546] text-white rounded-lg p-4 w-64 shadow-lg z-20">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Active Ride</h3>
          <span className="text-2xl font-bold">$20</span>
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-sm">On route</span>
        </div>
        <div className="flex items-center space-x-2 mb-3">
          <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span className="text-sm">23 mins to</span>
        </div>
        <div className="text-xs text-gray-200 mb-3">
          <div>Time to reach</div>
          <div>Estimated: 19.6 km</div>
        </div>
        <button className="w-full bg-white text-[#1F5546] py-2 px-4 rounded text-sm font-medium transition-colors duration-200">
          Track Ride
        </button>
      </div>
    </div>
  );
};

export default ActiveRide;