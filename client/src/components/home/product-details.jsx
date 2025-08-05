import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { getReviews, addReview } from "@/store/shop/review-slice";
import ReviewImageUpload from "../shop/review-image-upload";
import { Label } from "../ui/label";

function HomeProductDetails({ open, setOpen, productDetails }) {
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const reviews = useSelector((state) => state.shopReview.reviews);
  const { toast } = useToast();

  // Force close dialog if productDetails is null or invalid
  useEffect(() => {
    if (!productDetails || !productDetails._id) {
      setOpen(false);
    }
  }, [productDetails, setOpen]);

  // Additional cleanup to prevent dialog from showing with invalid data
  useEffect(() => {
    // Check if productDetails is valid, if not, close dialog
    if (open && (!productDetails || !productDetails._id || !productDetails.title)) {
      setOpen(false);
      dispatch(setProductDetails());
    }
  }, [open, productDetails, setOpen, dispatch]);

  useEffect(() => {
    if (productDetails?._id) {
      dispatch(getReviews(productDetails._id));
    }
    
    // Cleanup function to reset state when component unmounts
    return () => {
      setRating(0);
    };
  }, [dispatch, productDetails]);

  const handleDialogClose = () => {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
  };

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSubmitReview = ({ reviewMessage, reviewImages }) => {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage,
        reviewValue: rating,
        reviewImages,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review added successfully!",
        });
      }
    });
  };

  const handleAddToCart = (getCurrentProductId, getTotalStock) => {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 p-4 sm:p-6 lg:p-12 max-w-[95vw] sm:max-w-[90vw] lg:max-w-[80vw] xl:max-w-[70vw] max-h-[90vh] overflow-y-auto">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="space-y-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight">{productDetails?.title}</h1>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg mb-4 mt-2 leading-relaxed">
              {productDetails?.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-primary ${
                productDetails?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ${productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-muted-foreground">
                ${productDetails?.salePrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StarRatingComponent rating={averageReview} />
            </div> 
            <span className="text-sm sm:text-base text-muted-foreground">
              ({averageReview.toFixed(2)})
            </span>
          </div>
          
          {user && (
            <div className="mt-5 mb-5">
              {productDetails?.totalStock === 0 ? (
                <Button className="w-full opacity-60 cursor-not-allowed">
                  Out of Stock
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() =>
                    handleAddToCart(
                      productDetails?._id,
                      productDetails?.totalStock
                    )
                  }
                >
                  Add to Cart
                </Button>
              )}
            </div>
          )}
          
          <Separator />
          <div className="max-h-[200px] sm:max-h-[250px] lg:max-h-[300px] overflow-auto">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Reviews</h2>
            <div className="grid gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem) => (
                  <div className="flex gap-3 sm:gap-4" key={reviewItem._id}>
                    <Avatar className="w-8 h-8 sm:w-10 sm:h-10 border flex-shrink-0">
                      <AvatarFallback className="text-xs sm:text-sm">
                        {reviewItem?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm sm:text-base">{reviewItem?.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                        {reviewItem.reviewMessage}
                      </p>
                      {reviewItem.reviewImages && reviewItem.reviewImages.length > 0 && (
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {reviewItem.reviewImages.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Review image ${index + 1}`}
                              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <h1>No Reviews</h1>
              )}
            </div>
            
            {/* Show review form only when logged in */}
            {user && (
              <div className="mt-6 sm:mt-8 lg:mt-10 flex-col flex gap-2">
                <Label className="text-sm sm:text-base">Write a review</Label>
                <ReviewImageUpload
                  onSubmitReview={handleSubmitReview}
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default HomeProductDetails; 