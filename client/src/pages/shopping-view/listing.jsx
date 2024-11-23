import ProductFilter from "@/components/shopping-view/filter";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
//import ProductDetailsDialog from "@/components/shopping-view/product-details";
//import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { sortOptions } from "@/config";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
//import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
//import {
//  fetchAllFilteredProducts,
//  fetchProductDetails,
//} from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
function ShoppingListing(){

 const dispatch = useDispatch();
 const { productList } = useSelector(state=> state.shopProducts);

useEffect(() => {
 dispatch(fetchAllFilteredProducts())
},[dispatch])

console.log(productList,"productList"); 

    return (
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
            <ProductFilter />
            <div className="bg-background w-full rounded-lg shadow-sm">
                       <div className="p-4 border-b flex items-center justify-between">
                          <h2 className="text-lg font-extrabold ">All Products</h2>
                          <div className="flex items-center gap-3">
                             <span className="text-muted-foreground">
                               10 products
                             </span>
                             <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="flex items-center gap-1 ">
                                <ArrowUpDownIcon className="h-4 w-4"/>
                                <span>Sort By</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                                <DropdownMenuRadioGroup>
                                    {
                                        sortOptions.map(sortItem =>(<DropdownMenuRadioItem key={sortItem.id}>
                                           {sortItem.label}
                                        </DropdownMenuRadioItem>))
                                    }
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          </div>
                         
                       </div>
                       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                           {
                              productList && productList.length > 0 ? ( productList.map(productItem => <ShoppingProductTile product={productItem}/>)) : null
                           }
                       </div>
            </div>
            </div>
    )
}

export default ShoppingListing;