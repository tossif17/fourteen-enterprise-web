import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Product } from "@/data/products";

interface ProductGridProps {
  products: Product[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();

  const galleryImages = useMemo(() => {
    const baseImages =
      product.images && product.images.length > 0
        ? product.images
        : [product.image];

    return [...new Set(baseImages.filter(Boolean))];
  }, [product.images, product.image]);

  const defaultImage = galleryImages[0] || product.image;
  const hasHoverImage = !!product.hoverImage?.trim();

  const [selectedImage, setSelectedImage] = useState(defaultImage);
  const [hoveredThumb, setHoveredThumb] = useState<string | null>(null);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [thumbsInteractive, setThumbsInteractive] = useState(false);

  useEffect(() => {
    setSelectedImage(defaultImage);
    setHoveredThumb(null);
  }, [defaultImage]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (isCardHovered) {
      setThumbsInteractive(false);
      timer = setTimeout(() => {
        setThumbsInteractive(true);
      }, 160);
    } else {
      setThumbsInteractive(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isCardHovered]);

  const displayImage = hoveredThumb
    ? hoveredThumb
    : isCardHovered && hasHoverImage
    ? product.hoverImage!
    : selectedImage;

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleCardLeave = () => {
    setIsCardHovered(false);
    setHoveredThumb(null);
    setSelectedImage(defaultImage);
  };

  return (
    <Card
      className="group cursor-pointer border-0 bg-transparent shadow-none"
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={handleCardLeave}
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        <div className="mb-3">
          <div className="relative aspect-square overflow-hidden bg-muted/10">
            <img
              src={displayImage}
              alt={product.name}
              className="h-full w-full object-cover transition-all duration-300 ease-out group-hover:scale-[1.02]"
              draggable={false}
            />

            <div className="pointer-events-none absolute inset-0 bg-black/[0.02] transition-opacity duration-300 group-hover:bg-black/[0.04]" />

            {product.oldPrice && (
              <div className="absolute left-3 top-3 z-20 bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-black shadow-sm">
                Sale
              </div>
            )}

            {galleryImages.length > 1 && (
              <div
                className={`absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/92 px-2 py-2 shadow-lg backdrop-blur-md transition-all duration-300 ease-out ${
                  isCardHovered
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                } ${
                  isCardHovered && thumbsInteractive
                    ? "pointer-events-auto"
                    : "pointer-events-none"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {galleryImages.map((img, index) => {
                  const isActive =
                    hoveredThumb === img ||
                    (!hoveredThumb && selectedImage === img);

                  return (
                    <button
                      key={`${product.id}-${index}`}
                      type="button"
                      onMouseEnter={() => {
                        if (!thumbsInteractive) return;
                        setHoveredThumb(img);
                      }}
                      onMouseLeave={() => {
                        if (!thumbsInteractive) return;
                        setSelectedImage(img);
                        setHoveredThumb(null);
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => e.preventDefault()}
                      className={`relative h-11 w-11 overflow-hidden rounded-md border transition-all duration-200 ease-out ${
                        isActive
                          ? "scale-105 border-black shadow-sm"
                          : "border-black/10 hover:scale-105 hover:border-black/40"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="h-full w-full object-cover"
                        draggable={false}
                      />

                      <span
                        className={`absolute inset-0 transition-opacity duration-200 ${
                          isActive
                            ? "bg-transparent"
                            : "bg-black/0 hover:bg-black/[0.03]"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Link
            to={`/product/${product.id}`}
            onClick={(e) => e.stopPropagation()}
            className="block"
          >
            <h3 className="line-clamp-2 text-sm font-medium leading-tight text-foreground transition-opacity duration-200 hover:opacity-70">
              {product.name}
            </h3>
          </Link>

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
  );
};

const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <section className="mb-16 w-full px-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;