import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setProductDetails } from "@/store/shop/products-slice";
import { useState } from "react";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedSizes, setSelectedSizes] = useState({}); // {size: quantity}



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
          <h2 
            className="text-xl font-bold mb-2 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Clear product details to prevent modal from showing when navigating back
              dispatch(setProductDetails());
              navigate(`/product/${product?._id}`);
            }}
          >
            {product?.title}
          </h2>
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
          
          {/* Size Selection */}
          <div className="mb-2">
            <p className="text-sm font-medium text-gray-700 mb-1">
              Select Sizes & Quantities:
            </p>
            <div className="flex flex-wrap gap-1">
              {Object.entries(product?.sizes || {}).map(([size, stock]) => (
                <div key={size} className="flex flex-col items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSizes(prev => {
                        const newSizes = { ...prev };
                        if (newSizes[size]) {
                          delete newSizes[size];
                        } else {
                          newSizes[size] = 1;
                        }
                        return newSizes;
                      });
                    }}
                    className={`px-2 py-1 text-xs rounded border transition-colors ${
                      stock > 0 
                        ? selectedSizes[size]
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed'
                    }`}
                    disabled={stock === 0}
                  >
                    {size} ({stock})
                  </button>
                  {selectedSizes[size] && stock > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSizes(prev => ({
                            ...prev,
                            [size]: Math.max(1, (prev[size] || 1) - 1)
                          }));
                        }}
                        className="w-4 h-4 text-xs bg-gray-200 rounded hover:bg-gray-300"
                        disabled={selectedSizes[size] <= 1}
                      >
                        -
                      </button>
                      <span className="text-xs w-4 text-center">{selectedSizes[size]}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSizes(prev => ({
                            ...prev,
                            [size]: Math.min(stock, (prev[size] || 1) + 1)
                          }));
                        }}
                        className="w-4 h-4 text-xs bg-gray-200 rounded hover:bg-gray-300"
                        disabled={selectedSizes[size] >= stock}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {Object.keys(selectedSizes).length > 0 && (
              <div className="text-xs text-blue-600 mt-1">
                Selected: {Object.entries(selectedSizes).map(([size, qty]) => `${size}(${qty})`).join(', ')}
              </div>
            )}
          </div>
        </CardContent>
      
        <CardFooter className="flex flex-col gap-2 w-full">
          {product?.totalStock === 0 ? (
            <Button className="w-full opacity-60 cursor-not-allowed">
              Out of Stock
            </Button>
          ) : Object.keys(selectedSizes).length === 0 ? (
            <Button className="w-full opacity-60 cursor-not-allowed">
              Please Select Sizes
            </Button>
          ) : (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleAddtoCart(product?._id, selectedSizes);
              }}
              className="w-full"
            >
              Add to Cart - {Object.entries(selectedSizes).map(([size, qty]) => `${size}(${qty})`).join(', ')}
            </Button>
          )}

        </CardFooter>
      </div>
    </Card>
  );
}

export default ShoppingProductTile;