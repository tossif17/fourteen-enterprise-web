import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
);
export interface Product {
  id: number;
  name: string;
  category: "Industrial Automation" | "Hydraulic Systems";
  price: number;
  priceFormatted: string;
  image: string;
  hoverImage?: string;
  images?: string[];
  isNew?: boolean;
  brand: string;
  description: string;
  oldPrice?: number;
  type: string;
}

export const categories = [
  "Industrial Automation",
  "Hydraulic Systems",
];

export const brands = [
  "Parker Hannifin",
  "Bosch Rexroth",
  "Siemens",
  "Eaton",
  "Danfoss",
  "ABB",
  "Yamaha Marine",
  "Mercury Marine",
];

// this is the same array your components import
export const products: Product[] = [];

function mapProduct(p: any): Product {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    type: p.type,
    price: p.price,
    priceFormatted: `$${Number(p.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    image: p.image,
    hoverImage: p.hover_image ?? "",
    images: p.images ?? [],
    isNew: p.is_new ?? false,
    brand: p.brand,
    description: p.description,
    oldPrice: p.old_price ?? undefined,
  };
}

async function fetchAndFill() {
  // 1. load from localStorage instantly
  const stored = localStorage.getItem("products_cache");
  if (stored) {
    const parsed: Product[] = JSON.parse(stored);
    products.push(...parsed);
  }

  // 2. fetch fresh from supabase (always, to keep data updated)
  const { data, error } = await supabase.from("products").select("*");
  if (error) return;

  const fresh = data.map(mapProduct);

  // update the same array in place
  products.length = 0;
  products.push(...fresh);

  // save to localStorage for next reload
  localStorage.setItem("products_cache", JSON.stringify(fresh));
}

// single fetch, fires once when products.ts is first imported
export const productsReady: Promise<void> = fetchAndFill();