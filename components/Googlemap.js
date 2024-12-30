import React, { useCallback, useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

// Static declaration of libraries outside of the component
const libraries = ["places", "geometry"]; // Define the libraries outside of the component

const Googlemap = ({ pickupCoordinates, destinationCoordinates, mapCenter, zoom, markersVisible }) => {
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

  const onLoad = useCallback((map) => {
    setMap(map);
    console.log("Map Loaded");
  }, []);

  const onUnmount = useCallback(() => {}, []);

  // Load the Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    libraries: libraries, // Use the static libraries array
  });

  useEffect(() => {
    if (map && pickupCoordinates && destinationCoordinates) {
      // Create a LatLngBounds object
      const bounds = new google.maps.LatLngBounds();

      // Extend the bounds to include both pickup and destination coordinates
      bounds.extend(pickupCoordinates);
      bounds.extend(destinationCoordinates);

      // Fit the map to the bounds and zoom to fit both markers
      map.fitBounds(bounds);

      // Optionally, you can adjust the zoom level to fit both markers properly
      const zoomLevel = map.getZoom();
      map.setZoom(zoomLevel - 1); // Adjust zoom for better fit, if necessary
    }
  }, [map, pickupCoordinates, destinationCoordinates]);

  if (!isLoaded) {
    return <div>Loading Map...</div>; // Display loading message while the map is loading
  }

  // Debugging: Check if the coordinates and markersVisible are correct
  console.log("Markers Visible:", markersVisible);
  console.log("Pickup Coordinates:", pickupCoordinates);
  console.log("Destination Coordinates:", destinationCoordinates);

  return (
    <div className="mt-28 border-4 border-gray-800 rounded-[50px] overflow-hidden shadow-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-100">Google Map</h2>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter} // Center the map to the provided coordinates
          zoom={zoom} // Zoom level set dynamically
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={mapOptions}
        >
          {/* Add markers for pickup and destination */}
          {markersVisible && pickupCoordinates && (
            <Marker position={pickupCoordinates} title="Pickup Location" />
          )}
          {markersVisible && destinationCoordinates && (
            <Marker position={destinationCoordinates} title="Destination Location" />
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default Googlemap;
