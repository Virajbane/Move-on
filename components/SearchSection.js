"use client";
import React from "react";
import { Search, Clock, Star, Navigation } from "lucide-react";
import Input from "@mui/material/Input";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Badge from "@mui/material/Badge";
import Slider from "@mui/material/Slider";

const SearchSection = ({
  searchQuery,
  setSearchQuery,
  priceRange = [0, 100],
  setPriceRange,
}) => {
  const recentSearches = [
    { id: 1, location: "Manhattan, NY", type: "Taxi" },
    { id: 2, location: "Brooklyn Bridge", type: "Package" },
    { id: 3, location: "Central Park", type: "Delivery" },
  ];

  const popularLocations = [
    { id: 1, name: "Times Square", rating: 4.8, distance: "0.8 mi" },
    { id: 2, name: "Grand Central", rating: 4.6, distance: "1.2 mi" },
    { id: 3, name: "Empire State", rating: 4.9, distance: "0.5 mi" },
  ];

  return (
    <div className="w-1/4 p-6 bg-gray-900 border-r border-gray-800 overflow-y-auto mt-24 text-gray-100">
      {/* Search Input */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search locations..."
            className="pl-10 bg-gray-800 border-gray-700 rounded-lg w-full text-gray-100 placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {["All", "Taxi", "Package", "Delivery"].map((filter) => (
          <Badge
            key={filter}
            variant={filter === "All" ? "default" : "outline"}
            className="cursor-pointer bg-gray-800 text-gray-100 border-gray-700 hover:bg-gray-700 transition-colors"
          >
            {filter}
          </Badge>
        ))}
      </div>

      {/* Price Range */}
      {/* Price Range */}
<Card className="mb-6 bg-gray-800 border border-gray-700">
  <CardContent className="p-4">
    <div className="flex justify-between mb-2">
      <h3 className="font-semibold text-black">Price Range</h3> {/* Fixed text color */}
      <span className="text-sm text-gray-400">
        ${priceRange[0]} - ${priceRange[1]}
      </span>
    </div>
    <Slider
      value={priceRange} // Controlled component
      max={100}
      step={1}
      className="my-4"
      onChange={(e, newValue) => setPriceRange(newValue)} // Update state on change
    />
  </CardContent>
</Card>


      {/* Recent Searches */}
      <div className="mb-8">
        <h3 className="font-semibold mb-4 text-gray-100">Recent Searches</h3>
        <div className="space-y-3">
          {recentSearches.map((search) => (
            <div
              key={search.id}
              className="flex items-center p-3 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors border border-gray-700"
            >
              <Clock className="w-4 h-4 text-gray-400 mr-3" />
              <div>
                <p className="font-medium text-gray-100">{search.location}</p>
                <p className="text-sm text-gray-400">{search.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Locations */}
      <div>
        <h3 className="font-semibold mb-4 text-gray-100">Popular Locations</h3>
        <div className="space-y-3">
          {popularLocations.map((location) => (
            <div
              key={location.id}
              className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 border border-gray-700"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-100">{location.name}</h4>
                <Badge
                  variant="outline"
                  className="bg-gray-900 border-gray-700"
                >
                  <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                  {location.rating}
                </Badge>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Navigation className="w-3 h-3 mr-1" />
                {location.distance} away
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
