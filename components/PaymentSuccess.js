"use client";

import React from 'react';
import { CheckCircle, Car, MapPin, Clock, CreditCard } from 'lucide-react';
import { Card, CardContent, Button } from '@mui/material';

const PaymentSuccess = ({ 
  paymentDetails, 
  onClose, 
  onTrackRide 
}) => {
  if (!paymentDetails) return null;

  const { paymentId, orderId, amount, car, pickup, destination, distance } = paymentDetails;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-md w-full p-6 text-white">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
          <p className="text-gray-400">Your ride has been successfully booked</p>
        </div>

        {/* Payment Details */}
        <Card className="mb-6 bg-gray-800 border border-gray-700">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payment ID
                </span>
                <span className="text-white text-sm font-mono">
                  {paymentId.slice(-8)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Amount Paid</span>
                <span className="text-green-400 font-bold">${amount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ride Details */}
        <Card className="mb-6 bg-gray-800 border border-gray-700">
          <CardContent className="p-4">
            <h3 className="font-semibold text-white mb-3 flex items-center">
              <Car className="w-4 h-4 mr-2" />
              Ride Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Vehicle:</span>
                <span className="text-white">{car.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">ETA:</span>
                <span className="text-white">{car.eta}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Distance:</span>
                <span className="text-white">~{(distance / 1000).toFixed(1)} km</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Route Details */}
        <Card className="mb-6 bg-gray-800 border border-gray-700">
          <CardContent className="p-4">
            <h3 className="font-semibold text-white mb-3 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Route
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-3 h-3 bg-green-400 rounded-full mt-1 mr-3"></div>
                <div>
                  <p className="text-gray-400 text-xs">Pickup</p>
                  <p className="text-white text-sm">{pickup}</p>
                </div>
              </div>
              <div className="border-l-2 border-gray-600 ml-1.5 h-4"></div>
              <div className="flex items-start">
                <div className="w-3 h-3 bg-red-400 rounded-full mt-1 mr-3"></div>
                <div>
                  <p className="text-gray-400 text-xs">Destination</p>
                  <p className="text-white text-sm">{destination}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onTrackRide}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
          >
            <Clock className="w-4 h-4 mr-2" />
            Track Your Ride
          </Button>
          
          <Button
            onClick={onClose}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg"
          >
            Done
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Booking ID: {orderId}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            You will receive SMS updates about your ride
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;