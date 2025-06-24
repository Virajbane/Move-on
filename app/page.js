"use client";

import dynamic from "next/dynamic";
import Header from "@/components/Header";
import EnhancedHomeSections from "@/components/FootterSection";
import { UserButton } from "@clerk/nextjs";
import { useState, useEffect } from 'react';

// ✅ Dynamically load both components with proper hydration handling
const WorldMapDemo = dynamic(() => import("@/components/World").then(mod => ({ default: mod.WorldMapDemo })), {
  ssr: false,
  loading: () => <div className="py-40 bg-black"><p className="text-white text-center py-10">Loading map...</p></div>,
});

const ImageSlideShow = dynamic(() => import("@/components/ImageSlider"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-black flex items-center justify-center"><p className="text-white text-center py-10">Loading slideshow...</p></div>,
});

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render dynamic components until after hydration
  if (!mounted) {
    return (
      <div>
        <Header />
        {/* Loading states that match the actual component dimensions */}
        <div className="py-40 bg-black">
          <p className="text-white text-center py-10">Loading map...</p>
        </div>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <p className="text-white text-center py-10">Loading slideshow...</p>
        </div>
        <EnhancedHomeSections />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <WorldMapDemo />
      <ImageSlideShow />
      <EnhancedHomeSections />
    </div>
  );
}