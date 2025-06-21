// CarOptionList.js - Car list component with Uber-style UI
import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { carData, calculatePrice, filterCarsByPriceRange } from './CarListdata';

const CaroptionList = ({ 
  priceRange = [0, 100], 
  distance = 0, 
  onCarSelect = () => {},
  selectedCarId = null,
  showRecommended = true 
}) => {
  const [filteredCars, setFilteredCars] = useState([]);
  const [recommendedCar, setRecommendedCar] = useState(null);

  useEffect(() => {
    // Filter cars based on price range
    const filtered = filterCarsByPriceRange(carData, priceRange, distance);
    setFilteredCars(filtered);

    // Set recommended car (usually the most popular/balanced option)
    if (filtered.length > 0) {
      const recommended = filtered.find(car => car.type === 'standard') || filtered[0];
      setRecommendedCar(recommended);
    }
  }, [priceRange, distance]);

  const handleCarSelect = (car) => {
    const finalPrice = calculatePrice(car.basePrice, distance);
    onCarSelect({
      ...car,
      finalPrice: finalPrice.toFixed(2),
      distance: distance
    });
  };

  const CarCard = ({ car, isRecommended = false }) => {
    const finalPrice = calculatePrice(car.basePrice, distance);
    const isSelected = selectedCarId === car.id;
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
      setImageError(true);
    };

    return (
      <div 
        className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-300 ease-in-out border ${
          isSelected 
            ? 'bg-gray-700 border-blue-500 shadow-lg transform scale-105' 
            : 'bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-gray-500 hover:shadow-md'
        }`}
        onClick={() => handleCarSelect(car)}
      >
        <div className="flex items-center space-x-4">
          {/* Car Image/Logo */}
          <div className="w-16 h-12 flex items-center justify-center transition-transform duration-300">
            {!imageError ? (
              <img 
                src={car.image}
                alt={car.name}
                className={`w-full h-full object-contain transition-all duration-300 ${
                  isSelected ? 'brightness-110 scale-110' : ''
                }`}
                onError={handleImageError}
              />
            ) : (
              <span className={`text-2xl transition-all duration-300 ${
                isSelected ? 'scale-110' : ''
              }`}>{car.logo}</span>
            )}
          </div>

          {/* Car Details */}
          <div className="flex flex-col">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className={`font-semibold text-lg transition-colors duration-300 ${
                isSelected ? 'text-blue-300' : 'text-white'
              }`}>{car.name}</h3>
              <div className="flex items-center space-x-1">
                <Users className={`w-4 h-4 transition-colors duration-300 ${
                  isSelected ? 'text-blue-400' : 'text-gray-400'
                }`} />
                <span className={`text-sm transition-colors duration-300 ${
                  isSelected ? 'text-blue-400' : 'text-gray-400'
                }`}>{car.capacity}</span>
              </div>
            </div>
            <p className={`text-sm transition-colors duration-300 ${
              isSelected ? 'text-gray-300' : 'text-gray-500'
            }`}>{car.description}</p>
          </div>
        </div>

        {/* Price */}
        <div className="text-right">
          <div className={`text-xl font-semibold transition-all duration-300 ${
            isSelected 
              ? 'text-blue-300 scale-110' 
              : 'text-white'
          }`}>
            ${finalPrice.toFixed(2)}
          </div>
          {distance > 0 && (
            <div className={`text-xs transition-colors duration-300 ${
              isSelected ? 'text-blue-400' : 'text-gray-500'
            }`}>
              {car.eta}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (filteredCars.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No rides available in your price range</p>
        <p className="text-sm text-gray-500 mt-2">Try adjusting the price range above</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900">
      {/* Recommended Section */}
      {showRecommended && recommendedCar && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3 px-4">Recommended</h3>
          <div className="px-4">
            <CarCard car={recommendedCar} isRecommended={true} />
          </div>
        </div>
      )}

      {/* All Options */}
      <div>
        {!showRecommended && (
          <h3 className="text-lg font-semibold text-white mb-3 px-4">
            Choose a ride ({filteredCars.length})
          </h3>
        )}
        <div className="space-y-3">
          {filteredCars.map((car) => (
            <div key={car.id} className="px-4">
              <CarCard 
                car={car} 
                isRecommended={car.id === recommendedCar?.id}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Price Info */}
      {distance > 0 && (
        <div className="mt-6 mx-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400">
            💡 Prices may vary based on distance ({(distance / 1000).toFixed(1)} km), 
            demand, and traffic conditions.
          </p>
        </div>
      )}
    </div>
  );
};

export default CaroptionList;