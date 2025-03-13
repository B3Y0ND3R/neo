import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews, deleteReview } from "@/store/shop/review-slice";
import ReviewImageUpload from "../shop/review-image-upload";
import { adminDeleteReview } from "@/store/admin/review-slice";
import { fetchAllProducts } from "@/store/admin/products-slice";

function ProductDetailsDialog({ open, setOpen, productDetails, isAdmin }) {
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const reviews = useSelector((state) => state.shopReview.reviews);
  const { toast } = useToast();

  useEffect(() => {
    if (productDetails?._id) {
      dispatch(getReviews(productDetails._id));
    }
  }, [dispatch, productDetails]);

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
    let getCartItems = reviews.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }
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

  const handleDialogClose = () => {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    dispatch(getReviews(productDetails?._id));
  };

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  const handleDeleteReview = async (reviewId) => {
    if (!productDetails?._id) return;

    try {
      const deleteAction = isAdmin ? adminDeleteReview : deleteReview;
      const result = await dispatch(deleteAction({ 
        productId: productDetails._id, 
        reviewId 
      })).unwrap();

      if (result.success) {
        if (isAdmin) {
          dispatch(fetchAllProducts());
        } else {
          dispatch(getReviews(productDetails._id));
        }
        
        toast({
          title: "Success",
          description: "Review deleted successfully",
        });
        
        setOpen(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  const canDeleteReview = (review) => {
    if (isAdmin) return true;
    return user?.id === review.userId;
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="">
          <div>
            <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
            <p className="text-muted-foreground text-2xl mb-5 mt-4">
              {productDetails?.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`text-3xl font-bold text-primary ${
                productDetails?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ${productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="text-2xl font-bold text-muted-foreground">
                ${productDetails?.salePrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StarRatingComponent rating={averageReview} />
            </div> 
             <span className="text-muted-foreground">
              ({averageReview.toFixed(2)})
            </span>
          </div>
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
          <Separator />
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <div className="grid gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem) => (
                  <div className="flex gap-4" key={reviewItem._id}>
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        {reviewItem?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{reviewItem?.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-muted-foreground">
                        {reviewItem.reviewMessage}
                      </p>
                      {reviewItem.reviewImages && reviewItem.reviewImages.length > 0 && (
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {reviewItem.reviewImages.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Review image ${index + 1}`}
                              className="w-20 h-20 object-cover rounded"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    {canDeleteReview(reviewItem) && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteReview(reviewItem._id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <h1>No Reviews</h1>
              )}
            </div>
            <div className="mt-10 flex-col flex gap-2">
              <Label>Write a review</Label>
              <ReviewImageUpload
                onSubmitReview={handleSubmitReview}
                rating={rating}
                handleRatingChange={handleRatingChange}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;