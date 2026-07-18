import { useState } from "react";
import { Search, Filter, ShoppingCart, Star } from "lucide-react";

export function KatalogProduk() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  
  const categories = ["Semua", "Sayuran Segar", "Buah", "Bibit", "Nutrisi", "Peralatan"];
  
  const products = [
    {
      id: 1,
      name: "Selada Keriting Hidroponik",
      category: "Sayuran Segar",
      price: 15000,
      unit: "250g",
      rating: 4.8,
      sold: 124,
      image: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Bayam Merah Premium",
      category: "Sayuran Segar",
      price: 12000,
      unit: "200g",
      rating: 4.9,
      sold: 89,
      image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "Pakcoy Organik",
      category: "Sayuran Segar",
      price: 14000,
      unit: "250g",
      rating: 4.7,
      sold: 210,
      image: "https://images.unsplash.com/photo-1515589654462-81525a4dce0d?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 4,
      name: "Tomat Ceri Manis",
      category: "Buah",
      price: 25000,
      unit: "500g",
      rating: 4.9,
      sold: 342,
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 5,
      name: "Nutrisi AB Mix Daun",
      category: "Nutrisi",
      price: 45000,
      unit: "1L",
      rating: 4.8,
      sold: 56,
      image: "https://images.unsplash.com/photo-1628157790510-1c3f56ce43f1?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 6,
      name: "Netpot Hitam 5cm",
      category: "Peralatan",
      price: 10000,
      unit: "20 Pcs",
      rating: 4.6,
      sold: 430,
      image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?q=80&w=600&auto=format&fit=crop",
    }
  ];

  const filteredProducts = activeCategory === "Semua" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Cari sayuran, nutrisi, atau peralatan..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008060]/20 focus:border-[#008060] transition-all text-sm"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeCategory === cat 
                  ? "bg-[#008060] text-white" 
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
            <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold text-[#008060]">
                {product.category}
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex items-center gap-1 mb-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                <span className="text-xs text-gray-400 ml-1">({product.sold} terjual)</span>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
              <p className="text-lg font-bold text-[#008060] mb-4">
                Rp {product.price.toLocaleString("id-ID")} <span className="text-sm font-normal text-gray-500">/ {product.unit}</span>
              </p>
              
              <button className="w-full flex items-center justify-center gap-2 bg-[#008060] text-white py-2.5 rounded-xl font-medium hover:bg-[#00664d] transition-colors">
                <ShoppingCart className="h-4 w-4" />
                Tambah ke Keranjang
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
