import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { getProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { fetchAllBrands } from "@/store/admin/brands-slice";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import AdminProductTile from "@/components/admin-view/product-tile";
import ProductImageUpload from "@/components/admin-view/image-upload";
import CommonForm from "@/components/common/form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { fetchProductDetails } from "@/store/shop/products-slice";
import socketManager from "@/utils/socket";

const getInitialFormData = () => ({
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  averageReview: 0,
  color: "",
  gender: "",
  sizes: {
    XS: 0,
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0
  }
});

const genders = ["men", "women", "kids"];
const PRODUCTS_PER_PAGE = 20;

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(getInitialFormData());
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(genders[0]);

  // page tracking per gender
  const [pagination, setPagination] = useState({
    men: 1,
    women: 1,
    kids: 1,
  });

  const { productList } = useSelector((state) => state.adminProducts);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { brandList } = useSelector((state) => state.adminBrands);
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchAllBrands());
    
    // Connect to socket and join admin room for real-time updates
    const socket = socketManager.connect();
    socketManager.joinAdminRoom();
    
    // Listen for stock updates
    socketManager.onStockUpdate((data) => {
      console.log('Stock update received:', data);
      // Update the product list with new stock data
      dispatch(fetchAllProducts());
      // Show toast notification for real-time update
      toast({
        title: "Stock Updated",
        description: `Product stock has been updated in real-time`,
        duration: 3000,
      });
    });
    
    // Cleanup on unmount
    return () => {
      socketManager.leaveAdminRoom();
      socketManager.offStockUpdate();
    };
  }, [dispatch]);

  function onSubmit(event) {
    event.preventDefault();

    if (currentEditedId !== null) {
      // For editing, pass the image file and old image URL
      const oldImageUrl = formData.image; // Current image URL before edit
      
      dispatch(editProduct({ 
        id: currentEditedId, 
        formData: formData,
        imageFile: imageFile, // New image file (if any)
        oldImageUrl: oldImageUrl // Old image URL for deletion
      })).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          resetForm();
          toast({ title: "Product updated successfully" });
        }
      });
    } else {
      // For new products, use the uploaded image URL
      dispatch(addNewProduct({ ...formData, image: uploadedImageUrl })).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          resetForm();
          toast({ title: "Product added successfully" });
        }
      });
    }
  }

  function resetForm() {
    setFormData(getInitialFormData());
    setOpenCreateProductsDialog(false);
    setCurrentEditedId(null);
    setImageFile(null);
    setUploadedImageUrl("");
  }

  function handleDelete(id) {
    dispatch(deleteProduct(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((key) => key !== "averageReview")
      .every((key) => formData[key] !== "");
  }

  const formElements = getProductFormElements(brandList);

  const handleEdit = (productItem) => {
    setFormData({
      ...productItem,
      category: productItem.category,
      brand: productItem.brand,
    });
    setCurrentEditedId(productItem._id);
    setUploadedImageUrl("");
    setImageFile(null);
    setOpenCreateProductsDialog(true);
  };

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
    setOpenDetailsDialog(true);
  }

  const handlePageChange = (gender, direction) => {
    setPagination((prev) => ({
      ...prev,
      [gender]: Math.max(1, prev[gender] + direction),
    }));
  };

  return (
    <Fragment>
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val)}>
        <TabsList className="mb-4 overflow-x-auto flex space-x-2">
          {genders.map((gender) => (
            <TabsTrigger key={gender} value={gender}>
              {gender.charAt(0).toUpperCase() + gender.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        {genders.map((gender) => {
          const genderProducts = productList?.filter((p) => p.gender === gender) || [];
          const currentPage = pagination[gender];
          const totalPages = Math.ceil(genderProducts.length / PRODUCTS_PER_PAGE);
          const paginatedProducts = genderProducts.slice(
            (currentPage - 1) * PRODUCTS_PER_PAGE,
            currentPage * PRODUCTS_PER_PAGE
          );

          return (
            <TabsContent key={gender} value={gender}>
              <div className="mb-5 w-full flex justify-end">
                <Button onClick={() => setOpenCreateProductsDialog(true)}>
                  Add New Product
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((productItem) => (
                    <AdminProductTile
                      key={productItem._id}
                      setFormData={setFormData}
                      setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                      setCurrentEditedId={setCurrentEditedId}
                      product={productItem}
                      handleDelete={handleDelete}
                      handleEdit={handleEdit}
                      handleGetProductDetails={handleGetProductDetails}
                    />
                  ))
                ) : (
                  <p className="text-center col-span-full text-muted-foreground">
                    No products found for "{gender}"
                  </p>
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(gender, -1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm font-medium mt-1">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(gender, 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
        isAdmin={true}
      />

      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          resetForm();
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>

          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />

          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Update" : "Add"}
              formControls={formElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
