"use client";
import React, { useState } from 'react'; // Import useState
import Header from '@/components/Header';
import SearchSection from '@/components/SearchSection';

function Userpage() {
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [priceRange, setPriceRange] = useState([0, 100]); // State for price range

  return (
    <>
      <Header />
      <SearchSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        priceRange={priceRange} // Pass price range state
        setPriceRange={setPriceRange} // Pass updater function
      />
    </>
  );
}

export default Userpage;
