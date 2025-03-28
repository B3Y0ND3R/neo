import { UploadCloudIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import StarRatingComponent from "./star-rating";
import { toast } from "../ui/use-toast";

export default function ReviewImageUpload({ 
  onSubmitReview, 
  rating,
  handleRatingChange 
}) {
  const [previewUrls, setPreviewUrls] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const inputRef = useRef(null);

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("You can only upload up to 5 images");
      return;
    }

    const validFiles = files.filter(file => file.type.startsWith('image/'));
    setSelectedFiles(validFiles);

    // Create preview URLs
    const urls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const removeImage = (index) => {
    const newUrls = previewUrls.filter((_, i) => i !== index);
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setPreviewUrls(newUrls);
    setSelectedFiles(newFiles);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (reviewText.trim() === "") {
      toast({
        title: "Please write a review message",
        variant: "destructive",
      });
      return;
    }

    if (!rating) {
      toast({
        title: "Please select a rating",
        variant: "destructive",
      });
      return;
    }
    
    onSubmitReview({
      reviewMessage: reviewText,
      reviewImages: selectedFiles
    });

    // Reset form
    setReviewText("");
    setSelectedFiles([]);
    setPreviewUrls([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="w-full mt-4">
      <div className="flex flex-col gap-4">
        {/* Star Rating */}
        <div className="flex gap-1">
          <StarRatingComponent
            rating={rating}
            handleRatingChange={handleRatingChange}
          />
        </div>

        {/* Review Text Input */}
        <Input
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review here..."
          className="w-full"
        />

        {/* Image Upload Area */}
        <div
          className="w-full min-h-[100px] border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer relative"
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            hidden
            onChange={handleFileInput}
            accept="image/*"
            multiple
            max="5"
          />
          <div className="flex flex-col items-center">
            <UploadCloudIcon className="h-6 w-6 text-gray-400" />
            <p className="text-sm text-gray-500">Click to upload review images (max 5)</p>
          </div>
        </div>

        {/* Image Previews */}
        {previewUrls.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`preview ${index + 1}`}
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                >
                  <XIcon className="h-4 w-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={reviewText.trim() === ""}
          className="w-full"
        >
          Submit Review
        </Button>
      </div>
    </div>
  );
} 