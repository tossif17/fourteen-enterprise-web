import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

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
      const { data, error } = await supabase
        .from("products")
        .select("*");

      console.log("PRODUCTS:", data);
      console.log("ERROR:", error);
    };

    fetchProducts();
  },[])
  return (
    <section className="w-full relative">
      <div className="relative w-full h-[100dvh] overflow-hidden">

        {/* Fade Slider */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={slide.src}
              alt="hero"
              className="w-full h-full object-cover"
            />

            {/* Smooth Premium Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70"></div>
          </div>
        ))}

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 z-20">
          
          <h1
            className="text-5xl sm:text-7xl lg:text-8xl font-extrabold uppercase tracking-wider leading-tight"
            style={{
              textShadow: "0 4px 20px rgba(0,0,0,0.6)"
            }}
          >
            Welcome To <br />
            Adee Marine
          </h1>

          <p
            className="mt-8 text-lg sm:text-xl lg:text-2xl max-w-3xl font-medium text-gray-200"
            style={{
              textShadow: "0 2px 10px rgba(0,0,0,0.6)"
            }}
          >
            Delivering Smart Automation And Marine Solutions  
            With Reliability And Precision.
          </p>
        </div>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current
                  ? "w-8 h-3 bg-white"
                  : "w-3 h-3 bg-white/60"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default LargeHero;
