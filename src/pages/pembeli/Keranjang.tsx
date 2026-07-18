import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";

export function Keranjang() {
  // Mock cart data
  const cartItems = [
    {
      id: 1,
      name: "Selada Keriting Hidroponik",
      price: 15000,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Tomat Ceri Manis",
      price: 25000,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=200&auto=format&fit=crop",
    }
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 10000;
  const total = subtotal + shipping;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Cart Items */}
      <div className="flex-1 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Keranjang Belanja ({cartItems.length})</h2>
        
        {cartItems.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center">
            <img src={item.image} alt={item.name} className="h-24 w-24 object-cover rounded-xl" />
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{item.name}</h3>
              <p className="text-[#008060] font-bold mt-1">Rp {item.price.toLocaleString("id-ID")}</p>
            </div>
            
            <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
              <button className="text-gray-500 hover:text-gray-900"><Minus className="h-4 w-4" /></button>
              <span className="w-6 text-center font-medium text-sm">{item.quantity}</span>
              <button className="text-gray-500 hover:text-gray-900"><Plus className="h-4 w-4" /></button>
            </div>
            
            <button className="p-2 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors ml-2">
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="w-full lg:w-80">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Ringkasan Belanja</h2>
          
          <div className="space-y-4 text-sm text-gray-600 mb-6">
            <div className="flex justify-between">
              <span>Total Harga ({cartItems.length} barang)</span>
              <span>Rp {subtotal.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between">
              <span>Ongkos Kirim</span>
              <span>Rp {shipping.toLocaleString("id-ID")}</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100 flex justify-between items-center mb-6">
            <span className="font-semibold text-gray-900">Total Tagihan</span>
            <span className="text-lg font-bold text-[#008060]">Rp {total.toLocaleString("id-ID")}</span>
          </div>
          
          <button className="w-full flex items-center justify-center gap-2 bg-[#008060] text-white py-3 rounded-xl font-semibold hover:bg-[#00664d] transition-colors shadow-sm shadow-[#008060]/20">
            Lanjut ke Pembayaran
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
