import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilters } from "@/store/filter-slice";
import { filterOptions } from "@/config";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import * as Slider from "@radix-ui/react-slider";
import * as Accordion from "@radix-ui/react-accordion";
import { Button } from "../ui/button";

function ProductFilter({ filters, handleFilter }) {
  const dispatch = useDispatch();
  const allFilters = useSelector((state) => state.filter?.list ?? []);
  const loading = useSelector((state) => state.filter?.status === "loading");

  const [priceInput, setPriceInput] = useState(filters?.price || [0, 649900]);

  useEffect(() => {
    dispatch(fetchFilters());
  }, [dispatch]);

  // Combine database filters with hardcoded filterOptions
  const combinedFilters = [...allFilters];
  
  // Add hardcoded filter options
  Object.entries(filterOptions).forEach(([type, options]) => {
    options.forEach(option => {
      combinedFilters.push({
        type,
        label: option.label,
        value: option.id
      });
    });
  });

  const groupedFilters = combinedFilters.reduce((acc, filter) => {
    if (!acc[filter.type]) acc[filter.type] = [];
    acc[filter.type].push(filter);
    return acc;
  }, {});

  const applyPriceFilter = () => {
    handleFilter("price", priceInput);
  };

  return (
    <div className="bg-background rounded-lg shadow-sm max-h-[80vh] overflow-y-auto p-4 sm:p-6">
      <div className="pb-4 border-b">
        <h2 className="text-lg sm:text-xl font-extrabold">Filters</h2>
      </div>

      {/* ✅ Price Slider */}
      <div className="space-y-3 mt-4">
        <h3 className="text-base font-bold">Price Range</h3>

        <div className="flex gap-2 items-center">
          <Input
            type="number"
            className="w-1/2"
            value={priceInput[0]}
            onChange={(e) =>
              setPriceInput([+e.target.value || 0, priceInput[1]])
            }
          />
          <span className="mx-1">–</span>
          <Input
            type="number"
            className="w-1/2"
            value={priceInput[1]}
            onChange={(e) =>
              setPriceInput([priceInput[0], +e.target.value || 0])
            }
          />
        </div>

        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-5"
          min={0}
          max={649900}
          step={100}
          value={priceInput}
          onValueChange={(val) => setPriceInput(val)}
        >
          <Slider.Track className="bg-muted-foreground relative grow rounded-full h-1">
            <Slider.Range className="absolute bg-orange-500 rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb className="block w-4 h-4 bg-orange-500 border-2 border-white rounded-full shadow hover:bg-orange-600 focus:outline-none" />
          <Slider.Thumb className="block w-4 h-4 bg-orange-500 border-2 border-white rounded-full shadow hover:bg-orange-600 focus:outline-none" />
        </Slider.Root>

        <Button size="sm" className="w-full" onClick={applyPriceFilter}>
          Apply Price Filter
        </Button>
      </div>

      <Separator className="my-4" />

      {/* ✅ Collapsible Filter Groups */}
      {loading ? (
        <p>Loading filters...</p>
      ) : (
        <Accordion.Root type="multiple" className="w-full space-y-2">
          {Object.entries(groupedFilters).map(([section, options]) => (
            <Accordion.Item value={section} key={section}>
              <Accordion.Header>
                <Accordion.Trigger className="text-left w-full text-base font-bold capitalize py-2">
                  {section}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content>
                <div className="grid gap-2 mt-2">
                  {options.map((option) => {
                    const isChecked =
                      filters?.[section]?.includes(option.value) || false;

                    return (
                      <Label
                        key={option.value}
                        className="flex font-medium items-center gap-2"
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() =>
                            handleFilter(section, option.value)
                          }
                        />
                        {option.label}
                      </Label>
                    );
                  })}
                </div>
              </Accordion.Content>
              <Separator className="my-2" />
            </Accordion.Item>
          ))}
        </Accordion.Root>
      )}
    </div>
  );
}

export default ProductFilter;
