"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";

// Static declaration of libraries outside of the component
const libraries = ["places", "geometry"]; // Define the libraries outside of the component

const Googlemap = ({
  pickupCoordinates,
  destinationCoordinates,
  mapCenter,
  zoom,
  markersVisible,
  isSearchClicked,
  clearSearch,
}) => {
  const containerStyle = {
    width: "100%",
    height: "700px",
  };

  const mapOptions = {
    mapId: "f1f57a5407b7b9d0",
    disableDefaultUI: true,
    zoomControl: true,
    streetViewControl: false,
  };

  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null);

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance); // Properly initialize map instance
    console.log("Map Loaded");
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Load the Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    libraries: libraries, // Use the static libraries array
  });

  // Fetch and render the route
  useEffect(() => {
    if (pickupCoordinates && destinationCoordinates && isSearchClicked) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: pickupCoordinates,
          destination: destinationCoordinates,
          travelMode: google.maps.TravelMode.DRIVING, // You can change this to WALKING, BICYCLING, or TRANSIT
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`Error fetching directions: ${status}`);
          }
        }
      );
    } else {
      setDirections(null); // Clear directions when no route is available
    }

    // Adjust map view and zoom after coordinates are updated
    if (map && pickupCoordinates && destinationCoordinates && markersVisible) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(pickupCoordinates);
      bounds.extend(destinationCoordinates);
      map.fitBounds(bounds);

      const zoomLevel = map.getZoom();
      map.setZoom(zoomLevel - 1); // Adjust zoom for better fit
    } else {
      if (map) {
        map.setZoom(5);
        map.setCenter(mapCenter); // Reset to default zoom level
      }
    }
  }, [
    pickupCoordinates,
    destinationCoordinates,
    markersVisible,
    map,
    zoom,
    isSearchClicked,
  ]);
  useEffect(() => {
    if (!pickupCoordinates || !destinationCoordinates || !isSearchClicked || !markersVisible) {
      setDirections(null);
      if (map) {
        map.setZoom(5);
        map.setCenter(mapCenter);
      }
      return;
    }

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: pickupCoordinates,
        destination: destinationCoordinates,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`Error fetching directions: ${status}`);
          setDirections(null);
        }
      }
    );
  }, [pickupCoordinates, destinationCoordinates, markersVisible, map, mapCenter, isSearchClicked]);

  const handleClear = () => {
    // Reset both pickup and destination coordinates and directions
    setDirections(null); // Remove directions from the map
    clearSearch(); // Pass the function to clear the state in the parent component
  };

  if (!isLoaded) {
    return <div>Loading Map...</div>;
  }

  return (
    <div className="mt-28 border-4 border-gray-800 rounded-[50px] overflow-hidden shadow-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-100">
          Google Map
        </h2>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={zoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={mapOptions}
        >
          {markersVisible && pickupCoordinates && destinationCoordinates && (
            <>
              {/* Render Pickup and Destination Markers */}
              <Marker position={pickupCoordinates} />
              <Marker position={destinationCoordinates} />
              {/* Render the route if needed */}
              

            </>
          )}

          {/* Render the route */}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>
    </div>
  );
};

export default Googlemap;
