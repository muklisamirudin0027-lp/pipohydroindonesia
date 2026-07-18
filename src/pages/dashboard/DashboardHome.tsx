import { 
  TrendingUp, 
  Droplets, 
  ThermometerSun, 
  Leaf,
  Activity
} from "lucide-react";

export function DashboardHome() {
  const stats = [
    { label: "Total Tanaman Aktif", value: "4.250", icon: Leaf, color: "text-[#4ADE80]", bg: "bg-[#4ADE80]/10" },
    { label: "Estimasi Panen (Kg)", value: "125", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Suhu Rata-rata", value: "24°C", icon: ThermometerSun, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Tingkat Nutrisi (PPM)", value: "850", icon: Droplets, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-8">
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
            <button className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 hover:border-[#008060] hover:bg-[#008060]/5 transition-all text-sm font-medium text-gray-700">
              + Catat Masa Semai Baru
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 hover:border-[#008060] hover:bg-[#008060]/5 transition-all text-sm font-medium text-gray-700">
              + Input Data Panen
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 hover:border-[#008060] hover:bg-[#008060]/5 transition-all text-sm font-medium text-gray-700">
              + Transaksi Penjualan Baru
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
