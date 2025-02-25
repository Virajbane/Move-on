import EnhancedHomeSections from "@/components/FootterSection";
import FootterSection from "@/components/FootterSection";
import Header from "@/components/Header";
import ImageSlideShow from "@/components/ImageSlider";
import { WorldMap } from "@/components/ui/world-map.js";
import { WorldMapDemo } from "@/components/World";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      
      <Header />
      <WorldMapDemo/>
      <ImageSlideShow/>
      <EnhancedHomeSections/>
      
    </div>
    

  );
}
