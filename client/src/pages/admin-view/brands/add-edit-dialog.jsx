import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addNewBrand, editBrand } from "@/store/admin/brands-slice";
import { useToast } from "@/components/ui/use-toast";

export default function AddEditBrandDialog({ open, onOpenChange, brand, onClose }) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    description: "",
  });

  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name,
        icon: brand.icon,
        description: brand.description,
      });
    } else {
      setFormData({
        name: "",
        icon: "",
        description: "",
      });
    }
  }, [brand]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (brand) {
        await dispatch(editBrand({ id: brand._id, formData })).unwrap();
        toast({
          title: "Success",
          description: "Brand updated successfully",
        });
      } else {
        await dispatch(addNewBrand(formData)).unwrap();
        toast({
          title: "Success",
          description: "Brand added successfully",
        });
      }
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: brand ? "Failed to update brand" : "Failed to add brand",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{brand ? "Edit Brand" : "Add New Brand"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Icon</label>
            <Input
              value={formData.icon}
              onChange={(e) =>
                setFormData({ ...formData, icon: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{brand ? "Update" : "Add"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 