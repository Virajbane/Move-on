"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import SearchSection from "@/components/SearchSection";
import Googlemap from "@/components/Googlemap";
import { useJsApiLoader }  from "@react-google-maps/api";




const libraries=["places","geometry"];
function Userpage() {
  const [pickupCoordinates, setPickupCoordinates] = useState(null); // State to hold pickup coordinates
  const [destinationCoordinates, setDestinationCoordinates] = useState(null); // State to hold destination coordinates
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // Default center to India
  const [zoom, setZoom] = useState(5); // Set initial zoom level to fit India
  const [markersVisible, setMarkersVisible] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100]); // State for marker visibility
  const [recentSearches, setRecentSearches] = useState([]); // Store recent searches
  const [nextId, setNextId] = useState(1); // To keep track of unique search IDs
  const [isSearchClicked, setIsSearchClicked] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    libraries, // Add required libraries
  });

  
  const handleSearchClick = () => {
    setIsSearchClicked(true); // Set to true when search button is clicked
  };

  const clearSearch = () => {
    // Reset coordinates
    setPickupCoordinates(null);
    setDestinationCoordinates(null);
  
    // Reset the state for visibility and other map-related things
    setIsSearchClicked(false);
    setMarkersVisible(false);
    setZoom(5);  // Reset zoom level to initial value
    setMapCenter({ lat: 20.5937, lng: 78.9629 }); // Reset to default center
  };
  
  // Update map center whenever pickup or destination coordinates change
  useEffect(() => {
    if (pickupCoordinates && destinationCoordinates) {
      const lat = (pickupCoordinates.lat + destinationCoordinates.lat) / 2;
      const lng = (pickupCoordinates.lng + destinationCoordinates.lng) / 2;
      setMapCenter({ lat, lng });
      setZoom(5); // Adjust zoom level after coordinates are set
      setMarkersVisible(true); // Show markers after coordinates are available
    }
  }, [pickupCoordinates, destinationCoordinates]);
  

  return (
    <>
      <Header />
      {/* Dynamically load the Google Maps API */}
      
      

      <div className="grid grid-cols-1 md:grid-cols-4 bg-black lg:grid-cols-4 gap-8 mt-10">
        {/* Search Section */}
        <div className="col-span-1 md:col-span-1 lg:col-span-1">
          <SearchSection
            setPickupCoordinates={setPickupCoordinates}
            setDestinationCoordinates={setDestinationCoordinates}
            setMapCenter={setMapCenter}
            setZoom={setZoom}
            setMarkersVisible={setMarkersVisible}
            clearSearch={clearSearch}
             // Pass handleSearchClick function
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            recentSearches={recentSearches} // Pass recentSearches to display them
            setRecentSearches={setRecentSearches}
            handleSearchClick={handleSearchClick}
            isGoogleMapsLoaded={isLoaded} // Pass setRecentSearches to manage the list
          />
        </div>

        {/* Google Map Section */}
        <div className="col-span-1 md:col-span-3 lg:col-span-3">
          {/* Render GoogleMap only if both coordinates are available */}
          {isLoaded ? ( // Only render the map if the API is loaded
            <Googlemap
              pickupCoordinates={pickupCoordinates}
              destinationCoordinates={destinationCoordinates}
              mapCenter={mapCenter}
              zoom={zoom}
              markersVisible={markersVisible}
              isSearchClicked={isSearchClicked}
              clearSearch={clearSearch}
            />
          ) : (
            <div>Loading Map...</div>
          )}
        </div>
      </div>
    </>
  );
}

export default Userpage;
