import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
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
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { fetchProductDetails } from "@/store/shop/products-slice";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { productList } = useSelector((state) => state.adminProducts);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { brandList } = useSelector((state) => state.adminBrands);
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchAllBrands());
  }, [dispatch]);

  function onSubmit(event) {
    event.preventDefault();

    if (currentEditedId !== null) {
      // Editing existing product
      const updatedFormData = {
        ...formData,
        image: uploadedImageUrl || formData.image // Use new image if uploaded, else keep existing
      };

      dispatch(
        editProduct({
          id: currentEditedId,
          formData: updatedFormData,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setFormData(initialFormData);
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setImageFile(null);
          setUploadedImageUrl("");
          toast({
            title: "Product updated successfully",
          });
        }
      });
    } else {
      dispatch(
        addNewProduct({
          ...formData,
          image: uploadedImageUrl,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setOpenCreateProductsDialog(false);
          setImageFile(null);
          setFormData(initialFormData);
          toast({
            title: "Product added successfully",
          });
        }
      });
    }
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((currentKey) => currentKey !== "averageReview")
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  const formElements = getProductFormElements(brandList);

  const handleEdit = (productItem) => {
    setFormData({
      ...productItem,
      category: productItem.category,
      brand: productItem.brand,
    });
    setCurrentEditedId(productItem._id);
    setUploadedImageUrl(""); // Reset uploaded image URL
    setImageFile(null); // Reset image file
    setOpenCreateProductsDialog(true);
  };

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
    setOpenDetailsDialog(true);
  }

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
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
          : null}
      </div>
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
          setCurrentEditedId(null);
          setFormData(initialFormData);
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
              buttonText={"Add"}
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