import { User, Lock, Bell, Store } from "lucide-react";

export function DashboardPengaturan() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-light text-[#424242]">Pengaturan Akun</h2>
        <p className="text-sm text-gray-500 mt-1">Kelola preferensi dan profil Anda.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button className="px-6 py-4 text-sm font-semibold text-[#008060] border-b-2 border-[#008060]">
            Profil Kebun
          </button>
          <button className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">
            Akun & Keamanan
          </button>
          <button className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">
            Notifikasi
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="flex items-center gap-6 pb-8 border-b border-gray-50">
            <div className="h-24 w-24 rounded-full bg-[#008060]/10 flex items-center justify-center text-[#008060] text-3xl font-bold">
              PM
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#424242]">Petani Milenial</h3>
              <p className="text-sm text-gray-500 mb-3">Admin Kebun Kradenan</p>
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
                Ubah Foto
              </button>
            </div>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Kebun / Usaha</label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="text" defaultValue="Pipo Hydro Indonesia" className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#008060]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Penanggung Jawab</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="text" defaultValue="Muklis" className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#008060]" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Kebun Utama</label>
              <textarea rows={3} defaultValue="Dukuh Tambak, Desa Sumber, Kec. Kradenan, Kab. Blora, Jawa Tengah" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#008060]"></textarea>
            </div>

            <div className="pt-4 flex justify-end">
              <button type="button" className="bg-[#008060] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#004D40] transition-colors">
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
