import { Leaf, Search, Plus } from "lucide-react";

export function DashboardKebun() {
  const varietasList = [
    { name: "Selada Sementel", jumlah: 1500, hst: 25, status: "Siap Panen", meja: "Meja 1 - Kradenan" },
    { name: "Selada Caipira", jumlah: 1200, hst: 15, status: "Pertumbuhan", meja: "Meja 2 - Kradenan" },
    { name: "Selada RZ", jumlah: 1550, hst: 5, status: "Persemaian", meja: "Meja 3 - Kradenan" },
    { name: "Selada Sementel", jumlah: 2000, hst: 20, status: "Pertumbuhan", meja: "Meja 1 - Randublatung" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-light text-[#424242]">Manajemen Kebun</h2>
          <p className="text-sm text-gray-500 mt-1">Pantau siklus tanam dan varietas selada Anda.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-[#008060] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#004D40] transition-colors">
          <Plus className="h-4 w-4" />
          Tambah Siklus Tanam
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari varietas atau lokasi..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#008060]"
            />
          </div>
          <div className="flex gap-2 text-sm">
            <select className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#008060]">
              <option>Semua Lokasi</option>
              <option>Kradenan</option>
              <option>Randublatung</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
              <tr>
                <th className="px-6 py-4">Varietas</th>
                <th className="px-6 py-4">Lokasi / Meja</th>
                <th className="px-6 py-4">Jumlah (Lubang Tanam)</th>
                <th className="px-6 py-4">Umur (HST)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {varietasList.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <Leaf className="h-4 w-4" />
                    </div>
                    {item.name}
                  </td>
                  <td className="px-6 py-4">{item.meja}</td>
                  <td className="px-6 py-4">{item.jumlah}</td>
                  <td className="px-6 py-4">{item.hst} Hari</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'Siap Panen' ? 'bg-green-100 text-green-700' :
                      item.status === 'Pertumbuhan' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#008060] hover:text-[#004D40] font-medium text-sm">Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
