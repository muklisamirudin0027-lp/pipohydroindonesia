import { motion } from "motion/react";
import { Cpu, Wind, Lightbulb } from "lucide-react";

export function Technology() {
  return (
    <section id="technology" className="bg-[#0b1c17] py-32 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="mb-4 flex items-center gap-4">
              <span className="h-px w-8 bg-[#D4AF37]"></span>
              <span className="text-xs font-semibold tracking-[0.2em] text-[#D4AF37]">
                TEKNOLOGI KAMI
              </span>
            </div>
            <h2 className="mb-8 text-4xl font-light tracking-tight sm:text-5xl">
              Tumbuh dengan <br />
              <span className="font-semibold text-[#008060]">Presisi.</span>
            </h2>
            <p className="mb-12 text-lg font-light leading-relaxed text-gray-400">
              Infrastruktur pertanian hidroponik kami memanfaatkan pengetahuan mendalam dan perawatan otomatis untuk menciptakan resep pertumbuhan yang sempurna bagi setiap varietas selada.
            </p>
            
            <div className="space-y-10">
              {[
                { icon: Lightbulb, title: "PENCAHAYAAN MAKSIMAL", desc: "Memaksimalkan sinar matahari alami yang didukung lingkungan terkendali untuk rasa dan pertumbuhan terbaik." },
                { icon: Cpu, title: "NUTRISI TEPAT GUNA", desc: "Sirkulasi nutrisi secara presisi (NFT) untuk memastikan tanaman mendapatkan kebutuhan hara pada setiap fase pertumbuhan." },
                { icon: Wind, title: "SIRKULASI UDARA & IKLIM", desc: "Green house yang dirancang khusus untuk mengatur suhu, kelembapan, dan sirkulasi udara guna mencegah penyakit." }
              ].map((tech) => (
                <div key={tech.title} className="flex items-start gap-6 group">
                  <div className="rounded-full bg-white/5 p-4 text-[#D4AF37] transition-all duration-300 group-hover:bg-[#D4AF37] group-hover:text-[#0b1c17]">
                    <tech.icon className="h-6 w-6 stroke-[1.5]" />
                  </div>
                  <div>
                    <h4 className="mb-2 text-sm font-semibold tracking-wider text-white">{tech.title}</h4>
                    <p className="text-sm font-light leading-relaxed text-gray-400">{tech.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative aspect-[4/5] overflow-hidden bg-gray-900 group rounded-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1530836369250-ef71a3f5e902?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Advanced Hydroponic Facility"
              className="h-full w-full object-cover opacity-80 mix-blend-luminosity transition-all duration-1000 group-hover:mix-blend-normal group-hover:scale-105"
            />
            <div className="absolute inset-0 border border-white/10 m-6 pointer-events-none transition-transform duration-700 group-hover:scale-95 rounded-2xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
