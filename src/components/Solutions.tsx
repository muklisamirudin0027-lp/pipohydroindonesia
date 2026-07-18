import { motion } from "motion/react";
import { Droplets, ShieldCheck, Sun } from "lucide-react";

export function Solutions() {
  const features = [
    {
      icon: Droplets,
      title: "METODE HIDROPONIK NFT",
      description: "Kami menggunakan Nutrient Film Technique, di mana akar tanaman dialiri nutrisi tipis secara terus-menerus. Memastikan selada mendapatkan nutrisi maksimal sepanjang waktu.",
    },
    {
      icon: ShieldCheck,
      title: "100% BEBAS PESTISIDA",
      description: "Ditanam di dalam green house (climate-controlled), selada kami terlindungi secara alami dari hama tanpa menggunakan bahan kimia berbahaya. Sangat aman untuk dikonsumsi keluarga.",
    },
    {
      icon: Sun,
      title: "LEBIH RENYAH & SEGAR",
      description: "Karena tercukupinya air dan nutrisi, hasil panen selada kami memiliki tekstur daun yang lebih tebal, renyah, segar, dan tahan lebih lama jika disimpan.",
    },
  ];

  return (
    <section id="solutions" className="bg-[#004D40] py-32 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#008060]/20 rounded-full blur-3xl -mr-40 -mt-40 mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#4ADE80]/10 rounded-full blur-3xl -ml-20 -mb-20 mix-blend-screen pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-20 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-[#4ADE80]"></span>
            <span className="text-xs font-semibold tracking-[0.2em] text-[#4ADE80]">
              MENGAPA KAMI
            </span>
            <span className="h-px w-8 bg-[#4ADE80]"></span>
          </div>
          <h2 className="text-4xl font-light tracking-tight text-white sm:text-5xl">
            Kualitas Unggul, <span className="font-semibold text-[#4ADE80]">Alami & Segar.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
              className="group flex flex-col items-center text-center p-10 border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-500 hover:bg-white/10 hover:-translate-y-2 rounded-2xl"
            >
              <div className="mb-8 rounded-full bg-[#4ADE80]/10 p-5 text-[#4ADE80] transition-colors duration-500 group-hover:bg-[#4ADE80] group-hover:text-[#004D40] shadow-[0_0_15px_rgba(74,222,128,0.1)] group-hover:shadow-[0_0_25px_rgba(74,222,128,0.4)]">
                <feature.icon className="h-8 w-8 stroke-[1.5]" />
              </div>
              <h3 className="mb-4 text-sm font-semibold tracking-[0.1em] text-white">
                {feature.title}
              </h3>
              <p className="text-sm font-light leading-relaxed text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
