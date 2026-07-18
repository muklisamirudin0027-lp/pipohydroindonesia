import { useState } from "react";
import { 
  TrendingUp, 
  Droplets, 
  ThermometerSun, 
  Leaf,
  Activity,
  X
} from "lucide-react";

export function DashboardHome() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const stats = [
    { label: "Total Tanaman Aktif", value: "4.250", icon: Leaf, color: "text-[#4ADE80]", bg: "bg-[#4ADE80]/10" },
    { label: "Estimasi Panen (Kg)", value: "125", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Suhu Rata-rata", value: "24°C", icon: ThermometerSun, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Tingkat Nutrisi (PPM)", value: "850", icon: Droplets, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-8 relative">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wider text-gray-500 mb-2">{stat.label.toUpperCase()}</p>
              <h3 className="text-3xl font-light text-[#424242]">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kebun Status */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#424242]">Status Kebun Saya</h3>
            <span className="flex items-center gap-2 text-xs font-semibold text-[#008060] bg-[#008060]/10 px-3 py-1 rounded-full">
              <Activity className="h-3 w-3" />
              SISTEM NORMAL
            </span>
          </div>
          
          <div className="space-y-4">
            {["Selada Sementel (Meja 1)", "Selada Caipira (Meja 2)", "Selada RZ (Meja 3)"].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-[#008060]/10 flex items-center justify-center">
                    <Leaf className="h-5 w-5 text-[#008060]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#424242]">{item}</h4>
                    <p className="text-xs text-gray-500">HST: {20 - (i * 5)} Hari (Hari Setelah Tanam)</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-gray-500">Panen dalam</span>
                  <p className="text-sm font-bold text-[#008060]">{10 + (i * 5)} Hari</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-[#424242] mb-6">Aksi Cepat</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setActiveModal('semai')}
              className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 hover:border-[#008060] hover:bg-[#008060]/5 transition-all text-sm font-medium text-gray-700"
            >
              + Catat Masa Semai Baru
            </button>
            <button 
              onClick={() => setActiveModal('panen')}
              className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 hover:border-[#008060] hover:bg-[#008060]/5 transition-all text-sm font-medium text-gray-700"
            >
              + Input Data Panen
            </button>
            <button 
              onClick={() => setActiveModal('transaksi')}
              className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 hover:border-[#008060] hover:bg-[#008060]/5 transition-all text-sm font-medium text-gray-700"
            >
              + Transaksi Penjualan Baru
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {activeModal === 'semai' && 'Catat Masa Semai Baru'}
                {activeModal === 'panen' && 'Input Data Panen'}
                {activeModal === 'transaksi' && 'Transaksi Penjualan Baru'}
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              {activeModal === 'semai' && (
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setActiveModal(null); }}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Varietas / Nama Tanaman</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060]" placeholder="Misal: Selada Sementel, Pakcoy, dll" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Benih (Tray)</label>
                    <input type="number" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060]" placeholder="Contoh: 10" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Semai</label>
                    <input type="date" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060]" />
                  </div>
                  <button type="submit" className="w-full bg-[#008060] text-white py-3 rounded-xl font-medium hover:bg-[#00664d] transition-colors mt-2">Simpan Data</button>
                </form>
              )}
              
              {activeModal === 'panen' && (
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setActiveModal(null); }}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Meja / Blok</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060]" placeholder="Misal: Meja 1, Area A, dll" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hasil Panen (Kg)</label>
                    <input type="number" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060]" placeholder="Contoh: 25.5" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kualitas</label>
                    <select className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060]">
                      <option>Grade A (Premium)</option>
                      <option>Grade B (Standar)</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-[#008060] text-white py-3 rounded-xl font-medium hover:bg-[#00664d] transition-colors mt-2">Simpan Data Panen</button>
                </form>
              )}
              
              {activeModal === 'transaksi' && (
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setActiveModal(null); }}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pembeli</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060]" placeholder="Nama pelanggan / toko" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Tanaman</label>
                      <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060]" placeholder="Jenis tanaman" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah (Kg)</label>
                      <input type="number" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060]" placeholder="0" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Harga (Rp)</label>
                    <input type="number" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060]" placeholder="0" />
                  </div>
                  <button type="submit" className="w-full bg-[#008060] text-white py-3 rounded-xl font-medium hover:bg-[#00664d] transition-colors mt-2">Catat Transaksi</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
