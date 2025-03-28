import { Star } from "lucide-react";

export default function StarRatingComponent({ rating, handleRatingChange, readOnly = false }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex gap-1">
      {stars.map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          } ${!readOnly && "cursor-pointer hover:text-yellow-400"}`}
          onClick={() => !readOnly && handleRatingChange(star)}
        />
      ))}
    </div>
  );
} 