import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
} from "@/components/ui/breadcrumb";

const ProductInfo = () => {


  return (
    <div className="space-y-6">
      {/* Breadcrumb - Show only on desktop */}
      <div className="hidden lg:block">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
           /
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/category/earrings">Earrings</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Product title and price */}
      <div className="space-y-6">
              <h1 className="text-3xl md:text-4xl font-extrabold uppercase leading-tight">
        ALLEN-BRADLEY 2711R-7T7 PANELVIEW 800 HMI 7 "
      </h1>
            <div className="flex items-center gap-3">
        <span className="text-xl text-gray-400 line-through">
          $350.00
        </span>
        <span className="text-2xl font-semibold text-orange-500">
          $340.00
        </span>
      </div>
            <p className="text-sm text-gray-600 uppercase">
        ALLEN-BRADLEY 2711R-7T7 PANELVIEW 800 HMI 7"
      </p>
      </div>
      <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-10 py-3 transition">
        SEND INQUIRY
      </button>
 
    </div>
  );
};

export default ProductInfo;