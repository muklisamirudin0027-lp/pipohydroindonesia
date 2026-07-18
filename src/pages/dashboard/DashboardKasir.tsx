import { useState } from "react";
import { ShoppingBag, Receipt, ArrowDownRight, ArrowUpRight, X } from "lucide-react";

export function DashboardKasir() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const transactions = [
    { id: "INV-001", type: "Grosir", customer: "Pak Budi (Restoran A)", amount: "Rp 1.500.000", date: "Hari ini, 08:30", status: "Selesai" },
    { id: "INV-002", type: "Eceran", customer: "Ibu Siti", amount: "Rp 35.000", date: "Hari ini, 10:15", status: "Selesai" },
    { id: "INV-003", type: "Grosir", customer: "Supermarket Segar", amount: "Rp 2.100.000", date: "Kemarin", status: "Selesai" },
    { id: "INV-004", type: "Pengeluaran", customer: "Beli Nutrisi AB Mix", amount: "Rp 450.000", date: "Kemarin", status: "Keluar" },
  ];

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-light text-[#424242]">Penjualan & Kasir</h2>
          <p className="text-sm text-gray-500 mt-1">Kelola transaksi dan pantau pendapatan.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setActiveModal('pengeluaran')}
            className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            <Receipt className="h-4 w-4" />
            Catat Pengeluaran
          </button>
          <button 
            onClick={() => setActiveModal('penjualan')}
            className="flex items-center justify-center gap-2 bg-[#008060] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#004D40] transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            Transaksi Baru
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-semibold text-gray-500 mb-2">Total Pendapatan (Bulan Ini)</p>
          <h3 className="text-3xl font-light text-[#424242]">Rp 15.450.000</h3>
          <p className="text-sm text-green-500 mt-2 flex items-center gap-1 font-medium">
            <ArrowUpRight className="h-4 w-4" /> +12.5% dari bulan lalu
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-semibold text-gray-500 mb-2">Total Pengeluaran (Bulan Ini)</p>
          <h3 className="text-3xl font-light text-[#424242]">Rp 3.200.000</h3>
          <p className="text-sm text-red-500 mt-2 flex items-center gap-1 font-medium">
            <ArrowDownRight className="h-4 w-4" /> +2.1% dari bulan lalu
          </p>
        </div>
        <div className="bg-[#004D40] rounded-2xl p-6 shadow-sm text-white">
          <p className="text-sm font-semibold text-gray-300 mb-2">Laba Bersih</p>
          <h3 className="text-3xl font-light">Rp 12.250.000</h3>
          <p className="text-sm text-[#4ADE80] mt-2 flex items-center gap-1 font-medium">
            <ArrowUpRight className="h-4 w-4" /> Margin stabil
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#424242]">Riwayat Transaksi</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
              <tr>
                <th className="px-6 py-4">ID Transaksi</th>
                <th className="px-6 py-4">Keterangan / Pelanggan</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Tipe</th>
                <th className="px-6 py-4 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.id}</td>
                  <td className="px-6 py-4">{item.customer}</td>
                  <td className="px-6 py-4">{item.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'Keluar' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-medium ${item.status === 'Keluar' ? 'text-red-600' : 'text-green-600'}`}>
                    {item.status === 'Keluar' ? '-' : '+'}{item.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {activeModal === 'pengeluaran' ? 'Catat Pengeluaran' : 'Transaksi Penjualan Baru'}
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              {activeModal === 'pengeluaran' ? (
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setActiveModal(null); }}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Pengeluaran</label>
                    <select className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060]">
                      <option>Nutrisi / Pupuk</option>
                      <option>Peralatan (Netpot, dll)</option>
                      <option>Tagihan Listrik / Air</option>
                      <option>Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060]" placeholder="Misal: Beli Nutrisi AB Mix 5L" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nominal (Rp)</label>
                    <input type="number" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060]" placeholder="0" />
                  </div>
                  <button type="submit" className="w-full bg-[#008060] text-white py-3 rounded-xl font-medium hover:bg-[#00664d] transition-colors mt-2">Simpan Pengeluaran</button>
                </form>
              ) : (
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
                  <button type="submit" className="w-full bg-[#008060] text-white py-3 rounded-xl font-medium hover:bg-[#00664d] transition-colors mt-2">Catat Penjualan</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
