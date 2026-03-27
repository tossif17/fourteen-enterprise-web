import React from "react";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { AiOutlineGlobal, AiOutlineClockCircle } from "react-icons/ai";
import { FaAnchor } from "react-icons/fa";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

/* -------------------- Types -------------------- */
interface CardItem {
  id: number;
  icon: ReactNode;
  iconColor: string;
  title: string;
  description: string;
}

/* -------------------- Data -------------------- */
const cardData: CardItem[] = [
  {
    id: 1,
    icon: <VscWorkspaceTrusted size={36} />,
    iconColor: "text-blue-500",
    title: "Expertise You Can Trust",
    description:
      "Decades of experience in marine automation, spare parts, and engineering solutions.",
  },
  {
    id: 2,
    icon: <AiOutlineGlobal size={36} />,
    iconColor: "text-green-500",
    title: "Global Sourcing Network",
    description:
      "Partnerships with leading brands ensure authentic, high-quality products.",
  },
  {
    id: 3,
    icon: <AiOutlineClockCircle size={36} />,
    iconColor: "text-orange-500",
    title: "Reliable & On-Time Delivery",
    description:
      "Efficient logistics and supply chain to keep operations running smoothly.",
  },
  {
    id: 4,
    icon: <FaAnchor size={36} />,
    iconColor: "text-purple-500",
    title: "Tailored Marine Solutions",
    description:
      "Custom-fit services designed for vessels and client-specific needs.",
  },
];

/* -------------------- Component -------------------- */
const CardDefault: React.FC = () => {
  return (
    <>
    <section className="bg-gray-50">

    <div className="max-w-7xl mx-auto px-4 py-14 sm:py-16 ">
      <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cardData.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.15,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
            className="h-full"
          >
            {/* Card */}
            <div className="h-full w-full max-w-sm mx-auto bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col p-6">

              {/* Icon */}
              <div className={`flex justify-center mb-4 ${card.iconColor}`}>
                {card.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-center mb-2">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 text-center leading-relaxed flex-grow">
                {card.description}
              </p>

            </div>
          </motion.div>
        ))}
      </div>
    </div>
    </section>
    </>
  );
};

export default CardDefault;
