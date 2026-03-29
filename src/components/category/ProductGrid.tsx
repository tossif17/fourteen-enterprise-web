import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Product } from "@/data/products";

interface ProductGridProps {
  products: Product[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = memo(({ product }: ProductCardProps) => {
  const mainImage = product.image;
  const hoverImage = product.hoverImage?.trim() ? product.hoverImage : null;

  return (
    <Link to={`/product/${product.id}`} className="block">
      <Card className="border-0 bg-transparent shadow-none">
        <CardContent className="p-0">
          {/* Image wrapper — hover only scoped here */}
          <div className="group mb-3">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-[#f7f7f7]">
              <img
                src={mainImage}
                alt={product.name}
                loading="lazy"
                decoding="async"
                draggable={false}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                  hoverImage ? "group-hover:opacity-0" : "opacity-100"
                }`}
              />

              {hoverImage && (
                <img
                  src={hoverImage}
                  alt={`${product.name} hover`}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              )}

              {/* Badges */}
              <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
                {product.oldPrice && (
                  <span className="rounded-md bg-[#1a5c3a] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                    Sale
                  </span>
                )}
                {product.isNew && (
                  <span className="rounded-md bg-black px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                    New
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Text info — outside group, no hover effect on image */}
          <div className="space-y-1">
            <h3 className="line-clamp-2 text-sm font-medium leading-tight text-foreground">
              {product.name}
            </h3>

            <div className="flex items-center gap-2">
              {product.oldPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  ${product.oldPrice.toFixed(2)}
                </span>
              )}
              <span className="text-sm font-semibold text-foreground">
                ${product.price.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});

ProductCard.displayName = "ProductCard";

const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <section className="mb-16 w-full px-4 sm:px-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;