"use client";
import React, { useState } from 'react'; // Import useState
import Header from '@/components/Header';
import SearchSection from '@/components/SearchSection';
import Googlemap from '@/components/Googlemap';

function Userpage() {
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [priceRange, setPriceRange] = useState([0, 100]); // State for price range

  return (
    <>
      <Header />
      
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-8 mt-10">
        {/* Search Section */}
        <div className="col-span-1 md:col-span-1 lg:col-span-1">
          <SearchSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            priceRange={priceRange} // Pass price range state
            setPriceRange={setPriceRange} // Pass updater function
          />
        </div>

        {/* Google Map Section */}
        <div className="col-span-1 md:col-span-3 lg:col-span-3">
          <Googlemap />
        </div>
      </div>
    </>
  );
}

export default Userpage;
