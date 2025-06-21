// carlistdata.js - Car data file
export const carData = [
  {
    id: 1,
    name: "Uber X",
    description: "Affordable, Everyday rides",
    basePrice: 27.01,
    capacity: 4,
    rating: 4.8,
    eta: "5 min",
    image: "/compressed_87e77cc19e46ecb3bc0d7a1ba4b8b734.webp",
    logo: "🚗", // Fallback logo if image fails
    type: "standard",
    features: ["AC", "Music", "Water"]
  },
  {
    id: 2,
    name: "Black",
    description: "Affordable, Everyday rides",
    basePrice: 27.01,
    capacity: 4,
    rating: 4.9,
    eta: "3 min",
    image: "/lovepik-white-car-png-image_400249558_wh300.png",
    logo: "🚙", // Fallback logo if image fails
    type: "premium",
    features: ["AC", "Music", "Water", "WiFi"]
  },
  {
    id: 3,
    name: "Uber Pet",
    description: "Affordable rides for you and your pet",
    basePrice: 34.37,
    capacity: 4,
    rating: 4.7,
    eta: "8 min",
    image: "/Lovepik_com-400237161-white-car.png",
    logo: "🐕", // Fallback logo if image fails
    type: "pet",
    features: ["AC", "Pet Friendly", "Water Bowl"]
  },
  {
    id: 4,
    name: "Uber XL",
    description: "Extra space for groups",
    basePrice: 45.20,
    capacity: 6,
    rating: 4.6,
    eta: "6 min",
    image: "/pngtree-3d-car-model-png-image_14325000.png",
    logo: "🚐", // Fallback logo if image fails
    type: "xl",
    features: ["AC", "Music", "Extra Space", "Water"]
  },
  {
    id: 5,
    name: "Uber Comfort",
    description: "Newer cars with extra legroom",
    basePrice: 38.50,
    capacity: 4,
    rating: 4.8,
    eta: "4 min",
    image: "/pngtree-a-white-car-png-image_12555586.png",
    logo: "✨", // Fallback logo if image fails
    type: "comfort",
    features: ["AC", "Music", "Extra Legroom", "Premium"]
  },
  {
    id: 6,
    name: "Uber Green",
    description: "Electric and hybrid vehicles",
    basePrice: 32.75,
    capacity: 4,
    rating: 4.5,
    eta: "7 min",
    image: "/pngtree-car-png-image_14994324.png",
    logo: "🌱", // Fallback logo if image fails
    type: "eco",
    features: ["AC", "Eco-Friendly", "Music"]
  }
];

// Utility functions for car data
export const getCarById = (id) => {
  return carData.find(car => car.id === id);
};

export const getCarsByType = (type) => {
  return carData.filter(car => car.type === type);
};

export const getCarsByCapacity = (minCapacity) => {
  return carData.filter(car => car.capacity >= minCapacity);
};

export const calculatePrice = (basePrice, distance) => {
  if (!distance) return basePrice;
  
  const distanceKm = distance / 1000; // Convert to km
  const baseFare = basePrice;
  const perKmRate = 2.5; // Rate per km
  const minimumFare = basePrice;
  
  const calculatedPrice = baseFare + (distanceKm * perKmRate);
  return Math.max(minimumFare, calculatedPrice);
};

export const filterCarsByPriceRange = (cars, priceRange, distance = 0) => {
  return cars.filter(car => {
    const adjustedPrice = calculatePrice(car.basePrice, distance);
    return adjustedPrice >= priceRange[0] && adjustedPrice <= priceRange[1];
  });
};