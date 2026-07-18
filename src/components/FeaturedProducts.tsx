import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export function FeaturedProducts() {
  const products = [
    {
      id: 1,
      title: "SELADA SEMENTEL",
      description: "Daun lebat, tebal, dan renyah. Tumbuh sempurna dengan metode NFT kami, memberikan sensasi segar di setiap gigitan.",
      image:
        "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "SELADA CAIPIRA",
      description: "Tekstur lembut dengan rasa manis alami. Cocok untuk salad, burger, dan aneka sajian sehat.",
      image:
        "https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "SELADA RZ (RIJK ZWAAN)",
      description: "Benih premium dengan kualitas tinggi. Bebas pestisida dan dipanen saat tingkat kerenyahannya paling maksimal.",
      image:
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <section className="bg-[#FAFAFA] py-32" id="our-produce">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-20 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end"
        >
          <div>
            <div className="mb-4 flex items-center gap-4">
              <span className="h-px w-8 bg-[#008060]"></span>
              <span className="text-xs font-semibold tracking-[0.2em] text-[#008060]">
                PRODUK KAMI
              </span>
            </div>
            <h2 className="text-4xl font-light tracking-tight text-[#424242] sm:text-5xl">
              Hasil Panen <br />
              <span className="font-semibold text-[#004D40]">Terbaik.</span>
            </h2>
          </div>
          
          <Link to="/login" className="group flex items-center gap-3 text-xs font-semibold tracking-widest text-[#004D40] transition-colors hover:text-[#008060]">
            PESAN SEKARANG
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-x-12 gap-y-16 md:grid-cols-3">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
              className="group cursor-pointer"
            >
              <div className="mb-8 overflow-hidden bg-gray-100 aspect-[3/4] rounded-2xl">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              <div>
                <h3 className="mb-3 text-lg font-medium tracking-wider text-[#004D40]">
                  {product.title}
                </h3>
                <p className="mb-6 text-sm font-light leading-relaxed text-gray-600">
                  {product.description}
                </p>
                <div className="h-px w-12 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
