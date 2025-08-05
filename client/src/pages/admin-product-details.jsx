import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails, setProductDetails } from "@/store/shop/products-slice";
import { getReviews, deleteReview } from "@/store/shop/review-slice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Star, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import HashLoader from "react-spinners/HashLoader";
import socketManager from "@/utils/socket";

function AdminProductDetailsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { productDetails, isLoading } = useSelector((state) => state.shopProducts);
  const { reviews } = useSelector((state) => state.shopReview);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetails(productId));
      dispatch(getReviews(productId));
    }

    // Connect to socket and join admin room for real-time updates
    const socket = socketManager.connect();
    socketManager.joinAdminRoom();
    
    // Listen for stock updates
    socketManager.onStockUpdate((data) => {
      console.log('Stock update received:', data);
      // If the updated product is the current one, refresh the details
      if (data.productId === productId) {
        dispatch(fetchProductDetails(productId));
        // Show toast notification for real-time update
        toast({
          title: "Stock Updated",
          description: `Product stock has been updated in real-time`,
          duration: 3000,
        });
      }
    });

    // Clear product details when component unmounts to prevent modal from showing
    return () => {
      dispatch(setProductDetails());
      socketManager.leaveAdminRoom();
      socketManager.offStockUpdate();
    };
  }, [dispatch, productId]);

  useEffect(() => {
    if (productDetails?._id) {
      dispatch(getReviews(productDetails._id));
    }
  }, [dispatch, productDetails]);

  const handleDeleteReview = async (reviewId) => {
    try {
      await dispatch(deleteReview({ productId: productDetails._id, reviewId })).unwrap();
      toast({
        title: "Review deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <HashLoader loading={true} color="#000000" size={50} />
      </div>
    );
  }

  if (!productDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={productDetails.image}
                alt={productDetails.title}
                className="w-full h-auto max-h-[600px] object-contain rounded-lg shadow-lg"
              />
              {productDetails.totalStock === 0 ? (
                <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">
                  Out Of Stock
                </Badge>
              ) : productDetails.totalStock < 10 ? (
                <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">
                  {`Only ${productDetails.totalStock} items left`}
                </Badge>
              ) : productDetails.salePrice > 0 ? (
                <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">
                  Sale
                </Badge>
              ) : null}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {productDetails.title}
              </h1>
              <p className="text-gray-600 mb-4">{productDetails.description}</p>
              
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm text-gray-500">
                  Category: {productDetails.category}
                </span>
                <span className="text-sm text-gray-500">
                  Brand: {productDetails.brand}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span
                  className={`${
                    productDetails.salePrice > 0 ? "line-through text-gray-400" : ""
                  } text-2xl font-bold text-gray-900`}
                >
                  ${productDetails.price}
                </span>
                {productDetails.salePrice > 0 && (
                  <span className="text-2xl font-bold text-red-600">
                    ${productDetails.salePrice}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">
                    {productDetails.averageReview?.toFixed(1) || "0.0"}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  ({reviews.length} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Reviews Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          
          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reviews yet.</p>
            ) : (
              reviews.map((review) => (
                <Card key={review._id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{review.userName}</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.reviewValue
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteReview(review._id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{review.reviewMessage}</p>
                    {review.reviewImages && review.reviewImages.length > 0 && (
                      <div className="flex gap-2">
                        {review.reviewImages.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Review ${index + 1}`}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProductDetailsPage; 