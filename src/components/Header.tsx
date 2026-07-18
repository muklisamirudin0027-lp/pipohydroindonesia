import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const navLinks = [
    { label: "BERANDA", href: "#home" },
    { label: "PRODUK KAMI", href: "#our-produce" },
    { label: "MENGAPA KAMI", href: "#solutions" },
    { label: "TEKNOLOGI", href: "#technology" },
    { label: "CERITA KAMI", href: "#about-us" },
    { label: "KONTAK", href: "#contact" },
  ];

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className={`mx-auto flex h-24 max-w-7xl items-center justify-between px-6 lg:px-8 border-b transition-colors duration-300 ${isScrolled ? "border-transparent" : "border-white/20"}`}>
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img 
            src={isScrolled ? "/logo-hijau.webp" : "/logo-putih.webp"} 
            alt="Pipo Hydro Indonesia Logo" 
            className="h-10 w-auto object-contain transition-all duration-300"
          />
          <span className={`text-sm md:text-lg font-bold tracking-widest transition-colors duration-300 ${isScrolled ? "text-[#004D40]" : "text-white"}`}>
            PIPO HYDRO INDONESIA
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-10 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-xs font-medium tracking-widest transition-colors duration-300 ${
                isScrolled 
                  ? "text-[#424242] hover:text-[#008060]" 
                  : "text-white/90 hover:text-[#D4AF37]"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center">
          <Link 
            to="/login"
            className={`flex items-center gap-3 border px-6 py-3 text-xs font-semibold tracking-widest transition-all duration-300 rounded-full ${
            isScrolled
              ? "border-[#004D40] bg-[#004D40] text-white hover:bg-[#008060] hover:border-[#008060] shadow-md"
              : "border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white hover:text-[#004D40]"
          }`}>
            MASUK / PESAN
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
