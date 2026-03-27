import { ArrowRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { products } from "@/data/products";

const navItems = [
  { name: "Home",       href: "/" },
  { name: "Products",   href: "/shop" },
  { name: "About Us",   href: "/about/our-story" },
  { name: "Contact Us", href: "/about/customer-care" },
];

const popularSearches = [
  "Hydraulic Pump", "PLC Controller", "Marine Propeller",
  "Servo Motor", "Pneumatic Cylinder", "Circuit Breaker",
];

const Navigation = () => {
  const [isSearchOpen,     setIsSearchOpen]     = useState(false);
  const [searchQuery,      setSearchQuery]      = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled,       setIsScrolled]       = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHero      = location.pathname === "/";
  const transparent = isHero && !isScrolled;

  useEffect(() => {
    const fn = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  const searchResults = searchQuery.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  return (
    <>
      <style>{`
        @keyframes slideL { from{transform:translateX(-100%)} to{transform:translateX(0)} }
        @keyframes srchIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        .slide-l { animation: slideL 0.28s cubic-bezier(.4,0,.2,1); }
        .srch-in { animation: srchIn 0.22s ease; }

        /* Animated underline — left to right on hover */
        .nav-link {
          position: relative;
          padding-bottom: 4px;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0%;
          height: 2px;
          border-radius: 2px;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .nav-link.active-link::after {
          width: 100%;
        }
        /* white underline on transparent hero */
        .nav-link.on-hero::after  { background: white; }
        /* black underline on white bg */
        .nav-link.on-white::after { background: #111; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className={`w-full fixed top-0 left-0 z-50 transition-all duration-500 ease-in-out ${
        transparent
          ? "bg-black/30 backdrop-blur-sm border-b border-white/10"
          : "bg-white shadow-[0_2px_20px_rgba(0,0,0,0.08)] border-b border-gray-100"
      }`}>
        <div className="max-w-screen-xl mx-auto flex items-center justify-between h-16 px-5 md:px-10">

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg transition-all duration-300"
            style={{ color: transparent ? "white" : "#374151" }}
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-105"
              style={{
                background: transparent ? "rgba(255,255,255,0.2)" : "#111",
                border:     transparent ? "1.5px solid rgba(255,255,255,0.5)" : "1.5px solid #111",
              }}
            >
              <span className="font-black text-xs tracking-tight text-white">FE</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span
                className="text-[14px] font-black tracking-tight leading-none transition-all duration-500"
                style={{ color: transparent ? "white" : "#111" }}
              >
                LINEA
              </span>
              <span
                className="text-[8px] font-semibold tracking-[0.28em] uppercase leading-none mt-[3px] transition-all duration-500"
                style={{ color: transparent ? "rgba(255,255,255,0.6)" : "#9ca3af" }}
              >
                Jewelry
              </span>
            </div>
          </Link>

          {/* ── Desktop links ── */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map(item => (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link px-4 py-2 text-[13px] font-semibold transition-colors duration-300
                  ${transparent ? "on-hero" : "on-white"}
                  ${isActive(item.href) ? "active-link" : ""}
                `}
                style={{
                  color: transparent
                    ? "white"
                    : isActive(item.href) ? "#111" : "#6b7280",
                }}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setIsSearchOpen(true); setSearchQuery(""); }}
              className="p-2.5 rounded-lg transition-all duration-300"
              style={{ color: transparent ? "white" : "#6b7280" }}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </button>

            <Link
              to="/shop"
              className="hidden md:flex items-center gap-1.5 text-[13px] font-bold px-4 py-2 rounded-lg transition-all duration-500 active:scale-95"
              style={{
                background: transparent ? "white"  : "#111",
                color:      transparent ? "#111"   : "white",
              }}
            >
              Shop Now <ArrowRight size={13} />
            </Link>
          </div>

        </div>
      </nav>

      {/* Spacer for non-hero pages */}
      {!isHero && <div className="h-16" />}

      {/* SEARCH OVERLAY */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[70]">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-md"
            onClick={() => setIsSearchOpen(false)}
          />

          <div className="absolute top-6 right-8 z-10">
            <button
              onClick={() => setIsSearchOpen(false)}
              className="w-12 h-12 rounded-full flex items-center justify-center text-white glass-pill hover:bg-white/20 transition"
            >
              <X size={22} />
            </button>
          </div>

          <div className="relative w-full h-full flex items-start justify-center pt-24 md:pt-28 px-5">
            <div className="w-full max-w-5xl search-panel-in">
              <div className="rounded-full bg-white px-6 md:px-7 py-4 shadow-[0_12px_40px_rgba(0,0,0,0.16)]">
                <div className="flex items-center gap-3">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#6b7280"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="flex-shrink-0"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>

                  <input
                    autoFocus
                    type="text"
                    placeholder="Search"
                    className="flex-1 bg-transparent outline-none text-[16px] md:text-[18px] font-medium text-gray-900 placeholder:text-blue-600"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchQuery.trim()) {
                        setIsSearchOpen(false);
                        navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
                      }
                      if (e.key === "Escape") {
                        setIsSearchOpen(false);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="mt-9">
                <p className="text-white text-[15px] font-semibold mb-4">
                  Top Suggestions:
                </p>

                <div className="glass-panel rounded-3xl overflow-hidden">
                  <div className="max-h-[420px] overflow-y-auto hide-scrollbar">
                    {searchQuery.trim() ? (
                      searchResults.length > 0 ? (
                        searchResults.map((p, index, arr) => (
                          <Link
                            key={p.id}
                            to={`/product/${p.id}`}
                            onClick={() => setIsSearchOpen(false)}
                            className={`flex items-center justify-between gap-4 px-5 md:px-7 py-5 md:py-6 hover:bg-white/10 transition ${
                              index !== arr.length - 1 ? "border-b border-white/15" : ""
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <p className="text-white text-[18px] md:text-[20px] font-semibold truncate">
                                {p.name}
                              </p>
                              <p className="text-white/65 text-sm mt-1 truncate">
                                {p.category} {p.brand ? `• ${p.brand}` : ""}
                              </p>
                            </div>

                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-16 h-16 md:w-20 md:h-20 object-contain flex-shrink-0"
                            />
                          </Link>
                        ))
                      ) : (
                        <div className="px-6 py-8 text-center">
                          <p className="text-white/85 text-lg font-medium">
                            No results found for "{searchQuery}"
                          </p>
                          <button
                            onClick={() => {
                              setIsSearchOpen(false);
                              navigate("/shop");
                            }}
                            className="mt-3 inline-flex items-center gap-2 text-white/80 hover:text-white font-semibold"
                          >
                            Browse all products <ArrowRight size={15} />
                          </button>
                        </div>
                      )
                    ) : (
                      popularSearches.map((item, index, arr) => (
                        <button
                          key={item}
                          onClick={() => setSearchQuery(item)}
                          className={`w-full flex items-center justify-between gap-4 px-5 md:px-7 py-5 md:py-6 hover:bg-white/10 transition text-left ${
                            index !== arr.length - 1 ? "border-b border-white/15" : ""
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-white text-[18px] md:text-[20px] font-semibold truncate">
                              {item}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE MENU ── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="slide-l absolute top-0 left-0 bottom-0 w-[75%] max-w-[300px] bg-[#111] flex flex-col">

            <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 border border-white/25 rounded-xl flex items-center justify-center">
                  <span className="text-white font-black text-xs">FE</span>
                </div>
                <div>
                  <p className="text-[14px] font-black text-white leading-none">LINEA</p>
                  <p className="text-[8px] font-semibold text-white/40 tracking-[0.28em] uppercase leading-none mt-1">Jewelry</p>
                </div>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-white/10 transition text-white/60">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
              {navItems.map(item => (
                <Link key={item.name} to={item.href} onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl font-bold text-sm transition-all"
                  style={{
                    background: isActive(item.href) ? "white"  : "transparent",
                    color:      isActive(item.href) ? "#111"   : "rgba(255,255,255,0.65)",
                  }}
                >
                  {item.name}
                  <ArrowRight size={15} style={{ color: isActive(item.href) ? "rgba(17,17,17,0.3)" : "rgba(255,255,255,0.25)" }} />
                </Link>
              ))}
            </div>

            <div className="px-3 py-4 border-t border-white/10 space-y-2.5">
              <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-white text-black py-3 rounded-xl font-bold text-sm hover:bg-white/90 transition-colors">
                Shop All Products <ArrowRight size={15} />
              </Link>
              <p className="text-center text-[11px] text-white/30">
                Developed by{" "}
                <a href="https://webseastechnology.com" target="_blank" rel="noopener noreferrer"
                  className="font-bold text-white/60 hover:text-white transition-colors">
                  Web Seas Technology
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;