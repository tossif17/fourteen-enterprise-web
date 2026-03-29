import { useMemo } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import ProductGrid from "../../components/category/ProductGrid";
import { products as allProducts } from "@/data/products";

const FeatureProducts = () => {
  const { category } = useParams<{ category?: string }>();

  const filteredProducts = useMemo(() => {
    let result = allProducts;

    if (category) {
      result = result.filter(
        (p) =>
          p.brand.toLowerCase() === category.toLowerCase() ||
          p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // ✅ Only show 6
    return result.slice(0, 8);
  }, [category]);

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-10 px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-900">FEATURED PRODUCTS</h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            High-Performance Solutions for Marine & Industrial Automation
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <p className="text-center text-gray-500 mt-10">
            No products found.
          </p>
        )}
      </main>
    </div>
  );
};

export default FeatureProducts;