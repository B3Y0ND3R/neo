import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setProductDetails } from "@/store/shop/products-slice";

export default function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
  handleEdit,
  handleGetProductDetails,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg cursor-pointer"
            onClick={() => handleGetProductDetails(product._id)}
          />
        </div>
        <CardContent>
          <h2 
            className="text-xl font-bold mb-2 mt-2 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Clear product details to prevent modal from showing when navigating back
              dispatch(setProductDetails());
              navigate(`/admin/product/${product?._id}`);
            }}
          >
            {product?.title}
          </h2>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-bold">${product?.salePrice}</span>
            ) : null}
          </div>
          
          {/* Size Availability */}
          <div className="mb-2">
            <p className="text-sm font-medium text-gray-700 mb-1">
              Available Sizes (Total: {product?.totalStock || 0}):
            </p>
            <div className="flex flex-wrap gap-1">
              {Object.entries(product?.sizes || {}).map(([size, stock]) => (
                <span
                  key={size}
                  className={`px-2 py-1 text-xs rounded ${
                    stock > 0 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}
                >
                  {size}: {stock}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product?._id);
              setFormData(product);
            }}
          >
            Edit
          </Button>
          <Button onClick={() => handleDelete(product?._id)}>Delete</Button>
        </CardFooter>
      </div>
    </Card>
  );
}