import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilters, addFilter, deleteFilter } from "@/store/filter-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const FilterManage = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const filters = useSelector((state) => state.filter.list || []);
  const status = useSelector((state) => state.filter.status);
  const error = useSelector((state) => state.filter.error);

  const [formData, setFormData] = useState({
    type: "category",
    label: "",
    value: "",
  });

  const [activeTab, setActiveTab] = useState("add");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchFilters());
    }
  }, [dispatch, status]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.label || !formData.value) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill all fields before submitting.",
      });
      return;
    }
    dispatch(addFilter(formData));
    setFormData({ type: "category", label: "", value: "" });
    toast({
      title: "Success",
      description: "Filter added successfully",
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this filter?")) {
      dispatch(deleteFilter(id));
    }
  };

  const uniqueTypes = [...new Set(filters.map((f) => f.type))];

  if (status === "loading") return <p>Loading filters...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Manage Filters</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="relative">
          <TabsList className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-rounded-md scrollbar-thumb-gray-400 flex gap-1 md:gap-2 min-w-0">
            <TabsTrigger 
              value="add" 
              className="whitespace-nowrap flex-shrink-0 text-xs md:text-sm px-2 md:px-3"
            >
              Add New Filter
            </TabsTrigger>
            {uniqueTypes.map((type) => (
              <TabsTrigger 
                key={type} 
                value={type} 
                className="capitalize whitespace-nowrap flex-shrink-0 text-xs md:text-sm px-2 md:px-3"
              >
                {type}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Add New Filter Form Tab */}
        <TabsContent value="add" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Filter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-w-xl">
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                  >
                    <option value="category">Category</option>
                    <option value="color">Color</option>
                    <option value="gender">Gender</option>
                    <option value="brand">Brand</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Label (Display)</label>
                  <Input
                    type="text"
                    name="label"
                    value={formData.label}
                    onChange={handleChange}
                    placeholder="e.g. Puma, Red, Men"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Value (Stored)</label>
                  <Input
                    type="text"
                    name="value"
                    value={formData.value}
                    onChange={handleChange}
                    placeholder="e.g. puma, red, men"
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" className="w-full md:w-auto">
                    Add Filter
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Filter Lists Tabs */}
        {uniqueTypes.map((type) => (
          <TabsContent key={type} value={type} className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{type} Filters</CardTitle>
              </CardHeader>
              <CardContent>
                {filters.filter((f) => f.type === type).length === 0 ? (
                  <p className="text-muted-foreground">No {type} filters found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 rounded-md overflow-hidden">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-2 md:px-4 py-2 text-left font-semibold text-xs md:text-sm">Label</th>
                          <th className="px-2 md:px-4 py-2 text-left font-semibold text-xs md:text-sm">Value</th>
                          <th className="px-2 md:px-4 py-2 text-left font-semibold text-xs md:text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filters
                          .filter((f) => f.type === type)
                          .map((filter) => (
                            <tr
                              key={filter._id}
                              className="hover:bg-muted transition-colors"
                            >
                              <td className="px-2 md:px-4 py-2 font-medium text-xs md:text-sm">{filter.label}</td>
                              <td className="px-2 md:px-4 py-2 text-muted-foreground text-xs md:text-sm">{filter.value}</td>
                              <td className="px-2 md:px-4 py-2">
                                <Button
                                  size="icon"
                                  variant="destructive"
                                  onClick={() => handleDelete(filter._id)}
                                  className="h-7 w-7 md:h-8 md:w-8"
                                >
                                  <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default FilterManage;
