import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { categories, brands, products } from "@/data/products";

interface CategoryHeaderProps {
  category: string;
  selectedCategories?: string[];
  onCategoryClick?: (cat: string) => void;
}

// ── Animated counter hook ──
const useCountUp = (target: number, duration = 800) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();

          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease out cubic
            const eased = Math.sin((progress * Math.PI) / 2);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
};

// ── Single stat item ──
const StatItem = ({
  target,
  suffix,
  label,
}: {
  target: number;
  suffix?: string;
  label: string;
}) => {
  const { count, ref } = useCountUp(target, 1800);

  return (
    <div ref={ref} className="flex flex-col items-center md:items-end">
      <span className="text-base font-medium text-foreground leading-none tabular-nums">
        {count}{suffix}
      </span>
      <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 mt-1">
        {label}
      </span>
    </div>
  );
};

const CategoryHeader = ({
  category,
  selectedCategories = [],
  onCategoryClick,
}: CategoryHeaderProps) => {
  const capitalizedCategory =
    category.charAt(0).toUpperCase() + category.slice(1);

  const marqueeItems = [...brands, ...brands].flatMap((brand, i) => [
    { type: "brand", value: brand, key: `brand-${i}` },
    { type: "dot", value: "◆", key: `dot-${i}` },
  ]);

  return (
    <section className="w-full mb-2">

      {/* ── Breadcrumb + Title + Stats ── */}
      <div className="px-6 mb-6">
        <div className="mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{capitalizedCategory}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Title + Stats */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <h1 className="text-3xl md:text-4xl font-light text-foreground tracking-tight">
            {capitalizedCategory}
          </h1>

          <div className="flex items-center gap-6 md:gap-10 pb-1">
            <StatItem target={brands.length} suffix="+" label="Trusted Brands" />
            <StatItem target={products.length} suffix="+" label="Products" />
            <StatItem target={categories.length} label="Categories" />
            <StatItem target={100} suffix="%" label="OEM Grade" />
          </div>
        </div>
      </div>

      {/* ── Brand Marquee ── */}
      <div className="relative w-full overflow-hidden border-y border-border/20 py-3.5 mb-6 group bg-muted/20">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent" />

        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {marqueeItems.map((item) =>
            item.type === "dot" ? (
              <span key={item.key} className="mx-3 text-muted-foreground/30 select-none text-xs">
                ◆
              </span>
            ) : (
              <span
                key={item.key}
                className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground/50 whitespace-nowrap font-medium select-none hover:text-foreground/70 transition-colors duration-300 cursor-default"
              >
                {item.value}
              </span>
            )
          )}
        </div>
      </div>

      {/* ── Category Pills ── */}
      <div className="px-6 mb-2">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryClick?.("all")}
            className={`px-4 py-1.5 text-[11px] uppercase tracking-[0.15em] border transition-all duration-200 rounded-none font-normal ${
              selectedCategories.length === 0
                ? "bg-foreground text-background border-foreground"
                : "bg-transparent text-muted-foreground border-border/40 hover:border-foreground/40 hover:text-foreground"
            }`}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryClick?.(cat)}
              className={`px-4 py-1.5 text-[11px] uppercase tracking-[0.15em] border transition-all duration-200 rounded-none font-normal ${
                selectedCategories.includes(cat)
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-muted-foreground border-border/40 hover:border-foreground/40 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

    </section>
  );
};

export default CategoryHeader;