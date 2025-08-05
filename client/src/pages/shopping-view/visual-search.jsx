import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload, Search, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

const VisualSearch = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const { toast } = useToast();

  // FastAPI service URL (your ngrok URL)
  const FASTAPI_URL = "https://23a7497865b6.ngrok-free.app";

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSearch = async () => {
    if (!selectedFile) {
      toast({
        title: "No image selected",
        description: "Please select an image to search",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setSimilarProducts([]);

    try {
      // Step 1: Upload image to Cloudinary via backend
      const uploadFormData = new FormData();
      uploadFormData.append('my_file', selectedFile);

      const uploadResponse = await fetch('http://localhost:5000/api/admin/products/upload-image', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Image upload failed: ${uploadResponse.status}`);
      }

      const uploadData = await uploadResponse.json();
      const imageUrl = uploadData.result.url;

      toast({
        title: "Image uploaded successfully",
        description: "Processing image for feature extraction...",
      });

      // Step 2: Extract features using backend proxy (avoids CORS issues)
      console.log('🔍 Sending URL to backend for feature extraction:', imageUrl);
      const extractResponse = await fetch('http://localhost:5000/api/shop/visual-search/extract-features', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      console.log('📡 Backend response status:', extractResponse.status);

      if (!extractResponse.ok) {
        const errorText = await extractResponse.text();
        console.error('❌ Backend error response:', errorText);
        throw new Error(`Feature extraction failed: ${extractResponse.status} - ${errorText}`);
      }

      const extractData = await extractResponse.json();
      
      if (!extractData.vector) {
        throw new Error("Failed to extract features from image");
      }

      toast({
        title: "Features extracted successfully",
        description: `Extracted ${extractData.vector.length} features from image`,
      });

      // Step 2: Search for similar products using the extracted vector
      const searchResponse = await fetch('http://localhost:5000/api/shop/visual-search/search-similar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          featureVector: extractData.vector,
          limit: 4
        }),
      });

      if (!searchResponse.ok) {
        throw new Error(`Similarity search failed: ${searchResponse.status}`);
      }

      const searchData = await searchResponse.json();
      
      if (searchData.success && searchData.products) {
        setSimilarProducts(searchData.products);
        toast({
          title: "Search completed!",
          description: `Found ${searchData.products.length} similar products`,
        });
      } else {
        throw new Error("No similar products found");
      }

    } catch (error) {
      console.error('Visual search error:', error);
      toast({
        title: "Search failed",
        description: error.message || "Failed to perform visual search",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setSimilarProducts([]);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Visual Search</h1>
          <p className="text-gray-600">
            Upload an image to find similar products in our collection
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Upload Image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* File Upload */}
              <div className="space-y-4">
                <Label htmlFor="image-upload">Select Image</Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="cursor-pointer"
                />
                <p className="text-sm text-gray-500">
                  Supported formats: JPEG, PNG, GIF (max 5MB)
                </p>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSearch} 
                    disabled={!selectedFile || isLoading}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Search Similar Products
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleClear}
                    disabled={!selectedFile}
                  >
                    Clear
                  </Button>
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-4">
                <Label>Preview</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-w-full max-h-[200px] object-contain rounded"
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <Upload className="w-8 h-8 mx-auto mb-2" />
                      <p>No image selected</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {similarProducts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Similar Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {similarProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="aspect-square overflow-hidden rounded-t-lg">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                          {product.title}
                        </h3>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-bold text-green-600">
                            ${product.salePrice > 0 ? product.salePrice : product.price}
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {Math.round(product.similarity_score * 100)}% match
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          <p>Brand: {product.brand}</p>
                          <p>Category: {product.category}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Results */}
        {!isLoading && similarProducts.length === 0 && selectedFile && (
          <Card>
            <CardContent className="p-8 text-center">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No Similar Products Found</h3>
              <p className="text-gray-500">
                Try uploading a different image or check back later for more products.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VisualSearch; 