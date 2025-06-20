"use client";

import dynamic from "next/dynamic";
import Header from "@/components/Header";
import EnhancedHomeSections from "@/components/FootterSection";
import { WorldMapDemo } from "@/components/World";
import { UserButton } from "@clerk/nextjs";

// ✅ Dynamically load slideshow too (avoids SSR issues)
const ImageSlideShow = dynamic(() => import("@/components/ImageSlider"), {
  ssr: false,
  loading: () => <p className="text-white text-center py-10">Loading slideshow...</p>,
});

export default function Home() {
  return (
    <div>
      <Header />
      <WorldMapDemo />
      <ImageSlideShow />
      <EnhancedHomeSections />
    </div>
  );
}
