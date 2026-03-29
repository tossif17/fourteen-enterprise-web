import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  type: string;
  description: string;
  price: number;
  old_price?: number;
  image: string;
  hover_image?: string;
  images?: string[];
  is_new?: boolean;
}

interface ProductInfoProps {
  product: Product;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const discount = product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : null;

  return (
    <div className="space-y-6">

      {/* Desktop breadcrumb */}
      <div className="hidden lg:block">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/shop">{product.category}</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2">
        {product.is_new && (
          <span className="px-2 py-1 text-[10px] uppercase tracking-[0.14em] bg-[#1a1a2e] text-[#e8c96d] font-medium">
            New
          </span>
        )}
        {product.old_price && product.old_price > product.price && (
          <span className="px-2 py-1 text-[10px] uppercase tracking-[0.14em] bg-[#1a5c3a] text-white font-medium">
            Sale
          </span>
        )}
        <span className="px-2 py-1 text-[10px] uppercase tracking-[0.14em] border border-border/40 text-muted-foreground">
          {product.type}
        </span>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
          {product.brand}
        </p>
        <h1 className="text-2xl md:text-3xl font-light text-foreground leading-snug">
          {product.name}
        </h1>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        {product.old_price && product.old_price > product.price && (
          <span className="text-sm text-muted-foreground line-through">
            ${product.old_price.toFixed(2)}
          </span>
        )}
        <span className="text-2xl font-light text-foreground">
          ${product.price.toFixed(2)}
        </span>
        {discount && discount > 0 && (
          <span className="text-xs text-[#1a5c3a] font-medium">
            -{discount}% off
          </span>
        )}
      </div>

      {/* Short description */}
      <p className="text-sm font-light text-muted-foreground leading-relaxed">
        {product.description}
      </p>

      {/* CTA */}
      <div className="pt-2 space-y-3">
        <button className="w-full py-3.5 bg-foreground text-background text-[11px] uppercase tracking-[0.2em] font-normal hover:opacity-80 transition-opacity">
          Send Inquiry
        </button>
        <button className="w-full py-3.5 border border-border/40 text-foreground text-[11px] uppercase tracking-[0.2em] font-normal hover:border-foreground/40 transition-colors">
          Request Quote
        </button>
      </div>

    </div>
  );
};

export default ProductInfo;