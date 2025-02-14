"use client";
import React, { useState, useCallback, memo } from "react";
import { Search, Clock, Star, Navigation, MapPin } from "lucide-react";
import Input from "@mui/material/Input";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import dynamic from "next/dynamic";
import Script from "next/script";


import "../app/globals.css";

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
  const [pickupCoordinatesState, setPickupCoordinatesState] = useState({
    lat: 0,
    lng: 0,
  });
  const [destinationCoordinatesState, setDestinationCoordinatesState] =
    useState({ lat: 0, lng: 0 });
  const [markersVisibleState, setMarkersVisibleState] = useState(false);

  const [recentSearches, setRecentSearches] = useState([
    {
      id: 1,
      pickup: "Manhattan, NY",
      destination: "JFK Airport",
      type: "Taxi",
    },
    {
      id: 2,
      pickup: "Brooklyn Bridge",
      destination: "Times Square",
      type: "Package",
    },
    {
      id: 3,
      pickup: "Central Park",
      destination: "Newark Airport",
      type: "Delivery",
    },
  ]);
  const [activeSearchId, setActiveSearchId] = useState(null);
  const [nextId, setNextId] = useState(recentSearches.length + 1);
  const [showRecentSearches, setShowRecentSearches] = useState(false);

  const OnSearchButtonClick = () => {
    handleSearchClick();
    handleSearchButtonClick(); // Trigger search button click logic
  };

  const handleSearchButtonClick = () => {
    if (pickup && destination) {
      // Validate lat and lng for both pickup and destination
      const pickupLat =
        pickupCoordinatesState.lat && !isNaN(pickupCoordinatesState.lat)
          ? pickupCoordinatesState.lat
          : 0;
      const pickupLng =
        pickupCoordinatesState.lng && !isNaN(pickupCoordinatesState.lng)
          ? pickupCoordinatesState.lng
          : 0;
      const destinationLat =
        destinationCoordinatesState.lat &&
        !isNaN(destinationCoordinatesState.lat)
          ? destinationCoordinatesState.lat
          : 0;
      const destinationLng =
        destinationCoordinatesState.lng &&
        !isNaN(destinationCoordinatesState.lng)
          ? destinationCoordinatesState.lng
          : 0;

      // Only proceed if the lat and lng values are valid
      if (
        !isNaN(pickupLat) &&
        !isNaN(pickupLng) &&
        !isNaN(destinationLat) &&
        !isNaN(destinationLng)
      ) {
        // Create new search entry
        const newSearch = { id: nextId, pickup, destination, type: "Custom" };

        // Update recent searches
        setRecentSearches((prevSearches) => [
          newSearch,
          ...prevSearches.slice(0, 4), // Limit to 5 recent searches
        ]);

        // Increment the next search ID for uniqueness
        setNextId(nextId + 1);

        // Calculate the midpoint for map center
        const lat = (pickupLat + destinationLat) / 2;
        const lng = (pickupLng + destinationLng) / 2;

        // Set the map center only if setMapCenter is available
        setMapCenter?.({ lat, lng });

        // Calculate the zoom level based on the distance between pickup and destination
        if (
          window.google &&
          google.maps.geometry &&
          google.maps.geometry.spherical
        ) {
          const distance =
            google.maps.geometry.spherical.computeDistanceBetween(
              new google.maps.LatLng(pickupLat, pickupLng),
              new google.maps.LatLng(destinationLat, destinationLng)
            );

          // Dynamically set the zoom level based on distance
          const zoomLevel = distance > 50000 ? 10 : distance > 20000 ? 12 : 14;

          // Set the zoom level only if setZoom is available
        } else {
          console.error(
            "Google Maps API is not available or geometry library is missing."
          );
        }

        // Ensure markers are visible after clicking the search button
        if (setMarkersVisible) {
          setMarkersVisible(true);
        }
      } else {
        console.error(
          "Invalid coordinates: ",
          pickupLat,
          pickupLng,
          destinationLat,
          destinationLng
        );
      }
    } else {
      clearSearch();
      setMarkersVisible(false);
      setMapCenter({ lat: 20.5937, lng: 78.9629 }); // Reset to default center
      setZoom(5);
    }
  };

  const handleClear = (type) => {
    if (type === "pickup") {
      setPickup("");
      setPickupCoordinates(null);
      setPickupCoordinatesState({ lat: 0, lng: 0 });
    } else if (type === "destination") {
      setDestination("");
      setDestinationCoordinates(null);
      setDestinationCoordinatesState({ lat: 0, lng: 0 });
    }

    // If both fields are empty, reset the map
    if (
      (type === "pickup" && !destination) ||
      (type === "destination" && !pickup)
    ) {
      clearSearch();
      setMarkersVisible(false);
    }
  };

  const handleRecentSearchClick = (searchId) => {
    setActiveSearchId((prev) => (prev === searchId ? null : searchId));
  };

  const handlePlaceSelect = (selected, type) => {
    if (!isGoogleMapsLoaded) return;
    const address = selected?.label || "";
    if (!address) return;

    if (window.google && window.google.maps) {
      const geocoder = new google.maps.Geocoder();
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
    } else {
      console.error("Google Maps API not loaded.");
    }
  };

  return (
    
    <div className=" p-6 bg-[#0a0a0a] border-4 rounded-[50px] border-gray-800 overflow-y-auto mt-28 text-gray-100">
      
      {/* Get Ride Section */}
      <div className="mb-8 border-4 rounded-[50px] border-gray-600">
        <h2 className="text-xl font-bold ml-7 m-6">Get Ride</h2>
        <div className="space-y-4 ml-6 mr-4 mb-5 gap-1 flex flex-col items-center">
          {/* Pickup Field */}
          <div className="relative w-full border-2 border-gray-700 rounded-lg">
            <MapPin className="absolute z-10 left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

            <MemoizedGooglePlacesAutocomplete
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
              selectProps={{
                value: pickup ? { label: pickup, value: pickup } : null,
                onChange: (selected) => {
                  setPickup(selected?.label || "");
                  handlePlaceSelect(selected, "pickup"); // Pass the selected place
                },
                onClear: () => {
                  handleClear("pickup");
                },
                placeholder: "Enter pickup location",
                isClearable: true,
                className: "w-[90%] ml-10 p-3",
                components: {
                  DropdownIndicator: false,
                },
                styles: {
                  control: (provided) => ({
                    ...provided,
                    borderColor: "gray",
                    color: "white",
                    backgroundColor: "black",
                  }),
                  input: (provided) => ({
                    ...provided,
                    color: "white",
                  }),
                  option: (provided) => ({
                    ...provided,
                    color: "black",
                  }),
                },
              }}
            />
          </div>

          {/* Destination Field */}
          <div className="relative w-full border-2 border-gray-700 rounded-lg">
            <Navigation className="absolute z-10 left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

            <MemoizedGooglePlacesAutocomplete
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
              selectProps={{
                value: destination
                  ? { label: destination, value: destination }
                  : null,
                onChange: (selected) => {
                  setDestination(selected?.label || "");
                  handlePlaceSelect(selected, "destination"); // Pass the selected place
                },
                onClear: () => {
                  handleClear("destination");
                },
                placeholder: "Enter Drop location",
                isClearable: true,
                className: "w-[90%] ml-10 p-3",
                components: {
                  DropdownIndicator: false,
                },
                styles: {
                  control: (provided) => ({
                    ...provided,
                    borderColor: "gray",
                    backgroundColor: "black",
                  }),
                  input: (provided) => ({
                    ...provided,
                    color: "white",
                  }),
                  option: (provided) => ({
                    ...provided,
                    color: "black",
                  }),
                },
              }}
            />
          </div>

          {/* Search Button */}
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
        <h3
          className="font-semibold mb-4 text-gray-100 cursor-pointer"
          onClick={() => setShowRecentSearches(!showRecentSearches)}
        >
          Recent Searches
        </h3>
        {showRecentSearches && (
          <div className="space-y-3">
            {recentSearches.slice(0, 5).map((search) => (
              <div
                key={search.id}
                onClick={() => handleRecentSearchClick(search.id)}
                className={`flex flex-col p-3 rounded-lg cursor-pointer transition-colors border ${
                  activeSearchId === search.id
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-800 border-gray-700"
                }`}
                role="button"
                aria-expanded={activeSearchId === search.id}
              >
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-3" />
                  <p className="font-medium text-gray-100">
                    {search.pickup} → {search.destination}
                  </p>
                </div>

                {/* Toggle details */}
                <div
                  className={`details mt-2 text-sm text-gray-400 ${
                    activeSearchId === search.id ? "show" : ""
                  }`}
                >
                  <p>Pickup: {search.pickup}</p>
                  <p>Destination: {search.destination}</p>
                  <p>Type: {search.type}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <Card className="mb-6 !bg-gray-800 dark:bg-gray-800 border border-gray-700">
        <CardContent className="p-4">
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold text-gray-100">Price Range</h3>
            <span className="text-sm text-gray-400">
              ${priceRange[0]} - ${priceRange[1]}
            </span>
          </div>
          <Slider
            value={priceRange}
            max={100}
            step={1}
            className="my-4"
            onChange={(event, newValue) => setPriceRange(newValue)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchSection;
