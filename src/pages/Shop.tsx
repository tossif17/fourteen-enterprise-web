import { useState, useMemo } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import CategoryHeader from "../components/category/CategoryHeader";
import FilterSortBar from "../components/category/FilterSortBar";
import ProductGrid from "../components/category/ProductGrid";
import { products as allProducts } from "@/data/products";

const Shop = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // ✅ Infinite price range
  const [priceRange, setPriceRange] = useState<[number, number]>([0, Infinity]);

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // =====================
    // SEARCH
    // =====================
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // =====================
    // CATEGORY
    // =====================
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.category)
      );
    }

    // =====================
    // BRAND
    // =====================
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) =>
        selectedBrands.includes(p.brand)
      );
    }

    // =====================
    // TYPE
    // =====================
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((p) =>
        selectedTypes.includes(p.type)
      );
    }

    // =====================
    // PRICE (INFINITE SAFE)
    // =====================
    filtered = filtered.filter(
      (p) =>
        p.price >= priceRange[0] &&
        (priceRange[1] === Infinity || p.price <= priceRange[1])
    );

    // =====================
    // SORTING
    // =====================
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;

      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case "newest":
        filtered.sort(
          (a, b) => Number(b.isNew) - Number(a.isNew)
        );
        break;

      default:
        break;
    }

    return filtered;
  }, [
    searchQuery,
    selectedCategories,
    selectedBrands,
    selectedTypes,
    priceRange,
    sortBy,
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-6 mt-16">
       <CategoryHeader
  category="Shop"
  selectedCategories={selectedCategories}
  onCategoryClick={(cat) => {
    if (cat === "all") {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(
        selectedCategories.includes(cat)
          ? selectedCategories.filter((c) => c !== cat)
          : [...selectedCategories, cat]
      );
    }
  }}
/>

        <FilterSortBar
          filtersOpen={filtersOpen}
          setFiltersOpen={setFiltersOpen}
          itemCount={filteredProducts.length}
          sortBy={sortBy}
          setSortBy={setSortBy}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedBrands={selectedBrands}
          setSelectedBrands={setSelectedBrands}
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />

        {/* ✅ FINAL OUTPUT */}
        <ProductGrid products={filteredProducts} />
      </main>

      <Footer />
    </div>
  );
};

export default Shop;