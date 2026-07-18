import { ArrowRight, Leaf, Droplets, ThermometerSun } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Background Image - Full bleed */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1557844352-761f2565b576?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Modern Vertical Hydroponic Garden"
          className="h-full w-full object-cover"
        />
        {/* Elegant overlay - improves readability while keeping it fresh */}
        <div className="absolute inset-0 bg-[#001a14]/60 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#001a14] via-transparent to-transparent opacity-80"></div>
      </div>

      {/* Text Content */}
      <div className="relative z-10 flex w-full flex-col items-center px-4 text-center sm:px-6 lg:px-20 pt-16 sm:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="mb-6 sm:mb-8 flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 sm:px-5 py-2 backdrop-blur-md">
            <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ADE80] opacity-75"></span>
              <span className="relative inline-flex h-2 sm:h-2.5 w-2 sm:w-2.5 rounded-full bg-[#4ADE80]"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-white">
              100% BEBAS PESTISIDA
            </span>
          </div>
          
          <h1 className="mb-4 sm:mb-6 max-w-4xl text-4xl sm:text-5xl font-light leading-[1.15] tracking-tight text-white md:text-6xl lg:text-7xl">
            Sayuran Segar, <br className="hidden sm:block" />
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#4ADE80] to-[#008060]">
              Berkualitas Premium.
            </span>
          </h1>
          
          <p className="mb-8 sm:mb-10 max-w-2xl text-sm sm:text-base font-light leading-relaxed text-gray-300 md:text-lg">
            Dari kebun hidroponik lokal di Blora, Jawa Tengah. Kami menanam berbagai varietas selada segar, renyah, dan sehat menggunakan metode NFT (Nutrient Film Technique) terbaik.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <a 
              href="https://wa.me/6281234567890?text=Halo%20Admin%20Pipo%20Hydro,%20saya%20ingin%20memesan%20sayuran%20hidroponik."
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-[#008060] px-6 py-3.5 sm:px-8 sm:py-4 text-xs sm:text-sm font-semibold tracking-widest text-white transition-all hover:bg-[#4ADE80] hover:text-[#004D40] hover:shadow-[0_0_20px_rgba(74,222,128,0.4)]"
            >
              PESAN SEKARANG
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#about-us" className="flex w-full sm:w-auto items-center justify-center gap-3 rounded-full border border-white/30 bg-white/5 px-6 py-3.5 sm:px-8 sm:py-4 text-xs sm:text-sm font-semibold tracking-widest text-white backdrop-blur-md transition-all hover:bg-white hover:text-[#004D40]">
              CERITA KAMI
            </a>
          </div>
        </motion.div>
      </div>

      {/* Floating feature highlights (Bottom) */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
        className="absolute bottom-6 sm:bottom-8 z-20 hidden w-full max-w-6xl grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-6 lg:grid"
      >
        {[
          { icon: Leaf, title: "Fokus Varian Selada", desc: "Menanam Sementel, Caipira, RZ, dll." },
          { icon: Droplets, title: "Metode Hidroponik NFT", desc: "Nutrisi maksimal untuk sayuran renyah." },
          { icon: ThermometerSun, title: "Melayani Grosir & Eceran", desc: "Siap memenuhi kebutuhan harian Anda." }
        ].map((feature, i) => (
          <div key={i} className="flex items-center gap-5 rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-md transition-transform hover:-translate-y-1">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#008060]/40 text-[#4ADE80]">
              <feature.icon className="h-6 w-6" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-semibold tracking-wider text-white">{feature.title}</h4>
              <p className="mt-1 text-xs font-light text-gray-300">{feature.desc}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
