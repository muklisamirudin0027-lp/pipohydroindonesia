import { useState } from "react";
import { BookOpen, User, Calendar, X, ArrowRight, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Article } from "../lib/websiteService";

interface ArticlesSectionProps {
  articles: Array<Article>;
}

export function ArticlesSection({ articles }: ArticlesSectionProps) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  const categories = ["Semua", ...Array.from(new Set(articles.map((art) => art.category)))];

  const filteredArticles = articles.filter((art) => {
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "Semua" || art.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="artikel" className="py-20 bg-[#F9FBF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-[#008060] uppercase bg-[#008060]/10 px-3 py-1.5 rounded-full">
            Kabar & Informasi
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-4 tracking-tight">
            Artikel & Perkembangan Kebun
          </h2>
          <p className="text-gray-600 mt-4 text-base md:text-lg">
            Temukan artikel edukasi seputar selada hidroponik, nutrisi tanaman, tips berkebun modern, hingga info terbaru dari Pipo Hydro Indonesia.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-4 border-b border-gray-100">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-[#008060] text-white shadow-sm"
                    : "bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Cari artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008060]"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-8">
            <p className="text-gray-400 text-sm">Tidak ada artikel yang cocok dengan pencarian Anda.</p>
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <motion.article
              layout
              key={article.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col group h-full cursor-pointer"
              onClick={() => setSelectedArticle(article)}
            >
              {/* Cover Image */}
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 left-4 bg-[#008060] text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-md shadow-sm">
                  {article.category}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-grow space-y-4">
                <div className="flex items-center gap-4 text-gray-400 text-[11px] font-semibold">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{article.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    <span>{article.author}</span>
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 group-hover:text-[#008060] transition-colors line-clamp-2 text-lg leading-snug">
                  {article.title}
                </h3>

                <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>

                <div className="pt-2 mt-auto flex items-center gap-1 text-[#008060] font-bold text-xs tracking-wider uppercase">
                  Baca Selengkapnya <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-text">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 z-10 bg-black/40 hover:bg-black/60 text-white p-2.5 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Scrollable Container */}
              <div className="overflow-y-auto flex-1">
                {/* Header Banner */}
                <div className="relative h-[250px] md:h-[350px] bg-gray-900">
                  <img
                    src={selectedArticle.image}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover opacity-85"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 md:p-10">
                    <span className="bg-[#008060] text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-md self-start mb-3">
                      {selectedArticle.category}
                    </span>
                    <h2 className="text-xl md:text-3xl font-extrabold text-white leading-tight tracking-tight">
                      {selectedArticle.title}
                    </h2>
                  </div>
                </div>

                {/* Metadata & Content */}
                <div className="p-6 md:p-10 space-y-6">
                  <div className="flex flex-wrap gap-4 items-center text-gray-400 text-xs font-semibold border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-1.5">
                      <User className="h-4 w-4 text-[#008060]" />
                      <span>Diposting oleh: <strong className="text-gray-700">{selectedArticle.author}</strong></span>
                    </div>
                    <span className="text-gray-200">|</span>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-[#008060]" />
                      <span>{selectedArticle.createdAt}</span>
                    </div>
                  </div>

                  {/* Body Text */}
                  <div className="text-gray-600 text-sm md:text-base leading-relaxed space-y-4 whitespace-pre-wrap">
                    {selectedArticle.content}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs tracking-widest rounded-xl transition-all uppercase"
                >
                  Tutup Artikel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
