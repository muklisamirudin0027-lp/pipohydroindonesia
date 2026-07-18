import { User, MapPin, Bell, Shield } from "lucide-react";

export function PengaturanPembeli() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Pengaturan Akun</h2>
      
      {/* Profile Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-[#008060]/10 flex items-center justify-center text-[#008060] text-xl font-bold">
            P
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">Pelanggan Setia</h3>
            <p className="text-sm text-gray-500">pelanggan@example.com</p>
          </div>
          <button className="ml-auto px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Ubah Foto
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
              <input type="text" defaultValue="Pelanggan Setia" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#008060]/20 focus:border-[#008060] outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Nomor Telepon</label>
              <input type="text" defaultValue="081234567890" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#008060]/20 focus:border-[#008060] outline-none" />
            </div>
          </div>
          <div className="pt-4">
            <button className="px-6 py-2 bg-[#008060] text-white rounded-xl font-medium hover:bg-[#00664d] transition-colors">
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>

      {/* Other Settings Sections */}
      <div className="grid grid-cols-1 gap-4">
        {[
          { icon: MapPin, title: "Alamat Pengiriman", description: "Atur alamat pengiriman pesanan Anda" },
          { icon: Bell, title: "Notifikasi", description: "Atur preferensi notifikasi email dan push" },
          { icon: Shield, title: "Keamanan Akun", description: "Ubah kata sandi dan keamanan" }
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between cursor-pointer hover:border-[#008060]/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-[#008060]">Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}
