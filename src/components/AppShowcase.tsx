import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { 
  Sprout, 
  ShoppingBag, 
  TrendingUp, 
  Printer, 
  Share2, 
  ArrowRight, 
  Tablet, 
  Smartphone, 
  NotebookPen,
  Activity,
  CheckCircle2
} from "lucide-react";

export function AppShowcase() {
  const [activeTab, setActiveTab] = useState("kebun");

  const appFeatures = [
    {
      id: "kebun",
      icon: Sprout,
      label: "MANAJEMEN KEBUN",
      title: "Pencatatan Siklus Hidroponik Otomatis",
      description: "Catat setiap tahapan budidaya selada mulai dari penyemaian benih (Semaian), pemindahan ke meja pembesaran (Pindah Tanam), hingga saat panen tiba. Pantau sisa kapasitas lubang tanam meja Anda secara real-time.",
      bullets: [
        "Estimasi tanggal panen otomatis berdasarkan varietas",
        "Pemberitahuan pemeliharaan & nutrisi berkala",
        "Log riwayat keberhasilan panen per meja"
      ],
      mockupBg: "bg-emerald-950",
      previewComponent: (
        <div className="bg-[#111827] rounded-2xl border border-gray-800 p-5 font-sans text-xs text-gray-300 shadow-2xl h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="font-bold text-white uppercase tracking-wider text-[10px]">MEJA UTAMA - NFT A</span>
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[9px] font-semibold">Aktif</span>
            </div>
            <div className="space-y-3">
              <div className="bg-white/5 rounded-xl p-3 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-gray-400">Varietas Tanaman</p>
                  <p className="text-white font-bold text-sm">Selada Caipira (RZ)</p>
                </div>
                <Sprout className="h-6 w-6 text-emerald-400" />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-[9px] text-gray-400">Tanggal Semai</p>
                  <p className="text-white font-semibold">12 Juli 2026</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-[9px] text-gray-400">Estimasi Panen</p>
                  <p className="text-[#4ADE80] font-bold">12 Agustus 2026</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span>Progress Pertumbuhan (Hari Ke-15)</span>
                  <span className="font-bold text-emerald-400">50%</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-[#4ADE80] h-full w-[50%]"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-800/60 mt-4 flex items-center justify-between text-[10px]">
            <span className="text-gray-400">Kapasitas Terisi: 480 / 600 Netpot</span>
            <span className="text-emerald-400 font-bold">80% Terpakai</span>
          </div>
        </div>
      )
    },
    {
      id: "kasir",
      icon: ShoppingBag,
      label: "KASIR DIGITAL",
      title: "Kasir Penjualan Praktis & Cepat",
      description: "Sistem point-of-sale (POS) sederhana yang didesain khusus untuk transaksi hasil kebun. Input berat sayuran (kg), hitung total harga otomatis, dan catat nama pelanggan dalam hitungan detik.",
      bullets: [
        "Pencatatan kasir instan tanpa ribet",
        "Kalkulasi total harga & kembalian otomatis",
        "Tersimpan dalam database keuangan otomatis"
      ],
      mockupBg: "bg-[#0B3A2C]",
      previewComponent: (
        <div className="bg-[#111827] rounded-2xl border border-gray-800 p-5 font-sans text-xs text-gray-300 shadow-2xl h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-3">
              <span className="font-bold text-white uppercase tracking-wider text-[10px]">KERANJANG KASIR</span>
              <span className="text-gray-400">Pelanggan: Ibu Linda</span>
            </div>
            
            <div className="space-y-2 max-h-[140px] overflow-y-auto">
              <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                <div>
                  <p className="font-bold text-white">Selada Sementel</p>
                  <p className="text-[10px] text-gray-400">3.5 kg x Rp 25.000</p>
                </div>
                <p className="font-bold text-emerald-400">Rp 87.500</p>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                <div>
                  <p className="font-bold text-white">Selada Caipira</p>
                  <p className="text-[10px] text-gray-400">2.0 kg x Rp 28.000</p>
                </div>
                <p className="font-bold text-emerald-400">Rp 56.000</p>
              </div>
            </div>

            <div className="mt-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
              <div className="flex justify-between text-xs font-semibold text-gray-300">
                <span>Subtotal</span>
                <span>Rp 143.500</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white mt-1 pt-1 border-t border-emerald-500/10">
                <span>TOTAL BAYAR</span>
                <span className="text-[#4ADE80]">Rp 143.500</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <div className="flex-1 bg-emerald-600 text-white rounded-lg p-2 text-center font-bold text-[10px] flex items-center justify-center gap-1">
              <Printer className="h-3 w-3" /> CETAK
            </div>
            <div className="flex-1 bg-blue-600 text-white rounded-lg p-2 text-center font-bold text-[10px] flex items-center justify-center gap-1">
              <Share2 className="h-3 w-3" /> KIRIM WA
            </div>
          </div>
        </div>
      )
    },
    {
      id: "struk",
      icon: Printer,
      label: "CETAK & BAGIKAN NOTA",
      title: "Nota Digital Siap WhatsApp & Print",
      description: "Berikan pelayanan terbaik untuk pembeli Anda. Unduh gambar struk beresolusi super tinggi dan bagikan langsung nota belanja format teks resmi ke nomor WhatsApp pelanggan secara instan.",
      bullets: [
        "Unduh struk gambar format HD 4x lebih tajam",
        "Format teks nota rapih langsung kirim WA",
        "Support print fisik via printer thermal Bluetooth"
      ],
      mockupBg: "bg-slate-900",
      previewComponent: (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 font-mono text-[9px] text-gray-800 shadow-2xl h-full flex flex-col justify-between">
          <div className="text-center border-b border-dashed border-gray-400 pb-3 mb-3">
            <div className="h-7 w-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 mx-auto mb-1">
              <Sprout className="h-3.5 w-3.5" />
            </div>
            <h4 className="font-bold uppercase tracking-tight text-[10px]">PIPO HYDRO BLORA</h4>
            <p className="text-gray-500">Kec. Blora, Kab. Blora</p>
            <p className="text-gray-500">Telp: 0812-3456-7890</p>
          </div>

          <div className="space-y-1 text-left mb-3">
            <div className="flex justify-between">
              <span>No. Nota:</span>
              <span>TX-20260720-001</span>
            </div>
            <div className="flex justify-between">
              <span>Tanggal :</span>
              <span>20/07/2026 13:45</span>
            </div>
            <div className="flex justify-between pb-1 border-b border-dashed border-gray-300">
              <span>Kasir   :</span>
              <span>Owner Pipo</span>
            </div>
          </div>

          <div className="space-y-1.5 text-left pb-2 border-b border-dashed border-gray-300 mb-2">
            <div className="flex justify-between font-bold">
              <span>SELADA SEMENTEL (3.5kg)</span>
              <span>Rp 87.500</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>SELADA CAIPIRA (2.0kg)</span>
              <span>Rp 56.000</span>
            </div>
          </div>

          <div className="space-y-1 text-left mb-4">
            <div className="flex justify-between font-bold text-[10px]">
              <span>TOTAL BELANJA :</span>
              <span>Rp 143.500</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tunai         :</span>
              <span>Rp 150.000</span>
            </div>
            <div className="flex justify-between font-bold text-emerald-700">
              <span>Kembalian     :</span>
              <span>Rp 6.500</span>
            </div>
          </div>

          <div className="text-center text-gray-500 pt-2 border-t border-dashed border-gray-400">
            <p className="font-bold">TERIMA KASIH ATAS KUNJUNGANNYA!</p>
            <p className="italic">Sayur Sehat Keluarga Hebat</p>
          </div>
        </div>
      )
    },
    {
      id: "laporan",
      icon: TrendingUp,
      label: "LAPORAN KEUANGAN",
      title: "Pantau Profitabilitas Secara Real-Time",
      description: "Lihat ringkasan keuntungan bersih kebun Anda. Grafik performa omset, sisa stok, modal belanja nutrisi/benih, dan status kesehatan finansial otomatis terhitung dari catatan harian.",
      bullets: [
        "Grafik omset & laba bersih otomatis",
        "Pencatatan pengeluaran operasional kebun",
        "Evaluasi efisiensi biaya produksi"
      ],
      mockupBg: "bg-emerald-900",
      previewComponent: (
        <div className="bg-[#111827] rounded-2xl border border-gray-800 p-5 font-sans text-xs text-gray-300 shadow-2xl h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-gray-800 mb-3">
              <span className="font-bold text-white uppercase tracking-wider text-[10px]">RINGKASAN BULAN INI</span>
              <span className="text-[#4ADE80] bg-emerald-500/10 px-2 py-0.5 rounded text-[9px] font-semibold">+18.5%</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-white/5 rounded-lg p-2.5">
                <p className="text-[9px] text-gray-400">Total Pendapatan</p>
                <p className="text-white font-bold text-sm">Rp 4.250.000</p>
              </div>
              <div className="bg-white/5 rounded-lg p-2.5">
                <p className="text-[9px] text-gray-400">Pengeluaran</p>
                <p className="text-red-400 font-bold text-sm">Rp 1.150.000</p>
              </div>
            </div>

            <div className="bg-[#008060]/10 border border-[#008060]/20 rounded-xl p-3 mb-2 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-emerald-200 font-medium">ESTIMASI LABA BERSIH</p>
                <p className="text-[#4ADE80] font-black text-base leading-none mt-1">Rp 3.100.000</p>
              </div>
              <TrendingUp className="h-7 w-7 text-[#4ADE80]" />
            </div>

            {/* Simulated bar chart */}
            <div className="pt-2">
              <p className="text-[8px] text-gray-400 mb-1.5">Penjualan Selada Mingguan</p>
              <div className="flex items-end justify-between h-14 pt-1 px-2 bg-white/5 rounded-lg">
                {[40, 65, 55, 95].map((val, idx) => (
                  <div key={idx} className="flex flex-col items-center w-6">
                    <div className="bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t w-full" style={{ height: `${val * 0.4}px` }}></div>
                    <span className="text-[7px] text-gray-400 mt-1">M-{idx+1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentFeature = appFeatures.find(f => f.id === activeTab) || appFeatures[0];

  return (
    <section className="bg-gradient-to-b from-[#FAFAFA] to-white py-16 sm:py-24 lg:py-32 border-t border-gray-100" id="aplikasi">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-12 sm:mb-20 text-center max-w-3xl mx-auto">
          <div className="mb-4 flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-[#008060]"></span>
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#008060] uppercase">
              TERSEDIA APLIKASI WEB GRATIS
            </span>
            <span className="h-px w-8 bg-[#008060]"></span>
          </div>
          <h2 className="text-3xl font-light tracking-tight text-[#424242] sm:text-4xl lg:text-5xl leading-tight">
            Urus Kebun Lebih Mudah Dengan <br />
            <span className="font-semibold text-[#004D40]">Aplikasi Catat-Panen Pipo.</span>
          </h2>
          <p className="mt-4 sm:mt-6 text-sm sm:text-base font-light text-gray-500 leading-relaxed">
            Tidak hanya menjual sayuran premium, kami juga menyediakan <strong>Aplikasi Pencatatan & Kasir Hidroponik Mandiri</strong> yang bisa digunakan langsung melalui web browser Anda! Cocok untuk petani hidroponik mandiri dalam mengelola kebun dan pembukuan kasir.
          </p>
        </div>

        {/* Feature Grid with Interactive Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Column: Interactive Selector */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              {appFeatures.map((feature) => {
                const isActive = activeTab === feature.id;
                const Icon = feature.icon;
                return (
                  <button
                    key={feature.id}
                    onClick={() => setActiveTab(feature.id)}
                    className={`w-full flex items-start gap-4 p-4 sm:p-5 rounded-2xl border transition-all text-left group ${
                      isActive 
                        ? "bg-[#008060] border-[#008060] text-white shadow-lg shadow-[#008060]/10 scale-[1.02]" 
                        : "bg-white border-gray-200/80 text-[#424242] hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                      isActive 
                        ? "bg-white/10 text-white" 
                        : "bg-emerald-50 text-[#008060] group-hover:bg-[#008060]/10"
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className={`text-[9px] font-black tracking-widest leading-none mb-1.5 ${
                        isActive ? "text-emerald-200" : "text-[#008060]"
                      }`}>
                        {feature.label}
                      </p>
                      <h4 className="text-sm font-bold tracking-tight mb-1">{feature.title}</h4>
                      {isActive && (
                        <p className="text-xs text-white/95 font-light leading-relaxed mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                          {feature.description}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom CTA Block */}
            <div className="bg-gradient-to-br from-[#004D40] to-[#00332A] p-6 rounded-3xl text-white shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#4ADE80]/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
              <h5 className="text-sm font-bold mb-1.5 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#4ADE80]" />
                100% Berbasis Web & Cloud
              </h5>
              <p className="text-[11px] text-emerald-100 font-light leading-relaxed mb-4">
                Tidak perlu install! Akses langsung dari Laptop, Tablet, maupun HP Anda. Data kebun ter-sinkronisasi aman di cloud.
              </p>
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="flex-1 bg-[#008060] hover:bg-[#4ADE80] hover:text-[#004D40] text-white text-xs font-bold text-center py-3 px-4 rounded-xl transition-all tracking-wider flex items-center justify-center gap-1.5"
                >
                  BUKA APLIKASI
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  to="/register"
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-bold text-center py-3 px-4 rounded-xl transition-all tracking-wider"
                >
                  DAFTAR GRATIS
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Mockup Showcase */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between flex-1 shadow-sm relative overflow-hidden">
              
              {/* Outer grid decor */}
              <div className="absolute inset-0 bg-[radial-gradient(#008060_0.75px,transparent_0.75px)] [background-size:16px_16px] opacity-[0.03] pointer-events-none"></div>

              {/* Window Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6 relative z-10">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                  <span className="text-[10px] text-gray-400 font-mono ml-2">app.pipohydro.com</span>
                </div>
                <div className="flex gap-2 text-[10px] text-gray-500 font-semibold bg-gray-50 border border-gray-100 rounded-lg p-1 px-2 items-center">
                  <Tablet className="h-3.5 w-3.5 text-[#008060]" />
                  <span>RESPONSIVE PREVIEW</span>
                </div>
              </div>

              {/* Dynamic Content Frame with AnimatePresence */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center flex-1 relative z-10">
                
                {/* Visual Preview panel */}
                <div className="md:col-span-6 flex justify-center">
                  <div className="w-full max-w-[280px] aspect-[9/16] relative">
                    {/* Device Frame mockup */}
                    <div className="absolute inset-0 border-8 border-gray-800 rounded-[2.5rem] bg-gray-950 p-2 shadow-2xl flex flex-col overflow-hidden">
                      {/* Notch */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-4 bg-gray-800 rounded-b-xl z-20 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                      </div>
                      
                      {/* Screen content wrapper */}
                      <div className="flex-1 bg-[#111827] rounded-[1.8rem] overflow-hidden pt-4 relative z-10">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.25 }}
                            className="h-full"
                          >
                            {currentFeature.previewComponent}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bullet details panel */}
                <div className="md:col-span-6 space-y-4 text-left">
                  <div className="bg-emerald-50/50 border border-emerald-50 rounded-2xl p-5">
                    <span className="text-[9px] font-black text-[#008060] tracking-widest uppercase bg-emerald-100/60 px-2 py-0.5 rounded">
                      Detail Fitur Utama
                    </span>
                    <h3 className="text-lg font-bold text-[#424242] mt-2 mb-3">
                      {currentFeature.title}
                    </h3>
                    <p className="text-xs text-gray-500 font-light leading-relaxed mb-4">
                      {currentFeature.description}
                    </p>
                    
                    <ul className="space-y-2">
                      {currentFeature.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs font-medium text-gray-700">
                          <CheckCircle2 className="h-4 w-4 text-[#008060] shrink-0" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-start gap-4 pl-5">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400">
                      <Smartphone className="h-4 w-4" />
                      <span>Android / iOS</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400">
                      <Tablet className="h-4 w-4" />
                      <span>Tablet / PC</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400">
                      <NotebookPen className="h-4 w-4" />
                      <span>Cloud Sync</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
