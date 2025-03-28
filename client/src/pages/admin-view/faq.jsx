import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus } from "lucide-react";
import axios from 'axios';

const FaqAdmin = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [faqData, setFaqData] = useState({ categories: [] });

  const fetchFaqData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/api/faq', {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (response.data) {
        setFaqData(response.data);
      }
    } catch (error) {
      console.error('Error fetching FAQ data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch FAQ data"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqData();
  }, []);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await axios.put('http://localhost:5000/api/faq', faqData, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      toast({
        title: "Success",
        description: "FAQ updated successfully"
      });
    } catch (error) {
      console.error('Error updating FAQ:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update FAQ"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addCategory = () => {
    setFaqData(prev => ({
      ...prev,
      categories: [...prev.categories, { name: '', faqs: [] }]
    }));
  };

  const addFaq = (categoryIndex) => {
    const newCategories = [...faqData.categories];
    newCategories[categoryIndex].faqs.push({ question: '', answer: '' });
    setFaqData({ ...faqData, categories: newCategories });
  };

  const deleteCategory = async (index) => {
    try {
      setIsLoading(true);
      const newCategories = [...faqData.categories];
      newCategories.splice(index, 1);
      const updatedData = { ...faqData, categories: newCategories };
      
      const response = await axios.put('http://localhost:5000/api/faq', updatedData, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data) {
        setFaqData(updatedData);
        toast({
          title: "Success",
          description: "Category deleted successfully"
        });
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete category"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFaq = async (categoryIndex, faqIndex) => {
    try {
      setIsLoading(true);
      const newCategories = [...faqData.categories];
      newCategories[categoryIndex].faqs.splice(faqIndex, 1);
      const updatedData = { ...faqData, categories: newCategories };
      
      const response = await axios.put('http://localhost:5000/api/faq', updatedData, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data) {
        setFaqData(updatedData);
        toast({
          title: "Success",
          description: "FAQ deleted successfully"
        });
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete FAQ"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage FAQ</h1>
        <Button onClick={addCategory}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {faqData.categories.map((category, categoryIndex) => (
        <Card key={categoryIndex} className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">Category {categoryIndex + 1}</CardTitle>
            <Button variant="destructive" size="icon" onClick={() => deleteCategory(categoryIndex)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category Name</label>
              <Input
                value={category.name}
                onChange={(e) => {
                  const newCategories = [...faqData.categories];
                  newCategories[categoryIndex].name = e.target.value;
                  setFaqData({ ...faqData, categories: newCategories });
                }}
                placeholder="Enter category name"
              />
            </div>

            {category.faqs.map((faq, faqIndex) => (
              <div key={faqIndex} className="space-y-2 border-t pt-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">FAQ {faqIndex + 1}</h3>
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => deleteFaq(categoryIndex, faqIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  value={faq.question}
                  onChange={(e) => {
                    const newCategories = [...faqData.categories];
                    newCategories[categoryIndex].faqs[faqIndex].question = e.target.value;
                    setFaqData({ ...faqData, categories: newCategories });
                  }}
                  placeholder="Enter question"
                />
                <Textarea
                  value={faq.answer}
                  onChange={(e) => {
                    const newCategories = [...faqData.categories];
                    newCategories[categoryIndex].faqs[faqIndex].answer = e.target.value;
                    setFaqData({ ...faqData, categories: newCategories });
                  }}
                  placeholder="Enter answer"
                  rows={4}
                />
              </div>
            ))}

            <Button 
              variant="outline" 
              onClick={() => addFaq(categoryIndex)}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add FAQ
            </Button>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          className="w-full md:w-auto"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default FaqAdmin; 