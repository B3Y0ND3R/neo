import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const navigate = useNavigate();

  const handleTryOn = (e) => {
    e.stopPropagation(); // Prevent triggering product details click
    navigate('/virtual-try-on', { 
      state: { 
        garmentImage: product?.image,
        category: product?.category.toLowerCase(), // Convert to lowercase to match API requirements
        productId: product?._id,
        productTitle: product?.title
      } 
    });
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div onClick={() => handleGetProductDetails(product?._id)}>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {`Only ${product?.totalStock} items left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px] text-muted-foreground">
              {product?.category}
            </span>
            <span className="text-[16px] text-muted-foreground">
              {product?.brand}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}>
              ${product?.price}
            </span>
            
            {product?.salePrice > 0 ? (
              <span className="text-lg font-semibold text-primary">
                ${product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
      
        <CardFooter className="flex flex-col gap-2 w-full">
          {product?.totalStock === 0 ? (
            <Button className="w-full opacity-60 cursor-not-allowed">
              Add to cart
            </Button>
          ) : (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleAddtoCart(product?._id, product?.totalStock);
              }}
              className="w-full"
            >
              Add to cart
            </Button>
          )}
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleTryOn}
          >
            Virtual Try On
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default ShoppingProductTile;