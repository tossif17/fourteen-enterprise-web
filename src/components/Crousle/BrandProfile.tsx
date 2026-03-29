import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import ProfileCard from "./ProfileCard";
import { memo, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface Profile {
  id: string;
  name: string;
  image: string;
  brand: string;
}

const profiles: Profile[] = [
  { id: "schneider", name: "Schneider", image: "", brand: "ABB" },
  { id: "autronica", name: "Autronica", image: "", brand: "Siemens" },
  { id: "delta", name: "Delta", image: "", brand: "Bosch Rexroth" },
  { id: "allen1", name: "Allen-Bradley", image: "", brand: "Parker Hannifin" },
  { id: "allen2", name: "Allen-Bradley", image: "", brand: "Parker Hannifin" },
  { id: "allen3", name: "Allen-Bradley", image: "", brand: "Parker Hannifin" },
];

const css = `
  .bp-section {
    background: #f8f9fc;
    padding: 96px 0 80px;
    position: relative;
    overflow: hidden;
  }

  .bp-section::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px);
    background-size: 28px 28px;
    opacity: 0.25;
    pointer-events: none;
  }

  .bp-section::after {
    content: "";
    position: absolute;
    top: -140px;
    right: -140px;
    width: 420px;
    height: 420px;
    background: radial-gradient(circle, rgba(79,70,229,0.05) 0%, transparent 70%);
    pointer-events: none;
  }

  .bp-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 5px 16px;
    background: #fff;
    border: 1px solid #e0e7ff;
    border-radius: 999px;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: #4f46e5;
    box-shadow: 0 1px 6px rgba(79,70,229,0.08);
  }

  .bp-badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #4f46e5;
    animation: bp-pulse 2s ease infinite;
  }

  @keyframes bp-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.45; transform: scale(0.8); }
  }

  .bp-heading {
    font-size: clamp(2rem, 4.5vw, 3.2rem);
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.025em;
    line-height: 1.1;
  }

  .bp-heading span {
    color: #4f46e5;
  }

  .bp-sub {
    color: #64748b;
    font-size: 0.92rem;
    line-height: 1.75;
    max-width: 420px;
    margin: 12px auto 0;
  }

  .bp-swiper {
    width: 100%;
    padding: 20px 0 52px !important;
  }

  .bp-swiper .swiper-pagination {
    bottom: 8px;
  }

  .bp-swiper .swiper-pagination-bullet {
    width: 7px;
    height: 7px;
    background: #cbd5e1;
    opacity: 1;
    border-radius: 4px;
    transition: all 0.25s ease;
  }

  .bp-swiper .swiper-pagination-bullet-active {
    background: #4f46e5;
    width: 20px;
  }

  .bp-card-wrap {
    border-radius: 20px;
    overflow: hidden;
    position: relative;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    will-change: transform;
    box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  }

  .swiper-slide-active .bp-card-wrap {
    transform: translateY(-4px);
    box-shadow: 0 14px 34px rgba(0,0,0,0.12);
  }

  .bp-slide-inner {
    width: 100%;
    text-align: center;
  }

  .bp-slide-inner.active {
    cursor: pointer;
  }

  .bp-slide-title {
    text-align: center;
    margin-top: 14px;
    font-weight: 700;
    letter-spacing: -0.01em;
    transition: all 0.25s ease;
    font-size: 0.92rem;
    color: #94a3b8;
  }

  .bp-slide-title.active {
    font-size: 1.02rem;
    color: #0f172a;
  }

  .bp-nav-wrap {
    display: flex;
    justify-content: center;
    gap: 14px;
    margin-top: 16px;
  }

  .bp-nav-btn {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    border: 1.5px solid #e2e8f0;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    color: #475569;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0,0,0,0.06);
    transition: all 0.2s ease;
    line-height: 1;
    user-select: none;
  }

  .bp-nav-btn:hover {
    border-color: #4f46e5;
    background: #4f46e5;
    color: #fff;
    transform: scale(1.06);
  }

  .bp-nav-btn:active {
    transform: scale(0.96);
  }
`;

const MemoProfileCard = memo(ProfileCard);

export default function BrandProfile() {
  const swiperRef = useRef<any>(null);
  const navigate = useNavigate();

  const slides = useMemo(() => profiles, []);

  const handleNavigate = (brand: string) => {
    navigate(`/category/${brand.toLowerCase()}`);
  };

  return (
    <>
      <style>{css}</style>

      <section className="bp-section">
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="text-center mb-5">
            <span className="bp-badge">
              <span className="bp-badge-dot" />
              Trusted Partners
            </span>
          </div>

          <div className="text-center mb-10 px-4">
            <h2 className="bp-heading">
              Our <span>Brand</span>
            </h2>
            <p className="bp-sub">
              We collaborate with industry leaders to deliver world-class
              automation components and systems.
            </p>
          </div>

          <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 16px" }}>
            <Swiper
              onSwiper={(s) => (swiperRef.current = s)}
              modules={[Pagination, Autoplay, EffectCoverflow]}
              effect="coverflow"
              centeredSlides
              loop
              grabCursor
              speed={700}
              slidesPerView={3}
              spaceBetween={16}
              pagination={{ clickable: true }}
              autoplay={{
                delay: 3200,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              coverflowEffect={{
                rotate: 18,
                stretch: 0,
                depth: 90,
                modifier: 1,
                slideShadows: false,
                scale: 0.95,
              }}
              watchSlidesProgress={false}
              breakpoints={{
                0: { slidesPerView: 1.15, spaceBetween: 10 },
                640: { slidesPerView: 2, spaceBetween: 14 },
                1024: { slidesPerView: 3, spaceBetween: 18 },
                1280: { slidesPerView: 3, spaceBetween: 24 },
              }}
              className="bp-swiper"
            >
              {slides.map((profile) => (
                <SwiperSlide
                  key={profile.id}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  {({ isActive }) => (
                    <div
                      className={`bp-slide-inner ${isActive ? "active" : ""}`}
                      onClick={isActive ? () => handleNavigate(profile.brand) : undefined}
                    >
                      <div className="bp-card-wrap">
                        <MemoProfileCard
                          {...profile}
                          onClick={() => handleNavigate(profile.brand)}
                        />
                      </div>

                      <p className={`bp-slide-title ${isActive ? "active" : ""}`}>
                        {profile.name}
                      </p>
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="bp-nav-wrap">
            <button
              className="bp-nav-btn"
              aria-label="Previous"
              onClick={() => swiperRef.current?.slidePrev()}
            >
              ‹
            </button>
            <button
              className="bp-nav-btn"
              aria-label="Next"
              onClick={() => swiperRef.current?.slideNext()}
            >
              ›
            </button>
          </div>
        </div>
      </section>
    </>
  );
}