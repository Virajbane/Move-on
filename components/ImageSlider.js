"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const images = [
  "/buildings-5655593_1920.jpg",
  "/downtown-4045037_1920.jpg",
  "/people-4259948_1920.jpg",
  "/florence-3862664_1920.jpg",
  "/prague-1845560_1920.jpg"
];

export default function ImageSlideShow() {
  // Hooks must be called unconditionally
  const [isMounted, setIsMounted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  // Effect to handle mounting logic
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Image slider effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleSignIn = () => {
    router.push("/app/Auth/sign-in");
  };

  // Render only after the component is mounted
  if (!isMounted) {
    return null;
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
              <img
                src={images[currentImageIndex]}
                alt="Background"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" />
            </motion.div>
          </AnimatePresence>

          {/* Main content */}
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
                Your reliable ride, anytime, anywhere. Experience seamless travel
                with our professional drivers and comfortable vehicles.
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

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
              >
                {[
                  { title: "24/7 Service", description: "Available round the clock" },
                  { title: "Safe Rides", description: "Vetted professional drivers" },
                  { title: "Best Prices", description: "Competitive and transparent rates" },
                ].map((feature, index) => (
                  <div key={index} className="text-left">
                    <h3 className="text-xl font-semibold mb-2 text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
