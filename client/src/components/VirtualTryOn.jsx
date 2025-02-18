import React, { useState, useEffect } from 'react';
import { fal } from "@fal-ai/client";

// Configure fal client
fal.config({
  credentials: "586c4f39-d4db-455c-8f6c-86d681484e14:a8632af5e781cafb161bd929e621608c"
});

// Map your categories to the API's accepted categories
const categoryMap = {
  'tops': 'tops',
  'shirts': 'tops',
  't-shirts': 'tops',
  'sweaters': 'tops',
  'jackets': 'tops',
  'coats': 'tops',
  'pants': 'bottoms',
  'jeans': 'bottoms',
  'shorts': 'bottoms',
  'skirts': 'bottoms',
  'dresses': 'one-pieces',
  'jumpsuits': 'one-pieces',
};

const VirtualTryOn = ({ initialGarment, initialCategory }) => {
  const [modelImage, setModelImage] = useState(null);
  const [garmentImage, setGarmentImage] = useState(initialGarment || null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialGarment) {
      setGarmentImage(initialGarment);
    }
  }, [initialGarment]);

  const getMappedCategory = (category) => {
    const normalizedCategory = category?.toLowerCase();
    return categoryMap[normalizedCategory] || 'tops'; // default to tops if category not found
  };

  const handleTryOn = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const modelImageUrl = modelImage instanceof File 
        ? await fal.storage.upload(modelImage)
        : modelImage;
      
      const garmentImageUrl = garmentImage instanceof File 
        ? await fal.storage.upload(garmentImage)
        : garmentImage;

      if (!modelImageUrl || !garmentImageUrl) {
        throw new Error("Please provide both a model image and a garment image");
      }

      const mappedCategory = getMappedCategory(initialCategory);
      console.log('Using category:', mappedCategory); // Debug log

      const response = await fal.subscribe("fashn/tryon", {
        input: {
          model_image: modelImageUrl,
          garment_image: garmentImageUrl,
          category: mappedCategory,
          garment_photo_type: "auto",
          nsfw_filter: true,
          guidance_scale: 2,
          timesteps: 50,
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            console.log("Processing:", update.logs);
          }
        },
      });

      setResult(response.data);
    } catch (error) {
      console.error("Virtual try-on failed:", error);
      setError(error.message || "Failed to process virtual try-on");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Virtual Try-On</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Upload Your Photo</h3>
          <div className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setModelImage(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {modelImage && (
              <img 
                src={modelImage instanceof File ? URL.createObjectURL(modelImage) : modelImage} 
                alt="Model preview" 
                className="mt-4 max-w-[200px] rounded-lg shadow-md" 
              />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Selected Garment</h3>
          <div className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
            {garmentImage && (
              <img 
                src={garmentImage} 
                alt="Garment preview" 
                className="max-w-[200px] rounded-lg shadow-md" 
              />
            )}
          </div>
        </div>
      </div>

      <div className="text-center">
        <button 
          onClick={handleTryOn} 
          disabled={!modelImage || !garmentImage || loading}
          className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors
            ${loading || !modelImage || !garmentImage 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : 'Try On'}
        </button>
      </div>

      {result && result.images && result.images.length > 0 && (
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Result</h3>
          <img 
            src={result.images[0].url} 
            alt="Virtual try-on result" 
            className="max-w-md mx-auto rounded-lg shadow-lg" 
          />
        </div>
      )}
    </div>
  );
};

export default VirtualTryOn; 