import React, { useState } from "react";
import { Image as ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GalleryItem } from "../lib/websiteService";

interface GallerySectionProps {
  gallery: Array<GalleryItem>;
}

export function GallerySection({ gallery }: GallerySectionProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIdx === null) return;
    setActiveIdx((activeIdx + 1) % gallery.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIdx === null) return;
    setActiveIdx((activeIdx - 1 + gallery.length) % gallery.length);
  };

  return (
    <section id="galeri" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-[#008060] uppercase bg-[#008060]/10 px-3 py-1.5 rounded-full">
            Dokumentasi Kebun
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-4 tracking-tight">
            Galeri Foto Pipo Hydro
          </h2>
          <p className="text-gray-600 mt-4 text-base md:text-lg">
            Intip keindahan, higienitas, dan proses budidaya selada segar bebas pestisida di instalasi hidroponik NFT kami.
          </p>
        </div>

        {/* Empty State */}
        {gallery.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            Belum ada dokumentasi foto galeri saat ini.
          </div>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {gallery.map((item, idx) => (
            <motion.div
              layout
              key={item.id}
              onClick={() => setActiveIdx(idx)}
              className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm cursor-pointer hover:shadow-lg transition-all duration-300"
            >
              {/* Image */}
              <img
                src={item.imageUrl}
                alt={item.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />

              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-[#004D40]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-black tracking-widest uppercase mb-1.5">
                  <ImageIcon className="h-3.5 w-3.5" /> LIHAT FOTO
                </div>
                <p className="text-white font-bold text-sm leading-snug line-clamp-2">
                  {item.caption}
                </p>
                <span className="text-gray-300 text-[10px] mt-1.5 block">
                  {item.createdAt}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {activeIdx !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 select-none"
            onClick={() => setActiveIdx(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveIdx(null)}
              className="absolute top-6 right-6 z-50 text-white hover:text-gray-300 bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation Left */}
            <button
              onClick={handlePrev}
              className="absolute left-4 md:left-8 z-40 text-white hover:text-gray-300 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all"
            >
              <ChevronLeft className="h-6 w-6 stroke-[2.5]" />
            </button>

            {/* Main Lightbox Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-4xl max-h-[80vh] flex flex-col items-center gap-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={gallery[activeIdx].imageUrl}
                alt={gallery[activeIdx].caption}
                className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
              
              {/* Caption */}
              <div className="text-center text-white max-w-2xl px-4">
                <p className="font-semibold text-base leading-relaxed">
                  {gallery[activeIdx].caption}
                </p>
                <span className="text-xs text-gray-400 mt-1 block">
                  Diposting: {gallery[activeIdx].createdAt}
                </span>
              </div>
            </motion.div>

            {/* Navigation Right */}
            <button
              onClick={handleNext}
              className="absolute right-4 md:right-8 z-40 text-white hover:text-gray-300 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all"
            >
              <ChevronRight className="h-6 w-6 stroke-[2.5]" />
            </button>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
