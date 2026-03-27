import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { products } from "@/data/products";

const topRated = products.slice(0, 4);
const topSales = products.slice(2, 6);

const AccordionSection = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [open]);

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all duration-300 ${
        open ? "bg-white shadow-md" : "bg-white/60"
      }`}
      style={{ border: "1px solid #e8e8e8" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-300 ${open ? "bg-black text-white" : "bg-gray-100 text-gray-600"}`}>
            {icon}
          </span>
          <span className="text-sm font-bold tracking-wide uppercase text-gray-800">
            {title}
          </span>
        </div>
        <span className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${open ? "bg-black rotate-45" : "bg-gray-200"}`}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1v8M1 5h8" stroke={open ? "white" : "#666"} strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      <div
        style={{
          maxHeight: open ? `${height}px` : "0px",
          overflow: "hidden",
          transition: "max-height 0.45s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div ref={contentRef} className="px-4 pb-4">
          <div className="h-px bg-gray-100 mb-3" />
          {children}
        </div>
      </div>
    </div>
  );
};

const ProductList = ({
  items,
  useHover,
}: {
  items: typeof topRated;
  useHover?: boolean;
}) => (
  <ul className="space-y-1">
    {items.map((p) => (
      <li key={p.id}>
        <Link
          to={`/product/${p.id}`}
          className="flex items-center gap-3 p-2 rounded-xl group transition-all duration-200 hover:bg-gray-50 active:bg-gray-100"
        >
          <div className="relative flex-shrink-0">
            <img
              src={useHover ? p.hoverImage || p.image : p.image}
              alt={p.name}
              className="w-14 h-14 object-cover rounded-xl bg-gray-100 group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
              {p.name}
            </p>
            <p className="text-xs font-semibold text-gray-400 mt-1">
              ${p.price.toFixed(2)}
            </p>
          </div>
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 group-hover:bg-black flex items-center justify-center transition-all duration-200">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:text-white text-gray-400 transition-colors">
              <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </Link>
      </li>
    ))}
  </ul>
);

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "About Us", to: "/about/our-story" },
  { label: "Contact Us", to: "/about/customer-care" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "R&R Policy", to: "/about/size-guide" },
  { label: "Shipping Policy", to: "/terms-of-service" },
  { label: "T & C", to: "/terms-of-service" },
];

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);

const TrendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 11l4-4 3 3 5-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11 4h3v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
    <path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="w-full bg-[#f5f5f5] text-black border-t border-[#e0e0e0] mt-16">

      {/* ── DESKTOP: 3 columns ── */}
      <div className="hidden md:grid max-w-screen-xl mx-auto px-10 py-16 grid-cols-3 gap-16 border-b border-[#e0e0e0]">
        <div>
          <h4 className="text-sm font-bold tracking-[0.18em] uppercase text-gray-500 mb-5 pb-3 border-b border-[#e0e0e0]">
            Top Rated Products
          </h4>
          <ProductList items={topRated} />
        </div>
        <div>
          <h4 className="text-sm font-bold tracking-[0.18em] uppercase text-gray-500 mb-5 pb-3 border-b border-[#e0e0e0]">
            Top Sales
          </h4>
          <ProductList items={topSales} useHover />
        </div>
        <div>
          <h4 className="text-sm font-bold tracking-[0.18em] uppercase text-gray-500 mb-4 pb-3 border-b border-[#e0e0e0]">
            Linea Jewelry
          </h4>
          <h2 className="text-xl font-black uppercase leading-snug text-black mb-4">
            WE'RE HERE TO SUPPORT AND EMPOWER THE MARINE INDUSTRY WITH RELIABLE AUTOMATION SOLUTIONS
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            Stay ahead in marine technology and keep your vessels running smoothly with our trusted ship automation parts and solutions.
          </p>
          <p className="text-sm text-gray-600 mb-2">
            Sell better. Operate smarter.{" "}
            <Link to="/shop" className="font-bold text-black hover:underline">
              Get Linea Jewelry →
            </Link>
          </p>
          <p className="text-sm text-gray-500">
            FOUNDER &amp; CEO{" "}
            <span className="font-bold text-black">Mr Farhan Firdosbhai Sheikh</span>
          </p>
        </div>
      </div>

      {/* ── MOBILE: modern card accordions ── */}
      <div className="md:hidden px-4 pt-6 pb-4 space-y-3 border-b border-[#e0e0e0]">
        <AccordionSection title="Top Rated Products" icon={<StarIcon />}>
          <ProductList items={topRated} />
        </AccordionSection>

        <AccordionSection title="Top Sales" icon={<TrendIcon />}>
          <ProductList items={topSales} useHover />
        </AccordionSection>

        <AccordionSection title="Linea Jewelry" icon={<InfoIcon />}>
          <div className="px-1">
            <h2 className="text-sm font-black uppercase leading-snug text-black mb-3">
              WE'RE HERE TO SUPPORT AND EMPOWER THE MARINE INDUSTRY WITH RELIABLE AUTOMATION SOLUTIONS
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-3">
              Stay ahead in marine technology and keep your vessels running smoothly.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors duration-200 mb-3"
            >
              Get Linea Jewelry
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M7 3l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <p className="text-xs text-gray-400">
              FOUNDER &amp; CEO{" "}
              <span className="font-bold text-gray-700">Mr Farhan Firdosbhai Sheikh</span>
            </p>
          </div>
        </AccordionSection>
      </div>

      {/* ── Nav links — 2 rows horizontal ── */}
      <div className="w-full px-4 py-6">
        <div className="flex justify-center items-center flex-wrap gap-y-1 mb-1">
          {navLinks.slice(0, 4).map((item, i) => (
            <span key={item.label} className="flex items-center">
              <Link to={item.to} className="text-sm font-medium text-gray-600 hover:text-black transition-colors duration-200 px-2 py-1 whitespace-nowrap">
                {item.label}
              </Link>
              {i < 3 && <span className="text-gray-300 text-sm select-none">|</span>}
            </span>
          ))}
        </div>
        <div className="flex justify-center items-center flex-wrap gap-y-1">
          {navLinks.slice(4).map((item, i) => (
            <span key={item.label} className="flex items-center">
              <Link to={item.to} className="text-sm font-medium text-gray-600 hover:text-black transition-colors duration-200 px-2 py-1 whitespace-nowrap">
                {item.label}
              </Link>
              {i < 3 && <span className="text-gray-300 text-sm select-none">|</span>}
            </span>
          ))}
        </div>
      </div>

      {/* ── Copyright ── */}
      <div className="border-t border-[#e0e0e0] py-5 text-center px-4">
        <p className="text-sm font-medium text-gray-500">
          2025 © All Rights Reserved By Linea Jewelry
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Design By Web Seas Technology
        </p>
      </div>

    </footer>
  );
};

export default Footer;