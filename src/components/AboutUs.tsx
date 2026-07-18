import { motion } from "motion/react";

export function AboutUs() {
  return (
    <section id="about-us" className="bg-[#FAFAFA] py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:gap-16 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 lg:order-1 relative aspect-[4/5] sm:aspect-square overflow-hidden group rounded-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1595806653240-5e36502283eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Botanist inspecting plants"
              className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[#004D40]/10 mix-blend-multiply opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="order-1 lg:order-2"
          >
            <div className="mb-4 flex items-center gap-4">
              <span className="h-px w-8 bg-[#008060]"></span>
              <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#008060]">
                CERITA KAMI
              </span>
            </div>
            <h2 className="mb-6 sm:mb-8 text-3xl font-light tracking-tight text-[#424242] sm:text-4xl lg:text-5xl">
              Berawal dari <br />
              <span className="font-semibold text-[#004D40]">Kopi & Inovasi.</span>
            </h2>
            <div className="space-y-4 sm:space-y-6 text-sm sm:text-base font-light leading-relaxed text-gray-600">
              <p>
                Bermula dari obrolan santai sambil ngopi bersama teman-teman, kami menyadari sebuah peluang besar. Kami ingin mematahkan stigma bahwa bertani harus selalu di lahan persawahan yang luas.
              </p>
              <p>
                Dengan tekad untuk memaksimalkan lahan kosong atau pekarangan rumah, kami membangun sistem hidroponik modern. Pipo Hydro Indonesia membuktikan bahwa pertanian modern bisa dilakukan di lahan terbatas dengan hasil yang jauh lebih optimal.
              </p>
              <p>
                Kini, kami fokus menanam berbagai varietas selada menggunakan metode hidroponik NFT yang memastikan setiap helai daun yang Anda nikmati bebas pestisida, jauh lebih renyah, dan bergizi tinggi.
              </p>
            </div>
            
            <div className="mt-12">
              <p className="mt-4 text-xs font-semibold tracking-widest text-gray-400">PENDIRI PIPO HYDRO INDONESIA</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
