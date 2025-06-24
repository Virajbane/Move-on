"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

const images = [
  "/buildings-5655593_1920.jpg",
  "/downtown-4045037_1920.jpg",
  "/people-4259948_1920.jpg",
  "/florence-3862664_1920.jpg",
  "/prague-1845560_1920.jpg",
];

export default function ImageSlideShow() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    
    // Auto-slide functionality
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSignIn = () => {
    router.push("/app/Auth/sign-in");
  };

  // Don't render anything until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-8">
        <div className="w-[90%] relative overflow-hidden border border-white/20 rounded-lg">
          <div className="aspect-video relative bg-gray-800 flex items-center justify-center">
            <p className="text-white text-center">Loading slideshow...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="w-[90%] relative overflow-hidden border border-white/20 rounded-lg">
        <div className="aspect-video relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={images[currentImageIndex]}
                alt="Background"
                fill
                priority
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-6xl mx-auto px-8">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl lg:text-6xl font-bold mb-6 text-white"
              >
                Move with confidence
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg lg:text-xl text-gray-300 mb-8"
              >
                Your reliable ride, anytime, anywhere. Experience seamless
                travel with our professional drivers and comfortable vehicles.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex pt-5 gap-4"
              >
                <button
                  onClick={handleSignIn}
                  className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Book a Ride
                </button>
                <button className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors text-white">
                  Learn More
                </button>
              </motion.div>
            </div>
          </div>

          {/* Image indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentImageIndex 
                    ? 'bg-white' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}