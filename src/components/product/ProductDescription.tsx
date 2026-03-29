import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  type: string;
  description: string;
  price: number;
  old_price?: number;
}

interface ProductDescriptionProps {
  product: Product;
}

const ProductDescription = ({ product }: ProductDescriptionProps) => {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isShippingOpen, setIsShippingOpen] = useState(false);

  const specs = [
    { label: "Brand", value: product.brand },
    { label: "Category", value: product.category },
    { label: "Type", value: product.type },
    { label: "Part Condition", value: "New / Surplus" },
    { label: "Lead Time", value: "3–7 Business Days" },
    { label: "Warranty", value: "12 Months" },
  ];

  return (
    <div className="space-y-0 mt-8 border-t border-border">

      {/* Description */}
      <div className="border-b border-border">
        <Button
          variant="ghost"
          onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
          className="w-full h-14 px-0 justify-between hover:bg-transparent font-light rounded-none text-sm"
        >
          <span>Description</span>
          {isDescriptionOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        {isDescriptionOpen && (
          <div className="pb-6 space-y-4">
            <p className="text-sm font-light text-muted-foreground leading-relaxed">
              {product.description}
            </p>
            <p className="text-sm font-light text-muted-foreground leading-relaxed">
              Sourced directly from authorised distributors and OEM channels, this {product.type.toLowerCase()} 
              meets the highest industrial standards. Suitable for demanding hydraulic and automation applications 
              across marine, manufacturing, and process industries.
            </p>
          </div>
        )}
      </div>

      {/* Product Details / Specs */}
      <div className="border-b border-border">
        <Button
          variant="ghost"
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          className="w-full h-14 px-0 justify-between hover:bg-transparent font-light rounded-none text-sm"
        >
          <span>Product Details</span>
          {isDetailsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        {isDetailsOpen && (
          <div className="pb-6">
            <table className="w-full">
              <tbody>
                {specs.map((spec) => (
                  <tr key={spec.label} className="border-b border-border/30 last:border-0">
                    <td className="py-2.5 text-[11px] uppercase tracking-[0.12em] text-muted-foreground w-1/2">
                      {spec.label}
                    </td>
                    <td className="py-2.5 text-sm font-light text-foreground">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Shipping & Lead Time */}
      <div className="border-b border-border">
        <Button
          variant="ghost"
          onClick={() => setIsShippingOpen(!isShippingOpen)}
          className="w-full h-14 px-0 justify-between hover:bg-transparent font-light rounded-none text-sm"
        >
          <span>Shipping & Lead Time</span>
          {isShippingOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        {isShippingOpen && (
          <div className="pb-6 space-y-3">
            <ul className="space-y-2">
              <li className="text-sm font-light text-muted-foreground">• Standard delivery: 3–7 business days</li>
              <li className="text-sm font-light text-muted-foreground">• Express options available on request</li>
              <li className="text-sm font-light text-muted-foreground">• International shipping to 50+ countries</li>
              <li className="text-sm font-light text-muted-foreground">• All orders include tracking and insurance</li>
              <li className="text-sm font-light text-muted-foreground">• Bulk order discounts available — contact us</li>
            </ul>
          </div>
        )}
      </div>

    </div>
  );
};

export default ProductDescription;