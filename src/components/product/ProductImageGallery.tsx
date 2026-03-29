import { useState, useEffect } from "react";

interface ProductImageGalleryProps {
  images: string[];
}

const ProductImageGallery = ({ images }: ProductImageGalleryProps) => {
  const [activeImage, setActiveImage] = useState(images[0]);
  const [zoomStyle, setZoomStyle] = useState({
    transform: "scale(1)",
    transformOrigin: "center",
  });

  useEffect(() => {
    setActiveImage(images[0]);
  }, [images]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) return;

    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      transform: "scale(2)",
      transformOrigin: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transform: "scale(1)",
      transformOrigin: "center",
    });
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-4 md:gap-5 items-start">
        {/* Main image first on mobile */}
        <div
          className="order-1 md:order-2 w-full md:w-[420px] aspect-square overflow-hidden rounded-xl border border-border bg-white cursor-default md:cursor-zoom-in"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={activeImage}
            alt="Product"
            style={zoomStyle}
            className="h-full w-full object-cover transition-transform duration-200"
            draggable={false}
          />
        </div>

        {/* Thumbnails below on mobile, left on desktop */}
        <div className="order-2 md:order-1 w-full md:w-auto">
          <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-1 md:pb-0">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImage(img)}
                className={`shrink-0 h-20 w-20 overflow-hidden rounded-lg border transition-all duration-200 bg-white ${
                  activeImage === img
                    ? "border-foreground ring-1 ring-foreground"
                    : "border-border hover:border-foreground/40"
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${i + 1}`}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;