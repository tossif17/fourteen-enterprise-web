import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { products as allProducts } from "@/data/products";

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  type: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  hover_image?: string;
  hoverImage?: string;
  images?: string[];
  isNew?: boolean;
  is_new?: boolean;
}

interface ProductCarouselProps {
  currentProduct?: Product;
  mode?: "related" | "same-category";
  title?: string;
}

const ProductCard = memo(({ product }: { product: Product }) => {
  const isOnSale =
    typeof product.oldPrice === "number" && product.oldPrice > product.price;

  const isNewProduct = product.isNew || product.is_new;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block"
      aria-label={`View ${product.name}`}
    >
      <div className="relative mb-3 overflow-hidden rounded-xl bg-[#f7f7f7] aspect-square">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />

        <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
          {isOnSale && (
            <span className="bg-[#1a5c3a] px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.14em] text-white">
              Sale
            </span>
          )}

          {isNewProduct && (
            <span className="bg-[#1a1a2e] px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.14em] text-[#e8c96d]">
              New
            </span>
          )}
        </div>
      </div>

      <div className="space-y-1 px-0.5">
        <p className="text-[10px] font-normal uppercase tracking-[0.12em] text-muted-foreground">
          {product.brand}
        </p>

        <h3 className="line-clamp-2 min-h-[2.4rem] text-xs leading-snug text-foreground">
          {product.name}
        </h3>

        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          {isOnSale && (
            <span className="text-[11px] text-muted-foreground line-through">
              ${product.oldPrice!.toFixed(2)}
            </span>
          )}

          <span className="text-xs text-foreground">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = "ProductCard";

const ProductCarousel = ({
  currentProduct,
  mode = "related",
  title,
}: ProductCarouselProps) => {
  const filtered = useMemo(() => {
    if (!currentProduct) {
      return allProducts.filter((p) => p.isNew || p.isNew).slice(0, 20);
    }

    if (mode === "related") {
      const results = allProducts.filter(
        (p) =>
          p.id !== currentProduct.id &&
          (p.brand === currentProduct.brand ||
            p.type === currentProduct.type ||
            p.category === currentProduct.category)
      );

      return results
        .sort((a, b) => {
          const scoreA =
            (a.brand === currentProduct.brand ? 3 : 0) +
            (a.type === currentProduct.type ? 2 : 0) +
            (a.category === currentProduct.category ? 1 : 0);

          const scoreB =
            (b.brand === currentProduct.brand ? 3 : 0) +
            (b.type === currentProduct.type ? 2 : 0) +
            (b.category === currentProduct.category ? 1 : 0);

          return scoreB - scoreA;
        })
        .slice(0, 12);
    }

    if (mode === "same-category") {
      const results = allProducts.filter(
        (p) =>
          p.id !== currentProduct.id &&
          p.category === currentProduct.category
      );

      return results
        .sort((a, b) => {
          if (
            a.brand === currentProduct.brand &&
            b.brand !== currentProduct.brand
          )
            return -1;
          if (
            b.brand === currentProduct.brand &&
            a.brand !== currentProduct.brand
          )
            return 1;
          return 0;
        })
        .slice(0, 12);
    }

    return [];
  }, [currentProduct, mode]);

  if (filtered.length === 0) return null;

  return (
    <section className="w-full mb-16 px-4 sm:px-6">
      {title && (
        <p className="mb-4 text-sm font-light text-foreground">{title}</p>
      )}

      <div className="grid grid-cols-3 gap-x-3 gap-y-6 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-4 xl:gap-y-8">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductCarousel;