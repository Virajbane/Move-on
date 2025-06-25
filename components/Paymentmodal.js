"use client";

import React, { useState } from "react";
import { X, CreditCard, Shield, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PaymentModal = ({
  isOpen,
  onClose,
  selectedCar,
  pickupLocation,
  destinationLocation,
  distance,
  onPaymentSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createOrder = async (amount) => {
    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to paise for INR
          currency: "INR", // Changed from USD to INR for Razorpay
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw new Error(`Failed to create order: ${error.message}`);
    }
  };

  const handlePayment = async () => {
    if (!selectedCar) return;

    setIsProcessing(true);
    setPaymentError("");

    try {
      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error(
          "Failed to load Razorpay script. Please check your internet connection."
        );
      }

      // Check if Razorpay is available
      if (typeof window.Razorpay === "undefined") {
        throw new Error("Razorpay is not loaded properly");
      }

      // Create order
      const order = await createOrder(selectedCar.finalPrice);
      onClose();

      // Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Ride Booking",
        description: `${selectedCar.name} - ${pickupLocation} to ${destinationLocation}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            setIsProcessing(true);
            // Verify payment
            const verifyResponse = await fetch("/api/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verificationResult = await verifyResponse.json();

            if (verifyResponse.ok && verificationResult.success) {
              onPaymentSuccess({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                amount: selectedCar.finalPrice,
                car: selectedCar,
                pickup: pickupLocation,
                destination: destinationLocation,
                distance: distance,
              });
              onClose();
            } else {
              throw new Error(
                verificationResult.error || "Payment verification failed"
              );
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            setPaymentError(`Payment verification failed: ${error.message}`);
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        notes: {
          pickup: pickupLocation,
          destination: destinationLocation,
          distance: `${(distance / 1000).toFixed(1)} km`,
          car_type: selectedCar.name,
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function () {
            console.log("User closed Razorpay");
            setIsProcessing(false);
          },
        },
      };
      onClose();

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError(
        error.message || "Failed to initiate payment. Please try again."
      );
      setIsProcessing(false);
    }
  };

  if (!selectedCar) return null;

  return (
    <Dialog
      open={isOpen && !isProcessing}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: "#1a1a1a",
          color: "white",
          borderRadius: "20px",
        },
      }}
    >
      <DialogHeader className="flex items-center justify-between p-6 border-b border-gray-700">
        <DialogTitle className="text-xl font-bold text-white">
          Complete Your Booking
        </DialogTitle>
        <Button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
          size="small"
        >
          <X className="w-5 h-5" />
        </Button>
      </DialogHeader>

      <DialogContent className="p-6">
        {/* Ride Summary */}
        <Card className="mb-6 bg-gray-800 border border-gray-700">
          <CardContent className="p-4">
            <h3 className="font-semibold text-white mb-3">Ride Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Vehicle:</span>
                <span className="text-white font-medium">
                  {selectedCar.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">From:</span>
                <span className="text-white">{pickupLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">To:</span>
                <span className="text-white">{destinationLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Distance:</span>
                <span className="text-white">
                  ~{(distance / 1000).toFixed(1)} km
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">ETA:</span>
                <span className="text-white">{selectedCar.eta}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Price Breakdown */}
        <Card className="mb-6 bg-gray-800 border border-gray-700">
          <CardContent className="p-4">
            <h3 className="font-semibold text-white mb-3">Price Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Base Fare:</span>
                <span className="text-white">₹{selectedCar.basePrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Distance Charge:</span>
                <span className="text-white">
                  ₹{(selectedCar.finalPrice - selectedCar.basePrice).toFixed(2)}
                </span>
              </div>
              <div className="border-t border-gray-600 pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-white">Total Amount:</span>
                  <span className="text-green-400 text-lg">
                    ₹{selectedCar.finalPrice}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Features */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-xs text-gray-400">Secure Payment</p>
          </div>
          <div className="text-center">
            <CreditCard className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-xs text-gray-400">Multiple Options</p>
          </div>
          <div className="text-center">
            <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-xs text-gray-400">Instant Booking</p>
          </div>
        </div>

        {/* Error Message */}
        {paymentError && (
          <div className="mb-4 p-3 bg-red-900 border border-red-600 rounded-lg">
            <p className="text-red-200 text-sm">{paymentError}</p>
          </div>
        )}

        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            `Pay ₹${selectedCar.finalPrice} & Book Ride`
          )}
        </Button>

        <p className="text-xs text-gray-400 text-center mt-3">
          By proceeding, you agree to our terms and conditions
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
