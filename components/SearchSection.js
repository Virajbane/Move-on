"use client";

import React, { useState, memo } from "react";
import { Search, Clock, Navigation, MapPin } from "lucide-react";
import Input from "@mui/material/Input";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import dynamic from "next/dynamic";
import CaroptionList from "./utils/CarOption"; // Import the car list component
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
    // You can add more logic here like proceeding to booking
  };

  return (
    <div className="p-6 bg-[#0a0a0a] border-4 rounded-[50px] border-gray-800 overflow-y-auto mt-28 text-gray-100">
      {/* Get Ride */}
      <div className="mb-8 border-4 rounded-[50px] border-gray-600">
        <h2 className="text-xl font-bold ml-7 m-6">Get Ride</h2>
        <div className="space-y-4 ml-6 mr-4 mb-5 flex flex-col items-center">
          {/* Pickup */}
          <div className="relative w-full border-2 border-gray-700 rounded-lg">
            <MapPin className="absolute z-10 left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                className: "w-[90%] ml-10 p-3",
                components: { DropdownIndicator: false },
                styles: {
                  control: (provided) => ({ ...provided, borderColor: "gray", backgroundColor: "black", color: "white" }),
                  input: (provided) => ({ ...provided, color: "white" }),
                  option: (provided) => ({ ...provided, color: "black" }),
                },
              }}
            />
          </div>

          {/* Destination */}
          <div className="relative w-full border-2 border-gray-700 rounded-lg">
            <Navigation className="absolute z-10 left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <MemoizedGooglePlacesAutocomplete
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
              selectProps={{
                value: destination ? { label: destination, value: destination } : null,
                onChange: (selected) => {
                  setDestination(selected?.label || "");
                  handlePlaceSelect(selected, "destination");
                },
                onClear: () => handleClear("destination"),
                placeholder: "Enter drop location",
                isClearable: true,
                className: "w-[90%] ml-10 p-3",
                components: { DropdownIndicator: false },
                styles: {
                  control: (provided) => ({ ...provided, borderColor: "gray", backgroundColor: "black", color: "white" }),
                  input: (provided) => ({ ...provided, color: "white" }),
                  option: (provided) => ({ ...provided, color: "black" }),
                },
              }}
            />
          </div>

          {/* Button */}
          <Button
            className="w-[90%] text-white hover:bg-blue-700 hover:text-white"
            onClick={OnSearchButtonClick}
          >
            <Search className="w-4 h-4 mr-2" />
            Search Rides
          </Button>
        </div>
      </div>

      {/* Recent Searches */}
      <div className="mb-8">
        <h3 className="font-semibold mb-4 text-gray-100 cursor-pointer" onClick={() => setShowRecentSearches(!showRecentSearches)}>
          Recent Searches
        </h3>
        {showRecentSearches && (
          <div className="space-y-3">
            {recentSearches.slice(0, 5).map((search) => (
              <div
                key={search.id}
                onClick={() => setActiveSearchId((prev) => (prev === search.id ? null : search.id))}
                className={`flex flex-col p-3 rounded-lg cursor-pointer transition-colors border ${
                  activeSearchId === search.id ? "bg-gray-700 border-gray-600" : "bg-gray-800 border-gray-700"
                }`}
              >
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-3" />
                  <p className="font-medium text-gray-100">{search.pickup} → {search.destination}</p>
                </div>
                {activeSearchId === search.id && (
                  <div className="mt-2 text-sm text-gray-400">
                    <p>Pickup: {search.pickup}</p>
                    <p>Destination: {search.destination}</p>
                    <p>Type: {search.type}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <Card className="mb-6 !bg-gray-800 border border-gray-700">
        <CardContent className="p-4">
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold text-gray-100">Price Range</h3>
            <span className="text-sm text-gray-400">${priceRange[0]} - ${priceRange[1]}</span>
          </div>
          <Slider
            value={priceRange}
            max={1000}
            step={1}
            onChange={(event, newValue) => setPriceRange(newValue)}
          />
        </CardContent>
      </Card>

      {/* Car Options List - Only show after search */}
      {showCarList && (
        <div className="mb-6">
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
        <Card className="mb-6 !bg-blue-900 border border-blue-600">
          <CardContent className="p-4">
            <h3 className="font-semibold text-white mb-2">Selected Ride</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white font-medium">{selectedCar.name}</p>
                <p className="text-blue-200 text-sm">{selectedCar.description}</p>
                <p className="text-blue-200 text-sm">Distance: ~{(distance / 1000).toFixed(1)} km</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-lg">${selectedCar.finalPrice}</p>
                <p className="text-blue-200 text-sm">{selectedCar.eta}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchSection;