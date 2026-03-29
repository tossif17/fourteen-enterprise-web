import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";

const INTERVAL = 5000;

const slides = [
  { id: 1, src: "/image/ship1.jpg" },
  { id: 2, src: "/image/ship2.jpg" },
];

const LargeHero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, INTERVAL);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");

      console.log("PRODUCTS:", data);
      console.log("ERROR:", error);
    };

    fetchProducts();
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <div className="relative h-[100dvh] min-h-[700px] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[current].id}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={slides[current].src}
              alt="Fourteen Enterprise Hero"
              className="h-full w-full object-cover"
            />

            {/* ✅ Softer dark overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(0,0,0,0.55)_18%,rgba(0,0,0,0.25)_45%,rgba(0,0,0,0.5)_100%)]" />

            {/* ✅ Reduced radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_25%),radial-gradient(circle_at_left_center,rgba(14,165,233,0.1),transparent_35%)]" />

            {/* ❌ Removed blur for clarity */}
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 z-20">
          <div className="mx-auto flex h-full max-w-7xl items-center px-6 sm:px-10 lg:px-16">
            <div className="max-w-4xl">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.1 }}
                className="text-left text-5xl font-black uppercase leading-[0.9] tracking-[0.04em] text-white sm:text-6xl md:text-7xl lg:text-[92px]"
              >
                Welcome To
                <span className="mt-2 block bg-gradient-to-r from-white via-white to-sky-300 bg-clip-text text-transparent">
                  Fourteen Enterprise
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.25 }}
                className="mt-8 h-[2px] w-28 origin-left bg-gradient-to-r from-sky-400 via-white/80 to-transparent"
              />

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="mt-8 max-w-2xl text-left text-base font-normal leading-8 text-gray-200 sm:text-lg md:text-xl"
              >
                Delivering smart automation and marine solutions with premium reliability,
                technical precision, and trusted supply for modern ship operations.
              </motion.p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-black/25 px-4 py-3 backdrop-blur-xl">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`relative overflow-hidden rounded-full transition-all duration-500 ${
                i === current ? "h-3 w-10 bg-white" : "h-3 w-3 bg-white/40 hover:bg-white/70"
              }`}
            >
              <span
                className={`absolute inset-0 rounded-full bg-gradient-to-r from-sky-300 to-white ${
                  i === current ? "opacity-100" : "opacity-0"
                }`}
              />
            </button>
          ))}
        </div>

        <div className="absolute bottom-8 right-6 z-30 hidden rounded-[28px] border border-white/10 bg-white/10 p-5 text-white shadow-2xl backdrop-blur-xl lg:block">
          <p className="text-[11px] uppercase tracking-[0.32em] text-white/60">
            Premium Service
          </p>
          <h3 className="mt-2 text-2xl font-semibold leading-tight">
            Smart Marine
            <br />
            Reliability
          </h3>
          <p className="mt-3 max-w-[220px] text-sm leading-6 text-white/70">
            Built to create a stronger first impression and higher-value brand feel.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LargeHero;