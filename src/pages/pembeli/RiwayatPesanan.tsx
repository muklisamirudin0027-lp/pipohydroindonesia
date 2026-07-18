import { Package, Clock, CheckCircle, ChevronRight } from "lucide-react";

export function RiwayatPesanan() {
  const orders = [
    {
      id: "INV/20240321/001",
      date: "21 Mar 2024",
      status: "Selesai",
      items: "Selada Keriting Hidroponik (2x), Tomat Ceri (1x)",
      total: 65000,
    },
    {
      id: "INV/20240315/042",
      date: "15 Mar 2024",
      status: "Selesai",
      items: "Pakcoy Organik (3x)",
      total: 52000,
    },
    {
      id: "INV/20240310/112",
      date: "10 Mar 2024",
      status: "Dibatalkan",
      items: "Nutrisi AB Mix Daun (1x)",
      total: 55000,
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Riwayat Pesanan</h2>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between group cursor-pointer hover:border-[#008060]/30 transition-colors">
            
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                <Package className="h-6 w-6 text-gray-400" />
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-semibold text-sm text-gray-900">{order.id}</span>
                  <span className="text-xs text-gray-400">{order.date}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-1">{order.items}</p>
                
                <div className="flex items-center gap-2">
                  {order.status === "Selesai" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                      <CheckCircle className="h-3.5 w-3.5" /> Selesai
                    </span>
                  ) : order.status === "Dibatalkan" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-full">
                      <Clock className="h-3.5 w-3.5" /> Dibatalkan
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                      <Clock className="h-3.5 w-3.5" /> Diproses
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-6 pt-4 border-t border-gray-100 md:border-0 md:pt-0">
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Total Belanja</p>
                <p className="font-bold text-gray-900">Rp {order.total.toLocaleString("id-ID")}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#008060] transition-colors" />
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
