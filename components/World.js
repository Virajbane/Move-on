"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// ✅ Dynamically load WorldMap client-side only to avoid SSR issues
const WorldMap = dynamic(() => import("@/components/ui/world-map").then(mod => mod.WorldMap), {
  ssr: false,
  loading: () => <p className="text-white text-center py-10">Loading map...</p>,
});

export function WorldMapDemo() {
  const [mounted, setMounted] = useState(false);

  // ✅ Wait until component is mounted to prevent hydration mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  
  

  return (
    <div className="py-40 dark:bg-black bg-black w-full">
      <div className="max-w-7xl py-4 mx-auto text-center">
        <p className="font-bold text-2xl md:text-4xl text-white">
          Seamless{" "}
          <span className="text-neutral-400">
            {"Journeys".split("").map((char, idx) => (
              <motion.span
                key={idx}
                className="inline-block"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        </p>
        <p className="text-sm md:text-lg text-neutral-500 max-w-6xl mx-auto py-4 pb-8">
          Empower your travel. Connect effortlessly, explore freely,
          and move on with confidence. Perfect for dreamers, adventurers, and go-getters.
        </p>
      </div>

      {/* ✅ Safely load map after mount to avoid SSR issues */}
      <WorldMap
        dots={[
          {
            start: { lat: 64.2008, lng: -149.4937 },
            end: { lat: 34.0522, lng: -118.2437 },
          },
          {
            start: { lat: 64.2008, lng: -149.4937 },
            end: { lat: -15.7975, lng: -47.8919 },
          },
          {
            start: { lat: -15.7975, lng: -47.8919 },
            end: { lat: 38.7223, lng: -9.1393 },
          },
          {
            start: { lat: 51.5074, lng: -0.1278 },
            end: { lat: 28.6139, lng: 77.209 },
          },
          {
            start: { lat: 28.6139, lng: 77.209 },
            end: { lat: 43.1332, lng: 131.9113 },
          },
          {
            start: { lat: 28.6139, lng: 77.209 },
            end: { lat: -1.2921, lng: 36.8219 },
          },
        ]}
      />
    </div>
  );
}
