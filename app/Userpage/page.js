"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import SearchSection from "@/components/SearchSection";
import Googlemap from "@/components/Googlemap";
import { useJsApiLoader } from "@react-google-maps/api";

const libraries = ["places", "geometry"];

function Userpage() {
  const [pickupCoordinates, setPickupCoordinates] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const [zoom, setZoom] = useState(5);
  const [markersVisible, setMarkersVisible] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [isSearchClicked, setIsSearchClicked] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    libraries,
  });

  const handleSearchClick = () => {
    setIsSearchClicked(true);
  };

  const clearSearch = () => {
    setPickupCoordinates(null);
    setDestinationCoordinates(null);
    setIsSearchClicked(false);
    setMarkersVisible(false);
    setZoom(5);
    setMapCenter({ lat: 20.5937, lng: 78.9629 });
  };

  useEffect(() => {
    if (pickupCoordinates && destinationCoordinates) {
      const lat = (pickupCoordinates.lat + destinationCoordinates.lat) / 2;
      const lng = (pickupCoordinates.lng + destinationCoordinates.lng) / 2;
      setMapCenter({ lat, lng });
      setZoom(5);
      setMarkersVisible(true);
    }
  }, [pickupCoordinates, destinationCoordinates]);

  return (
    <>
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-4 bg-black lg:grid-cols-4 gap-8 mt-10">
        <div className="col-span-1 md:col-span-1 lg:col-span-1">
          <SearchSection
            setPickupCoordinates={setPickupCoordinates}
            setDestinationCoordinates={setDestinationCoordinates}
            setMapCenter={setMapCenter}
            setZoom={setZoom}
            setMarkersVisible={setMarkersVisible}
            clearSearch={clearSearch}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            recentSearches={recentSearches}
            setRecentSearches={setRecentSearches}
            handleSearchClick={handleSearchClick}
            isGoogleMapsLoaded={isLoaded}
          />
        </div>
        <div className="col-span-1 md:col-span-3 lg:col-span-3">
          {isLoaded ? (
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
