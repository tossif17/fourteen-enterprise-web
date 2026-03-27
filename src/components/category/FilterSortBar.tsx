import { useMemo } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { categories, brands, products } from "@/data/products";

interface FilterSortBarProps {
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
  itemCount: number;
  sortBy: string;
  setSortBy: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;

  selectedCategories: string[];
  setSelectedCategories: (cats: string[]) => void;

  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;

  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;

  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}

const priceRanges = [
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 - $200", min: 50, max: 200 },
  { label: "$200 - $500", min: 200, max: 500 },
  { label: "$500 - $1,000", min: 500, max: 1000 },
  { label: "Over $1,000", min: 1000, max: 10000 },
];

const FilterSortBar = ({
  filtersOpen,
  setFiltersOpen,
  itemCount,
  sortBy,
  setSortBy,
  searchQuery,
  setSearchQuery,
  selectedCategories,
  setSelectedCategories,
  selectedBrands,
  setSelectedBrands,
  selectedTypes,
  setSelectedTypes,
  priceRange,
  setPriceRange,
}: FilterSortBarProps) => {

  // ======================
  // Auto product types by selected brands
  // ======================
  const availableTypes = useMemo(() => {
    const filtered = selectedBrands.length
      ? products.filter(p => selectedBrands.includes(p.brand))
      : products;

    return [...new Set(filtered.map(p => p.type))];
  }, [selectedBrands]);

  // ======================
  // Toggle handlers
  // ======================
  const toggleCategory = (cat: string) => {
    setSelectedCategories(
      selectedCategories.includes(cat)
        ? selectedCategories.filter(c => c !== cat)
        : [...selectedCategories, cat]
    );
  };

  const toggleBrand = (brand: string) => {
    const updated = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];

    setSelectedBrands(updated);

    // reset types when brand changes
    setSelectedTypes([]);
  };

  const toggleType = (type: string) => {
    setSelectedTypes(
      selectedTypes.includes(type)
        ? selectedTypes.filter(t => t !== type)
        : [...selectedTypes, type]
    );
  };

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedTypes([]);
    setPriceRange([0, 10000]);
    setSearchQuery("");
  };

  const activeFilterCount =
    selectedCategories.length +
    selectedBrands.length +
    selectedTypes.length +
    (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0);

  return (
    <section className="w-full px-6 mb-8">
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 h-11 rounded-none bg-transparent"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex justify-between items-center border-b pb-4">
        <p className="text-sm text-muted-foreground">
          {itemCount} items
        </p>

        <div className="flex gap-4">
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 text-xs bg-foreground text-background px-1.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-80 overflow-y-auto">
              <SheetHeader className="mb-6">
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>

              <div className="space-y-8">

                {/* Category */}
                <div>
                  <h3 className="mb-3 text-sm">Category</h3>
                  {categories.map(cat => (
                    <div key={cat} className="flex items-center space-x-3 mb-2">
                      <Checkbox
                        checked={selectedCategories.includes(cat)}
                        onCheckedChange={() => toggleCategory(cat)}
                      />
                      <Label>{cat}</Label>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Brand */}
                <div>
                  <h3 className="mb-3 text-sm">Brand</h3>
                  {brands.map(brand => (
                    <div key={brand} className="flex items-center space-x-3 mb-2">
                      <Checkbox
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={() => toggleBrand(brand)}
                      />
                      <Label>{brand}</Label>
                    </div>
                  ))}
                </div>

                {/* Product Type */}
                {availableTypes.length > 0 && (
                  <>
                    <Separator />

                    <div>
                      <h3 className="mb-3 text-sm">Product Type</h3>
                      {availableTypes.map(type => (
                        <div key={type} className="flex items-center space-x-3 mb-2">
                          <Checkbox
                            checked={selectedTypes.includes(type)}
                            onCheckedChange={() => toggleType(type)}
                          />
                          <Label>{type}</Label>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <Separator />

                {/* Price */}
                <div>
                  <h3 className="mb-3 text-sm">Price</h3>
                  {priceRanges.map(range => (
                    <div key={range.label} className="flex items-center space-x-3 mb-2">
                      <Checkbox
                        checked={
                          priceRange[0] === range.min &&
                          priceRange[1] === range.max
                        }
                        onCheckedChange={(checked) =>
                          checked
                            ? setPriceRange([range.min, range.max])
                            : setPriceRange([0, 10000])
                        }
                      />
                      <Label>{range.label}</Label>
                    </div>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4"
                  onClick={clearAll}
                >
                  Clear All
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="border-none bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="name">Name A–Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
};

export default FilterSortBar;
