import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

export default function ProductImageUpload({
  imageFile,
  setImageFile,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  imageLoadingState,
  isEditMode,
  existingImage
}) {
  const inputRef = useRef(null);

  // Reset component state when switching between add/edit modes
  useEffect(() => {
    setImageFile(null);
    setUploadedImageUrl("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [isEditMode]);

  const handleImageUpload = async (file) => {
    try {
      setImageLoadingState(true);
      const formData = new FormData();
      formData.append("my_file", file);
      
      // If editing and there's an existing image, send it to be deleted
      if (isEditMode && existingImage) {
        formData.append("oldImageUrl", existingImage);
      }

      const response = await fetch("http://localhost:5000/api/admin/products/upload-image", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();

      if (data.success) {
        setUploadedImageUrl(data.result.url);
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      setImageFile(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } finally {
      setImageLoadingState(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      handleImageUpload(file);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      handleImageUpload(file);
    }
  };

  const displayImage = uploadedImageUrl || (isEditMode && existingImage) || "";

  return (
    <div className="w-full mt-4">
      <div
        className="w-full min-h-[200px] border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer relative"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          hidden
          onChange={handleFileInput}
          accept="image/*"
        />
        {imageLoadingState ? (
          <p>Loading...</p>
        ) : displayImage ? (
          <img
            src={displayImage}
            alt="product"
            className="max-h-[200px] object-contain"
          />
        ) : (
          <p>Drag and drop or click to upload image</p>
        )}
      </div>
    </div>
  );
}