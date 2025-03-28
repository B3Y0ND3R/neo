import React from 'react';
import { useLocation } from 'react-router-dom';
import VirtualTryOn from '../components/VirtualTryOn';

const TryOnPage = () => {
  const location = useLocation();
  const { garmentImage, category } = location.state || {};

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Virtual Try-On Experience
      </h1>
      <VirtualTryOn initialGarment={garmentImage} initialCategory={category} />
    </div>
  );
};

export default TryOnPage; 