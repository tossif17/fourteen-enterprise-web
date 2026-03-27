import { useState } from "react";

interface ProductImageGalleryProps {
  images: string[];
}

const ProductImageGallery = ({ images }: ProductImageGalleryProps) => {
  const [activeImage, setActiveImage] = useState(images[0]);
  const [zoomStyle, setZoomStyle] = useState({
    transform: "scale(1)",
    transformOrigin: "center",
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
    <div className="flex justify-center items-center gap-4">

      {/* Thumbnails */}
      <div className="flex flex-col gap-3">
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => setActiveImage(img)}
            className={`w-20 h-20 border rounded cursor-pointer overflow-hidden
              ${activeImage === img ? "border-black" : "border-border"}`}
          >
            <img
              src={img}
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
        ))}
      </div>

      {/* Main zoom image */}
      <div
        className="w-[420px] h-[420px] overflow-hidden border rounded cursor-zoom-in"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={activeImage}
          style={zoomStyle}
          className="w-full h-full object-cover transition-transform duration-200"
          alt=""
        />
      </div>
    </div>
  );
};

export default ProductImageGallery;
