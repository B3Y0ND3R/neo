import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Layout from "@/components/home/layout";

function VirtualTryOn() {
  const [personImage, setPersonImage] = useState(null);
  const [clothingImage, setClothingImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { productId } = useParams();

  const compressImage = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions
          const maxSize = 800;
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with reduced quality
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedBase64.split(',')[1]);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleTryOn = async () => {
    if (!personImage || !clothingImage) {
      alert("Please upload both images");
      return;
    }

    setLoading(true);
    
    try {
      console.log('Starting image processing...');
      
      // Compress images before sending
      const compressedPersonImage = await compressImage(personImage);
      console.log('Person image compressed');
      const compressedClothingImage = await compressImage(clothingImage);
      console.log('Clothing image compressed');

      // First remove background from both images
      console.log('Removing background from person image...');
      const processedPersonImage = await removeBackground(compressedPersonImage);
      console.log('Person image background removed');
      
      console.log('Removing background from clothing image...');
      const processedClothingImage = await removeBackground(compressedClothingImage);
      console.log('Clothing image background removed');
      
      // Convert processed images to base64
      const personResponse = await axios.get(processedPersonImage, { responseType: 'arraybuffer' });
      const clothingResponse = await axios.get(processedClothingImage, { responseType: 'arraybuffer' });
      
      const personBase64 = Buffer.from(personResponse.data, 'binary').toString('base64');
      const clothingBase64 = Buffer.from(clothingResponse.data, 'binary').toString('base64');

      console.log('Processed person image size:', personBase64.length);
      console.log('Processed clothing image size:', clothingBase64.length);

      const encodedParams = new URLSearchParams();
      encodedParams.append('person_image', personBase64);
      encodedParams.append('clothing_image', clothingBase64);

      const options = {
        method: 'POST',
        url: 'https://virtual-try-on2.p.rapidapi.com/clothes-virtual-tryon',
        headers: {
          'x-rapidapi-key': '56199a2f10msh13466cdae8b204cp1a6151jsn23aee06d9f3f',
          'x-rapidapi-host': 'virtual-try-on2.p.rapidapi.com',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: encodedParams,
      };

      const response = await axios.request(options);
      console.log('Virtual try-on response:', response.data);

      if (response.data && response.data.result_image) {
        setResultImage(response.data.result_image);
      } else {
        throw new Error(`No result image in response. Response: ${JSON.stringify(response.data)}`);
      }
    } catch (error) {
      console.error('Detailed processing error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      alert(`Error processing images: ${error.message}\n\nDetails: ${JSON.stringify(error.response?.data || {})}`);
    } finally {
      setLoading(false);
    }
  };

  const removeBackground = async (base64Image) => {
    try {
      console.log('Sending image to backend, size:', base64Image.length);
      const response = await axios.post('/api/image-processing/remove-background', {
        imageBase64: base64Image
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      console.log('Backend response:', response.data);

      if (!response.data || !response.data.image_url) {
        throw new Error('Invalid response from backend');
      }

      return response.data.image_url;
    } catch (error) {
      console.error('Background removal error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw new Error(`Background removal failed: ${error.response?.data?.error || error.message}`);
    }
  };

  // Add debug logs for state changes
  useEffect(() => {
    console.log('Result Image State:', resultImage);
  }, [resultImage]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Virtual Try On</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Upload Your Photo</h2>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPersonImage(e.target.files[0])}
              className="w-full"
            />
            {personImage && (
              <img
                src={URL.createObjectURL(personImage)}
                alt="Person"
                className="max-w-full h-auto"
              />
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Upload Clothing Image</h2>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setClothingImage(e.target.files[0])}
              className="w-full"
            />
            {clothingImage && (
              <img
                src={URL.createObjectURL(clothingImage)}
                alt="Clothing"
                className="max-w-full h-auto"
              />
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button 
            onClick={handleTryOn} 
            disabled={loading || !personImage || !clothingImage}
          >
            {loading ? "Processing..." : "Try On"}
          </Button>
        </div>

        {resultImage && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Result</h2>
            <img
              src={`data:image/jpeg;base64,${resultImage}`}
              alt="Result"
              className="max-w-full h-auto mx-auto"
            />
          </div>
        )}
      </div>
    </Layout>
  );
}

export default VirtualTryOn; 