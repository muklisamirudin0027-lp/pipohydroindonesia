import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="bg-white py-16 sm:py-24 lg:py-32 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center mb-12 sm:mb-16"
        >
          <div className="mb-4 flex items-center justify-center gap-2 sm:gap-4">
            <span className="h-px w-6 sm:w-8 bg-[#008060]"></span>
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#008060]">
              HUBUNGI KAMI
            </span>
            <span className="h-px w-6 sm:w-8 bg-[#008060]"></span>
          </div>
          <h2 className="text-3xl font-light tracking-tight text-[#424242] sm:text-4xl lg:text-5xl">
            Mari <span className="font-semibold text-[#004D40]">Berbincang.</span>
          </h2>
          <p className="mt-4 sm:mt-6 text-sm sm:text-lg font-light leading-relaxed text-gray-600">
            Tertarik untuk menjadi mitra grosir, memesan untuk kebutuhan eceran, atau sekadar ingin berkunjung ke kebun kami di Blora? Kirimkan pesan Anda.
          </p>
        </motion.div>

        <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-4 flex flex-col justify-between h-full bg-[#004D40] p-8 sm:p-10 rounded-2xl text-white"
          >
            <div>
              <h3 className="mb-6 text-lg sm:text-xl font-light tracking-wide">Lokasi Kebun Kami</h3>
              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-semibold tracking-wider text-[#4ADE80] mb-2">KRADENAN</h4>
                  <p className="text-sm font-light text-gray-300">
                    2 lokasi di Dukuh Tambak,<br />
                    Desa Sumber, Kradenan, Blora
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold tracking-wider text-[#4ADE80] mb-2">RANDUBLATUNG 1</h4>
                  <p className="text-sm font-light text-gray-300">
                    Desa Kutukan,<br />
                    Randublatung, Blora
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold tracking-wider text-[#4ADE80] mb-2">RANDUBLATUNG 2</h4>
                  <p className="text-sm font-light text-gray-300">
                    Desa Nglego,<br />
                    Randublatung, Blora
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="lg:col-span-8 bg-[#FAFAFA] p-6 sm:p-10 lg:p-12 border border-gray-100 shadow-sm rounded-2xl"
          >
            <form className="space-y-8 sm:space-y-10">
              <div className="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold tracking-wider text-gray-500 mb-3">NAMA LENGKAP</label>
                  <input 
                    type="text" 
                    id="name"
                    className="w-full border-b border-gray-300 bg-transparent py-3 text-[#424242] placeholder-gray-400 focus:border-[#008060] focus:outline-none transition-colors"
                    placeholder="Budi Santoso"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold tracking-wider text-gray-500 mb-3">NOMOR WHATSAPP</label>
                  <input 
                    type="tel" 
                    id="phone"
                    className="w-full border-b border-gray-300 bg-transparent py-3 text-[#424242] placeholder-gray-400 focus:border-[#008060] focus:outline-none transition-colors"
                    placeholder="08123456789"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-xs font-semibold tracking-wider text-gray-500 mb-3">JENIS PERTANYAAN</label>
                <select 
                  id="subject"
                  className="w-full border-b border-gray-300 bg-transparent py-3 text-[#424242] focus:border-[#008060] focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option>Pemesanan Grosir</option>
                  <option>Pemesanan Eceran</option>
                  <option>Pertanyaan Umum</option>
                  <option>Kunjungan Kebun</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-semibold tracking-wider text-gray-500 mb-3">PESAN</label>
                <textarea 
                  id="message"
                  rows={4}
                  className="w-full border-b border-gray-300 bg-transparent py-3 text-[#424242] placeholder-gray-400 focus:border-[#008060] focus:outline-none transition-colors resize-none"
                  placeholder="Apa yang bisa kami bantu?"
                ></textarea>
              </div>

              <div className="pt-4">
                <button 
                  type="button"
                  className="group flex items-center gap-4 bg-[#004D40] px-10 py-5 text-xs font-semibold tracking-widest text-white transition-all hover:bg-[#008060] w-full justify-center md:w-auto shadow-md hover:shadow-lg rounded-full"
                >
                  KIRIM PESAN
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
