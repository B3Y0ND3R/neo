import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllBrands,
  deleteBrand,
} from "@/store/admin/brands-slice";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import AddEditBrandDialog from "./brands/add-edit-dialog";
import { useToast } from "@/components/ui/use-toast";
import * as Icons from "lucide-react";

export default function AdminBrands() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { brandList, isLoading } = useSelector((state) => state.adminBrands);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  useEffect(() => {
    dispatch(fetchAllBrands());
  }, [dispatch]);

  const handleEdit = (brand) => {
    setSelectedBrand(brand);
    setShowAddDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      try {
        await dispatch(deleteBrand(id)).unwrap();
        toast({
          title: "Success",
          description: "Brand deleted successfully",
        });
        // Refresh the brands list after deletion
        dispatch(fetchAllBrands());
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete brand",
        });
      }
    }
  };

  // Function to render dynamic icon
  const renderIcon = (iconName) => {
    const Icon = Icons[iconName];
    return Icon ? <Icon className="h-5 w-5" /> : null;
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Brands Management</h1>
        <Button onClick={() => setShowAddDialog(true)}>Add New Brand</Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brandList.map((brand) => (
            <div
              key={brand._id}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {renderIcon(brand.icon)}
                  <h3 className="text-lg font-semibold">{brand.name}</h3>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(brand)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(brand._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{brand.description}</p>
            </div>
          ))}
        </div>
      )}

      <AddEditBrandDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        brand={selectedBrand}
        onClose={() => {
          setSelectedBrand(null);
          setShowAddDialog(false);
          dispatch(fetchAllBrands());
        }}
      />
    </div>
  );
}