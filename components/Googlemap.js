import React from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

function Googlemap() {
  // Define the container style for the Google Map
  const containerStyle = {
    width: '100%',
    height: '700px',  // You can adjust the height based on your requirements
  };

  // Center coordinates for the map
  const center = {
    lat: 20.0,
    lng: 78.0,
  };

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,  // Ensure this API key is correct
  });

  // State to manage the map instance
  const [map, setMap] = React.useState(null);

  // On load callback to fit map bounds
  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  // On unmount callback to clean up map instance
  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <div className="mt-28 border-4 border-gray-800 rounded-[50px] overflow-hidden shadow-lg">
      {/* Parent div with heading and map */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-100">Google Map</h2>
        <div className="border-4 border-gray-800 rounded-[50px] overflow-hidden">
          <GoogleMap
            mapContainerStyle={containerStyle}  // Apply container style here
            center={center}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {/* You can add markers, info windows, or other map elements here */}
          </GoogleMap>
        </div>
      </div>
    </div>
  ) : (
    <div>Loading...</div>  // Display loading message until the map is ready
  );
}

export default Googlemap;
