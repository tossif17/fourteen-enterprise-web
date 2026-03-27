import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import { motion, useInView } from "framer-motion";
import {
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";

/* ================= ANIMATION VARIANTS ================= */

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

/* ================= TYPES ================= */

interface InputProps {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
}

interface SocialItem {
  icon: React.ComponentType;
  link: string;
  color: string;
}

/* ================= COMPONENT ================= */

export default function ContactAnimated(): JSX.Element {
  const formRef = useRef<HTMLFormElement | null>(null);
  const formView = useInView(formRef, { amount: 0.3 });

  const rightRef = useRef<HTMLDivElement | null>(null);
  const rightView = useInView(rightRef, { amount: 0.3 });

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) return;

    emailjs
      .sendForm(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        formRef.current,
        "YOUR_PUBLIC_KEY"
      )
      .then(
        () => {
          alert("Message sent successfully ✅");
          e.currentTarget.reset();
        },
        () => alert("Something went wrong ❌")
      );
  };

  const socials: SocialItem[] = [
    {
      icon: FaInstagram,
      link: "https://www.instagram.com/yourusername",
      color:
        "text-pink-400 hover:text-pink-500 hover:shadow-[0_0_25px_rgba(236,72,153,0.8)]",
    },
    {
      icon: FaWhatsapp,
      link: "https://wa.me/919999999999",
      color:
        "text-green-400 hover:text-green-500 hover:shadow-[0_0_25px_rgba(34,197,94,0.8)]",
    },
    {
      icon: FaLinkedin,
      link: "https://www.linkedin.com/in/yourusername",
      color:
        "text-blue-400 hover:text-blue-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.8)]",
    },
    {
      icon: FaTwitter,
      link: "https://twitter.com/yourusername",
      color:
        "text-sky-400 hover:text-sky-500 hover:shadow-[0_0_25px_rgba(56,189,248,0.8)]",
    },
  ];

  return (
    <div className="bg-[#0a0a0a] py-20 px-6 overflow-hidden">
      <motion.h1
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="text-white text-3xl font-bold mb-14 text-center"
      >
        DROP US A LINE
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* FORM */}
        <motion.form
          ref={formRef}
          onSubmit={sendEmail}
          variants={fadeLeft}
          initial="hidden"
          animate={formView ? "visible" : "hidden"}
          className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 space-y-5"
        >
          <Input label="Name" name="name" placeholder="Your full name" />
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@email.com"
          />
          <Input
            label="Phone"
            name="phone"
            type="number"
            placeholder="+91 XXXXXXXX"
          />

          <div>
            <label className="text-white text-sm font-medium">Message</label>
            <textarea
              name="message"
              rows={4}
              required
              placeholder="Write your message..."
              className="mt-2 w-full rounded-md bg-white/5 px-3 py-2 text-white placeholder:text-gray-400 focus:outline-none border border-white/10 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold py-2 rounded-lg"
          >
            Send Message 🚀
          </button>
        </motion.form>

        {/* RIGHT SIDE */}
        <motion.div
          ref={rightRef}
          variants={fadeRight}
          initial="hidden"
          animate={rightView ? "visible" : "hidden"}
          className="flex flex-col justify-center space-y-10"
        >
          <div className="group">
            <h2 className="text-white text-xl font-semibold tracking-wide">
              Follow Us On Social Media
            </h2>

            <div className="flex gap-5 mt-5">
              {socials.map(({ icon: Icon, link, color }, i) => (
                <a
                  key={i}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-full bg-white/5 border border-white/10 text-xl transition hover:scale-110 ${color}`}
                >
                  <Icon />
                </a>
              ))}
            </div>

            <AnimatedLine />
          </div>

          <h2 className="text-white text-xl font-semibold tracking-wide">
            Find Us On Google Map
          </h2>

          <div className="relative h-56 rounded-2xl overflow-hidden border border-white/10 group">
            <iframe
              title="Google Map"
              loading="lazy"
              className="w-full h-full scale-105 transition-transform duration-700 group-hover:scale-110"
              src="https://www.google.com/maps/embed?pb=..."
            />
          </div>

          <div className="group">
            <h2 className="text-white text-xl font-semibold">Need Help</h2>
            <AnimatedLine />

            <a
              href="mailto:tosifbhurani05@gmail.com"
              className="mt-4 inline-block text-indigo-400 hover:text-indigo-300 transition"
            >
              tosifbhurani05@gmail.com
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ================= ANIMATED LINE ================= */

function AnimatedLine(): JSX.Element {
  return (
    <div className="relative mt-3 h-[1px] w-full bg-white/10 overflow-hidden">
      <span className="absolute left-0 top-0 h-full w-0 bg-white/70 transition-all duration-500 group-hover:w-full" />
      <span className="absolute -left-1 -top-[3px] h-2 w-2 rotate-45 bg-white/70 opacity-0 group-hover:opacity-100 transition" />
      <span className="absolute -right-1 -top-[3px] h-2 w-2 rotate-45 bg-white/70 opacity-0 group-hover:opacity-100 transition" />
    </div>
  );
}

/* ================= INPUT ================= */

function Input({
  label,
  name,
  placeholder,
  type = "text",
}: InputProps): JSX.Element {
  return (
    <div>
      <label className="text-white text-sm font-medium">{label}</label>
      <input
        name={name}
        required
        placeholder={placeholder}
        type={type}
        className="mt-2 w-full rounded-md bg-white/5 px-3 py-2 text-white placeholder:text-gray-400 focus:outline-none border border-white/10 focus:border-indigo-500"
      />
    </div>
  );
}
