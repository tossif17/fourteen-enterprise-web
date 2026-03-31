// @ts-nocheck
import { useState, useEffect } from "react";

// Maps your Supabase product shape → shoe-finder internal shape
function mapProductToShoe(product: any) {
  return {
    title: product.name,
    price: product.price_formatted ?? `$${product.price ?? ""}`,
    image_url: product.image,
    product_url: product.product_url ?? "#",
    brand: product.brand ?? product.category ?? "Unknown",

    primary_color: product.primary_color ?? "gray",
    primary_color_hex: product.primary_color_hex ?? "#888888",

    hover_image: product.hover_image ?? product.hoverImage ?? product.image,
    images: product.images ?? [],
    is_new: product.is_new ?? product.isNew ?? false,
    old_price: product.old_price ?? product.oldPrice ?? null,
    id: product.id,
    category: product.category,
    type: product.type,
    description: product.description,
  };
}

const PRODUCTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/products?select=*`;

let productsCache: any[] | null = null;
let productsPromise: Promise<any[]> | null = null;

async function fetchProductsOnce() {
  if (productsCache) return productsCache;
  if (productsPromise) return productsPromise;

  productsPromise = fetch(PRODUCTS_URL, {
    headers: {
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY}`,
    },
  })
    .then(async (res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      const raw = Array.isArray(json) ? json : json.data ?? [];
      const mapped = raw.map(mapProductToShoe);

      productsCache = mapped;
      return mapped;
    })
    .finally(() => {
      productsPromise = null;
    });

  return productsPromise;
}

export function useProducts() {
  const [products, setProducts] = useState<any[]>(productsCache ?? []);
  const [loading, setLoading] = useState(!productsCache);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (productsCache) {
      setProducts(productsCache);
      setLoading(false);
      return;
    }

    fetchProductsOnce()
      .then((data) => {
        if (cancelled) return;
        setProducts(data);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading, error };
}