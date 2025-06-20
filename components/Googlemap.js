"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  InfoWindow,
} from "@react-google-maps/api";

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
  const [pickupAddress, setPickupAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [clickedMarker, setClickedMarker] = useState(null);

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
    console.log("Map Loaded");
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // 🧠 Get Address from Coordinates
  useEffect(() => {
    if (
      window.google &&
      window.google.maps &&
      pickupCoordinates &&
      destinationCoordinates
    ) {
      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode({ location: pickupCoordinates }, (results, status) => {
        if (status === "OK") {
          setPickupAddress(results[0]?.formatted_address || "Pickup Location");
        }
      });

      geocoder.geocode(
        { location: destinationCoordinates },
        (results, status) => {
          if (status === "OK") {
            setDestinationAddress(
              results[0]?.formatted_address || "Destination Location"
            );
          }
        }
      );
    }
  }, [pickupCoordinates, destinationCoordinates]);

  // 🧭 Draw route & adjust map view
  useEffect(() => {
    if (
      window.google &&
      window.google.maps &&
      pickupCoordinates &&
      destinationCoordinates &&
      isSearchClicked
    ) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: pickupCoordinates,
          destination: destinationCoordinates,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") {
            setDirections(result);
          } else {
            console.error("Error fetching directions:", status);
          }
        }
      );

      if (map && markersVisible) {
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(pickupCoordinates);
        bounds.extend(destinationCoordinates);
        map.fitBounds(bounds);
        map.setZoom(map.getZoom() - 1);
      }
    } else {
      setDirections(null);
      if (map) {
        map.setZoom(5);
        map.setCenter(mapCenter);
      }
    }
  }, [
    pickupCoordinates,
    destinationCoordinates,
    isSearchClicked,
    markersVisible,
    map,
    mapCenter,
  ]);

  const handleMarkerClick = (type) => {
    setClickedMarker(type);
  };

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
          {/* Markers */}
          {markersVisible && (
            <>
              {pickupCoordinates && (
                <Marker
                  position={pickupCoordinates}
                  icon={{
                    url: "/pin.png",
                    scaledSize: new window.google.maps.Size(30, 30),
                    anchor: new window.google.maps.Point(15, 15),
                  }}
                  onClick={() => handleMarkerClick("pickup")}
                />
              )}

              {clickedMarker === "pickup" && (
                <InfoWindow
                  position={pickupCoordinates}
                  options={{ pixelOffset: new window.google.maps.Size(20, -10) }}
                >
                  <div style={infoBoxStyle}>{pickupAddress}</div>
                </InfoWindow>
              )}

              {destinationCoordinates && (
                <Marker
                  position={destinationCoordinates}
                  icon={{
                    url: "/home.png",
                    scaledSize: new window.google.maps.Size(32, 32),
                    anchor: new window.google.maps.Point(16, 16),
                  }}
                  onClick={() => handleMarkerClick("destination")}
                />
              )}

              {clickedMarker === "destination" && (
                <InfoWindow
                  position={destinationCoordinates}
                  options={{ pixelOffset: new window.google.maps.Size(20, -10) }}
                >
                  <div style={infoBoxStyle}>{destinationAddress}</div>
                </InfoWindow>
              )}
            </>
          )}

          {/* Route Line */}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{ suppressMarkers: true }}
            />
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

const infoBoxStyle = {
  background: "#fff",
  padding: "10px",
  borderRadius: "5px",
  boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
  color: "#000",
  fontSize: "12px",
  fontWeight: "bold",
};

export default Googlemap;
