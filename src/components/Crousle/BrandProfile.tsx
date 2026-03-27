import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ProfileCard from "./ProfileCard";
import { useRef } from "react";
import { Autoplay, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";

interface Profile {
  name: string;
  image: string;
  brand: string;
}

const profiles: Profile[] = [
  {
    name: "Schneider",
    image: "https://images.unsplash.com/photo-1581090700227-1e8c33a5b41b",
    brand: "ABB",
  },
  {
    name: "Autronica",
    image: "https://images.unsplash.com/photo-1581091215367-59ab6b5f8f8d",
    brand: "Siemens",
  },
  {
    name: "Delta",
    image: "https://images.unsplash.com/photo-1581092335397-9fa3411085a3",
     brand: "Bosch Rexroth",
  },
  {
    name: "Allen-Bradley",
    image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc",
    brand: "Parker Hannifin",
  },
];


export default function BrandProfile() {
    const swiperRef = useRef(null);
    const navigate = useNavigate();
    
  return (
    <section className="bg-gray-50 py-20">
      {/* Top Tag */}
      <div className="text-center mb-4">
        <span className="px-4 py-1 text-sm bg-blue-100 text-blue-600 rounded-full font-medium">
          TRUSTED PARTNERS
        </span>
      </div>

      {/* Heading */}
      <div className="text-center mb-14">
        <h2 className="text-4xl font-bold text-gray-900">Our Brand</h2>
        <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
          We collaborate with industry leaders to deliver world-class automation
          components and systems.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          spaceBetween={20}
          slidesPerView={3}
          loop={true}
          speed={1000}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {profiles.map((profile, index) => (
            <SwiperSlide key={index}>
              <ProfileCard {...profile}                   onClick={() =>
                    navigate(`/category/${profile.brand.toLowerCase()}`)
                  }/>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* Custom Arrows */}
        <div className="flex justify-center gap-6 mt-10">
          <button className="custom-prev w-12 h-12 border rounded-full flex items-center justify-center hover:bg-gray-200 transition" onClick={() => swiperRef.current?.slideNext()}>
            ‹
          </button>
          <button className="custom-next w-12 h-12 border rounded-full flex items-center justify-center hover:bg-gray-200 transition"onClick={() => swiperRef.current?.slidePrev()}>
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
