"use client";

import React, { useState, memo } from "react";
import { Search, Clock, Navigation, MapPin, ChevronDown } from "lucide-react";
import Input from "@mui/material/Input";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import dynamic from "next/dynamic";
import CaroptionList from "./utils/CarOption"; // Import the car list component
import PaymentModal from "./Paymentmodal"; // Import the payment modal
import PaymentSuccess from "./PaymentSuccess"; // Import the success component
import "../app/globals.css";

// ✅ Correctly load only once using apiKey prop
const MemoizedGooglePlacesAutocomplete = memo(
  dynamic(() => import("react-google-places-autocomplete"), { ssr: false })
);

const SearchSection = ({
  setPickupCoordinates,
  setDestinationCoordinates,
  setMapCenter,
  handleSearchClick,
  clearSearch,
  setZoom,
  setMarkersVisible,
  isGoogleMapsLoaded,
  setSearchQuery,
  priceRange = [0, 100],
  setPriceRange,
}) => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupCoordinatesState, setPickupCoordinatesState] = useState({ lat: 0, lng: 0 });
  const [destinationCoordinatesState, setDestinationCoordinatesState] = useState({ lat: 0, lng: 0 });
  const [recentSearches, setRecentSearches] = useState([
    { id: 1, pickup: "Manhattan, NY", destination: "JFK Airport", type: "Taxi" },
    { id: 2, pickup: "Brooklyn Bridge", destination: "Times Square", type: "Package" },
    { id: 3, pickup: "Central Park", destination: "Newark Airport", type: "Delivery" },
  ]);
  const [activeSearchId, setActiveSearchId] = useState(null);
  const [nextId, setNextId] = useState(recentSearches.length + 1);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  
  // New states for car selection
  const [selectedCar, setSelectedCar] = useState(null);
  const [distance, setDistance] = useState(0);
  const [showCarList, setShowCarList] = useState(false);

  // Payment related states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const isBrowser = typeof window !== "undefined";


  const handleSearchButtonClick = () => {
    if (pickup && destination) {
      const pickupLat = pickupCoordinatesState.lat || 0;
      const pickupLng = pickupCoordinatesState.lng || 0;
      const destinationLat = destinationCoordinatesState.lat || 0;
      const destinationLng = destinationCoordinatesState.lng || 0;

      if (!isNaN(pickupLat) && !isNaN(pickupLng) && !isNaN(destinationLat) && !isNaN(destinationLng)) {
        const newSearch = { id: nextId, pickup, destination, type: "Custom" };
        setRecentSearches((prev) => [newSearch, ...prev.slice(0, 4)]);
        setNextId(nextId + 1);
        const lat = (pickupLat + destinationLat) / 2;
        const lng = (pickupLng + destinationLng) / 2;
        setMapCenter?.({ lat, lng });

        if (
          window.google &&
          google.maps.geometry &&
          google.maps.geometry.spherical
        ) {
          const calculatedDistance = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(pickupLat, pickupLng),
            new google.maps.LatLng(destinationLat, destinationLng)
          );
          setDistance(calculatedDistance);
          const zoomLevel = calculatedDistance > 50000 ? 10 : calculatedDistance > 20000 ? 12 : 14;
          setZoom?.(zoomLevel);
        }

        setMarkersVisible?.(true);
        setShowCarList(true); // Show car list after successful search
      } else {
        console.error("Invalid coordinates");
      }
    } else {
      clearSearch?.();
      setMarkersVisible?.(false);
      setMapCenter?.({ lat: 20.5937, lng: 78.9629 });
      setZoom?.(5);
      setDistance(0);
      setShowCarList(false);
    }
  };

  const OnSearchButtonClick = () => {
    handleSearchClick?.();
    handleSearchButtonClick();
  };

  const handleClear = (type) => {
    if (type === "pickup") {
      setPickup("");
      setPickupCoordinates?.(null);
      setPickupCoordinatesState({ lat: 0, lng: 0 });
    } else if (type === "destination") {
      setDestination("");
      setDestinationCoordinates?.(null);
      setDestinationCoordinatesState({ lat: 0, lng: 0 });
    }
    if ((type === "pickup" && !destination) || (type === "destination" && !pickup)) {
      clearSearch?.();
      setMarkersVisible?.(false);
      setDistance(0);
      setShowCarList(false);
    }
  };

  const handlePlaceSelect = (selected, type) => {
    if (!isGoogleMapsLoaded) return;
    const address = selected?.label || "";
    if (!address) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results.length > 0) {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        if (type === "pickup") {
          setPickupCoordinatesState({ lat, lng });
          setPickupCoordinates?.({ lat, lng });
        } else if (type === "destination") {
          setDestinationCoordinatesState({ lat, lng });
          setDestinationCoordinates?.({ lat, lng });
        }
      } else {
        console.error("Geocode error: ", status);
      }
    });
  };

  const handleCarSelect = (car) => {
    setSelectedCar(car);
    console.log("Selected car:", car);
  };

  // Handle book now button click
  const handleBookNow = () => {
    if (selectedCar && pickup && destination) {
      setShowPaymentModal(true);
    }
  };

  // Handle payment success
  const handlePaymentSuccess = (details) => {
    setPaymentDetails(details);
    setShowPaymentModal(false);
    setShowPaymentSuccess(true);
    
    // Clear the search and selections
    setSelectedCar(null);
    setShowCarList(false);
    
    console.log("Payment successful:", details);
  };

  // Handle close payment success
  const handleClosePaymentSuccess = () => {
    setShowPaymentSuccess(false);
    setPaymentDetails(null);
    
    // Reset all states to initial
    setPickup("");
    setDestination("");
    setPickupCoordinatesState({ lat: 0, lng: 0 });
    setDestinationCoordinatesState({ lat: 0, lng: 0 });
    setDistance(0);
    clearSearch?.();
    setMarkersVisible?.(false);
  };

  // Handle track ride
  const handleTrackRide = () => {
    setShowPaymentSuccess(false);
    // Navigate to tracking page or show tracking modal
    console.log("Tracking ride...");
    // You can implement ride tracking logic here
  };

  return (
    <>
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);
          }
          50% {
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.6), 0 0 30px rgba(168, 85, 247, 0.4);
          }
        }

        .animate-slideInUp {
          animation: slideInUp 0.5s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-pulseGlow {
          animation: pulseGlow 2s infinite;
        }

        .glass-effect {
          background: rgba(17, 24, 39, 0.7);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(75, 85, 99, 0.3);
        }

        .input-glass {
          background: rgba(55, 65, 81, 0.4);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(75, 85, 99, 0.2);
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
        }

        .input-glass:hover {
          background: rgba(55, 65, 81, 0.6);
          border-color: rgba(168, 85, 247, 0.3);
        }

        .input-glass:focus-within {
          background: rgba(55, 65, 81, 0.7);
          border-color: rgba(168, 85, 247, 0.5);
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
          z-index: 1000;
        }

        /* Ensure dropdown containers have proper z-index */
        .dropdown-container {
          position: relative;
          z-index: 100;
        }

        .dropdown-container.active {
          z-index: 1000;
        }

        /* Recent searches dropdown */
        .recent-searches-dropdown {
          position: relative;
          z-index: 50;
        }

        /* Car list container */
        .car-list-container {
          position: relative;
          z-index: 40;
        }

        /* Payment modals */
        .payment-modal {
          z-index: 2000;
        }

        /* Google Places specific z-index fixes */
        .react-select-container {
          position: relative;
          z-index: 100;
        }

        .react-select-container .react-select__menu {
          z-index: 1000 !important;
        }

        /* Override any conflicting z-index */
        .react-select__menu-portal {
          z-index: 1000 !important;
        }
      `}</style>

      <div className="w-full max-w-md mt-28 mx-auto p-4 bg-black/95 rounded-3xl shadow-2xl overflow-y-auto max-h-screen border border-gray-800/50 animate-slideInUp">
        
        {/* Get Ride Section */}
        <div className="mb-6 glass-effect rounded-3xl p-6 animate-fadeIn">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Get Ride
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mt-2 animate-pulseGlow"></div>
          </div>
          
          <div className="space-y-4">
            {/* Pickup Input */}
            <div className="relative group dropdown-container">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 transition-colors duration-300 group-hover:text-purple-300">
                <MapPin className="w-5 h-5 text-purple-400" />
              </div>
              <div className="input-glass rounded-2xl">
                <MemoizedGooglePlacesAutocomplete
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
                  selectProps={{
                    value: pickup ? { label: pickup, value: pickup } : null,
                    onChange: (selected) => {
                      setPickup(selected?.label || "");
                      handlePlaceSelect(selected, "pickup");
                    },
                    onClear: () => handleClear("pickup"),
                    placeholder: "Enter pickup location",
                    isClearable: true,
                    className: "react-select-container",
                    classNamePrefix: "react-select",
                    menuPortalTarget:isBrowser ? document.body : null,
                    menuPosition: "fixed",
                    components: { 
                      DropdownIndicator: () => null,
                      IndicatorSeparator: () => null 
                    },
                    styles: {
                      control: (provided, state) => ({
                        ...provided,
                        backgroundColor: 'transparent',
                        border: 'none',
                        paddingLeft: '2.5rem',
                        paddingRight: '1rem',
                        paddingTop: '1rem',
                        paddingBottom: '1rem',
                        color: 'white',
                        fontSize: '16px',
                        boxShadow: 'none',
                        minHeight: '56px',
                        '&:hover': {
                          border: 'none'
                        }
                      }),
                      input: (provided) => ({
                        ...provided,
                        color: 'white',
                        margin: 0,
                        padding: 0
                      }),
                      placeholder: (provided) => ({
                        ...provided,
                        color: '#9CA3AF',
                        fontSize: '16px'
                      }),
                      singleValue: (provided) => ({
                        ...provided,
                        color: 'white'
                      }),
                      menu: (provided) => ({
                        ...provided,
                        backgroundColor: 'rgba(17, 24, 39, 0.95)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(75, 85, 99, 0.3)',
                        borderRadius: '1rem',
                        zIndex: 1000
                      }),
                      menuPortal: (provided) => ({
                        ...provided,
                        zIndex: 1000
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isFocused ? 'rgba(55, 65, 81, 0.8)' : 'transparent',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(55, 65, 81, 0.8)'
                        }
                      }),
                      clearIndicator: (provided) => ({
                        ...provided,
                        color: '#9CA3AF',
                        '&:hover': {
                          color: 'white'
                        }
                      })
                    }
                  }}
                />
              </div>
            </div>

            {/* Destination Input */}
            <div className="relative group dropdown-container">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 transition-colors duration-300 group-hover:text-cyan-300">
                <Navigation className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="input-glass rounded-2xl">
                <MemoizedGooglePlacesAutocomplete
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
                  selectProps={{
                    value: destination ? { label: destination, value: destination } : null,
                    onChange: (selected) => {
                      setDestination(selected?.label || "");
                      handlePlaceSelect(selected, "destination");
                    },
                    onClear: () => handleClear("destination"),
                    placeholder: "Enter destination",
                    isClearable: true,
                    className: "react-select-container",
                    classNamePrefix: "react-select",
                    menuPortalTarget: isBrowser ? document.body : null,
                    menuPosition: "fixed",
                    components: { 
                      DropdownIndicator: () => null,
                      IndicatorSeparator: () => null 
                    },
                    styles: {
                      control: (provided, state) => ({
                        ...provided,
                        backgroundColor: 'transparent',
                        border: 'none',
                        paddingLeft: '2.5rem',
                        paddingRight: '1rem',
                        paddingTop: '1rem',
                        paddingBottom: '1rem',
                        color: 'white',
                        fontSize: '16px',
                        boxShadow: 'none',
                        minHeight: '56px',
                        '&:hover': {
                          border: 'none'
                        }
                      }),
                      input: (provided) => ({
                        ...provided,
                        color: 'white',
                        margin: 0,
                        padding: 0
                      }),
                      placeholder: (provided) => ({
                        ...provided,
                        color: '#9CA3AF',
                        fontSize: '16px'
                      }),
                      singleValue: (provided) => ({
                        ...provided,
                        color: 'white'
                      }),
                      menu: (provided) => ({
                        ...provided,
                        backgroundColor: 'rgba(17, 24, 39, 0.95)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(75, 85, 99, 0.3)',
                        borderRadius: '1rem',
                        zIndex: 1000
                      }),
                      menuPortal: (provided) => ({
                        ...provided,
                        zIndex: 1000
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isFocused ? 'rgba(55, 65, 81, 0.8)' : 'transparent',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(55, 65, 81, 0.8)'
                        }
                      }),
                      clearIndicator: (provided) => ({
                        ...provided,
                        color: '#9CA3AF',
                        '&:hover': {
                          color: 'white'
                        }
                      })
                    }
                  }}
                />
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={OnSearchButtonClick}
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl hover:scale-[1.02] text-lg transform"
            >
              <Search className="w-6 h-6" />
              <span>Search Rides</span>
              <div className="text-xl animate-pulse">✨</div>
            </button>
          </div>
        </div>

        {/* Recent Searches */}
        <div className="mb-6 animate-fadeIn recent-searches-dropdown" style={{ animationDelay: '0.2s' }}>
          <button 
            onClick={() => setShowRecentSearches(!showRecentSearches)}
            className="flex items-center justify-between w-full p-4 glass-effect rounded-2xl hover:bg-gray-800/40 transition-all duration-300 group"
          >
            <div className="flex items-center text-gray-300 group-hover:text-white transition-colors duration-300">
              <Clock className="w-5 h-5 mr-3" />
              <span className="font-medium">Recent Searches</span>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-all duration-300 group-hover:text-white ${showRecentSearches ? 'rotate-180' : ''}`} />
          </button>
          
          {showRecentSearches && (
            <div className="mt-4 space-y-3 animate-slideInUp relative z-50">
              {recentSearches.slice(0, 5).map((search, index) => (
                <div
                  key={search.id}
                  onClick={() => setActiveSearchId((prev) => (prev === search.id ? null : search.id))}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border animate-fadeIn ${
                    activeSearchId === search.id 
                      ? "glass-effect border-purple-500/50 shadow-lg" 
                      : "glass-effect border-gray-600/30 hover:bg-gray-700/40 hover:border-gray-500/50"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-100 text-sm">
                        {search.pickup.length > 20 ? search.pickup.substring(0, 20) + '...' : search.pickup}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        → {search.destination.length > 20 ? search.destination.substring(0, 20) + '...' : search.destination}
                      </p>
                    </div>
                    <span className="text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full font-medium">
                      {search.type}
                    </span>
                  </div>
                  
                  {activeSearchId === search.id && (
                    <div className="mt-3 pt-3 border-t border-gray-600/50 space-y-2 animate-fadeIn">
                      <p className="text-sm text-gray-300">
                        <span className="font-medium text-purple-400">From:</span> {search.pickup}
                      </p>
                      <p className="text-sm text-gray-300">
                        <span className="font-medium text-cyan-400">To:</span> {search.destination}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="mb-6 glass-effect rounded-2xl p-6 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <span className="text-2xl mr-3">💲</span>
              <h3 className="font-bold text-white text-lg">Price Range</h3>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              ${priceRange[0]} - ${priceRange[1]}
            </span>
          </div>
          <div className="px-2">
            <Slider
              value={priceRange}
              max={1000}
              step={1}
              onChange={(event, newValue) => setPriceRange(newValue)}
              sx={{
                color: '#06b6d4',
                height: 8,
                '& .MuiSlider-thumb': {
                  backgroundColor: '#06b6d4',
                  border: '3px solid #0891b2',
                  width: 24,
                  height: 24,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    boxShadow: '0px 0px 0px 10px rgba(6, 182, 212, 0.16)',
                    transform: 'scale(1.2)',
                  },
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#06b6d4',
                  border: 'none',
                  height: 8,
                  transition: 'all 0.3s ease',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: '#374151',
                  height: 8,
                },
              }}
            />
          </div>
        </div>

        {/* Car Options List */}
        {showCarList && (
          <div className="mb-6 animate-slideInUp car-list-container">
            <CaroptionList
              priceRange={priceRange}
              distance={distance}
              onCarSelect={handleCarSelect}
              selectedCarId={selectedCar?.id}
              showRecommended={true}
            />
          </div>
        )}

        {/* Selected Car Info */}
        {selectedCar && (
          <div className="mb-6 glass-effect rounded-2xl p-6 shadow-xl animate-slideInUp">
            <h3 className="font-bold text-white mb-4 flex items-center text-lg">
              <span className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></span>
              Selected Ride
            </h3>
            <div className="flex justify-between items-center mb-6">
              <div className="flex-1">
                <p className="text-white font-bold text-xl">{selectedCar.name}</p>
                <p className="text-gray-300 text-sm mb-2">{selectedCar.description}</p>
                <p className="text-gray-300 text-sm">
                  Distance: ~{(distance / 1000).toFixed(1)} km
                </p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-2xl">${selectedCar.finalPrice}</p>
                <p className="text-gray-300 text-sm">{selectedCar.eta}</p>
              </div>
            </div>
            
            <button
              onClick={handleBookNow}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] text-lg transform"
            >
              Book Now - ${selectedCar.finalPrice}
            </button>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="payment-modal">
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            selectedCar={selectedCar}
            pickupLocation={pickup}
            destinationLocation={destination}
            distance={distance}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </div>
      )}

      {/* Payment Success Modal */}
      {showPaymentSuccess && (
        <div className="payment-modal">
          <PaymentSuccess
            paymentDetails={paymentDetails}
            onClose={handleClosePaymentSuccess}
            onTrackRide={handleTrackRide}
          />
        </div>
      )}
    </>
  );
};

export default SearchSection;