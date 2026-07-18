import { motion } from "motion/react";
import { Quote } from "lucide-react";
import { useState, useEffect } from "react";

const testimonials = [
  {
    quote: "Seladanya benar-benar renyah dan segar! Sangat berbeda dengan yang di pasar. Aman juga buat anak-anak karena bebas pestisida.",
    name: "Ibu Siti",
    location: "Blora"
  },
  {
    quote: "Untuk suplai ke restoran kami, Pipo Hydro selalu memberikan kualitas terbaik. Daunnya tebal dan tidak cepat layu.",
    name: "Budi",
    location: "Pemilik Restoran, Randublatung"
  },
  {
    quote: "Sistem hidroponiknya sangat rapi dan bersih. Kualitas sayurannya konsisten setiap kali pesan.",
    name: "Andi",
    location: "Kradenan"
  }
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-white py-16 sm:py-24 lg:py-32 border-y border-gray-100 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12 sm:mb-16 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-2 sm:gap-4">
            <span className="h-px w-6 sm:w-8 bg-[#008060]"></span>
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#008060]">
              TESTIMONI
            </span>
            <span className="h-px w-6 sm:w-8 bg-[#008060]"></span>
          </div>
          <h2 className="text-3xl font-light tracking-tight text-[#424242] sm:text-4xl">
            Apa Kata <span className="font-semibold text-[#004D40]">Pelanggan Kami</span>
          </h2>
        </motion.div>

        <div className="relative mx-auto max-w-4xl h-[320px] sm:h-[200px] flex items-center justify-center">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="absolute w-full flex flex-col items-center text-center px-4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ 
                opacity: currentIndex === index ? 1 : 0,
                x: currentIndex === index ? 0 : -50,
                pointerEvents: currentIndex === index ? "auto" : "none"
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <Quote className="h-8 w-8 sm:h-10 sm:w-10 text-[#008060]/20 mb-4 sm:mb-6" />
              <p className="text-lg sm:text-xl md:text-2xl font-light leading-relaxed text-gray-700 italic mb-6 sm:mb-8">
                "{testimonial.quote}"
              </p>
              <div>
                <h4 className="text-sm font-semibold tracking-wider text-[#004D40]">{testimonial.name}</h4>
                <p className="text-xs font-light text-gray-500 mt-1">{testimonial.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="flex justify-center mt-12 gap-2 relative z-20">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === index ? "w-8 bg-[#008060]" : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-[#008060]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-[#4ADE80]/5 blur-3xl pointer-events-none" />
    </section>
  );
}
