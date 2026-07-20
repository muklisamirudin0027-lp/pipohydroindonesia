import React, { useState, useEffect } from "react";
import { ShoppingBag, Receipt, ArrowDownRight, ArrowUpRight, X, Printer, CheckCircle2, AlertCircle, FileText, Share2, Sprout, AlertTriangle, HelpCircle, Download } from "lucide-react";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import * as htmlToImage from 'html-to-image';

interface SiklusTanam {
  id: string;
  varietasName: string;
  tanggalSemai: string;
  tanggalPindahTanam?: string;
  tanggalPanen?: string;
  hasilKg?: number;
}

interface Transaction {
  id: string;
  type: string;
  customer: string;
  amount: string;
  date: string;
  status: 'Masuk' | 'Keluar';
  items?: { name: string; qty: number; price: number; total: number }[];
}

export function DashboardKasir() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    type: "delete" | "save";
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    if (activeModal === 'struk') {
      setLogoError(false);
    }
  }, [activeModal]);
  
  // Farm Profile
  const [farmProfile, setFarmProfile] = useState<{
    name: string;
    address: string;
    contact: string;
    logo: string;
  }>({
    name: "PIPO HYDROFARM",
    address: "Jl. Pertanian Modern No.1",
    contact: "0812-3456-7890",
    logo: ""
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedStruk, setSelectedStruk] = useState<Transaction | null>(null);

  // States for forms
  const [kategoriPengeluaran, setKategoriPengeluaran] = useState("Nutrisi / Pupuk");
  const [keteranganPengeluaran, setKeteranganPengeluaran] = useState("");
  const [pengeluaranNominal, setPengeluaranNominal] = useState("");

  const [namaPembeli, setNamaPembeli] = useState("");
  const [jenisTanaman, setJenisTanaman] = useState("");
  const [penjualanJumlahKg, setPenjualanJumlahKg] = useState("");
  const [penjualanHargaPerKg, setPenjualanHargaPerKg] = useState("");

  const [availableCrops, setAvailableCrops] = useState<{name: string, stock: number}[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFarmProfile(prev => ({
              ...prev,
              name: data.farmName || prev.name,
              address: data.address || prev.address,
              contact: data.contactNumber || prev.contact,
              logo: data.logoUrl || prev.logo
            }));
          }
        } catch (error: any) {
          const isOffline = error instanceof Error && (
            error.message.toLowerCase().includes("offline") || 
            error.message.toLowerCase().includes("could not reach") || 
            error.message.toLowerCase().includes("network") || 
            error.message.toLowerCase().includes("unavailable")
          );
          if (isOffline) {
            console.warn("Error fetching user data in Cashier (client is offline):", error.message || error);
          } else {
            console.error("Error fetching user data:", error);
          }
        }
      }
    };
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData();
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Load transactions
    const savedTx = localStorage.getItem("pipo_transactions");
    if (savedTx) {
      setTransactions(JSON.parse(savedTx));
    } else {
      // Default dummy data if empty
      const initial: Transaction[] = [
        { id: "INV-001", type: "Penjualan", customer: "Pak Budi (Restoran A)", amount: "Rp 1.500.000", date: "18 Jul 2026, 08:30", status: "Masuk" },
        { id: "INV-002", type: "Penjualan", customer: "Ibu Siti", amount: "Rp 35.000", date: "18 Jul 2026, 10:15", status: "Masuk" },
        { id: "INV-003", type: "Listrik / Air", customer: "Bayar Listrik", amount: "Rp 250.000", date: "17 Jul 2026, 09:00", status: "Keluar" },
      ];
      setTransactions(initial);
      localStorage.setItem("pipo_transactions", JSON.stringify(initial));
    }

    // Load harvested crops for Penjualan
    const savedSiklus = localStorage.getItem("pipo_siklus");
    if (savedSiklus) {
      const parsedSiklus: SiklusTanam[] = JSON.parse(savedSiklus);
      const stockMap = new Map<string, number>();
      parsedSiklus.forEach(siklus => {
        if (siklus.tanggalPanen && siklus.hasilKg) {
          const current = stockMap.get(siklus.varietasName) || 0;
          stockMap.set(siklus.varietasName, current + siklus.hasilKg);
        }
      });
      
      const crops = Array.from(stockMap.entries()).map(([name, stock]) => ({ name, stock }));
      setAvailableCrops(crops);
      if (crops.length > 0 && !jenisTanaman) {
        setJenisTanaman(crops[0].name);
      }
    }
  }, [activeModal]);

  // Toast auto-hide
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const formatNumber = (value: string) => {
    const number = value.replace(/\D/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const calculateTotalPenjualan = () => {
    const jumlah = parseFloat(penjualanJumlahKg) || 0;
    const harga = parseInt(penjualanHargaPerKg.replace(/\./g, "")) || 0;
    return formatNumber((jumlah * harga).toString());
  };

  // Kalkulasi total
  const totalPendapatan = transactions
    .filter(t => t.status === 'Masuk')
    .reduce((sum, t) => sum + parseInt(t.amount.replace(/\D/g, "")), 0);
    
  const totalPengeluaran = transactions
    .filter(t => t.status === 'Keluar')
    .reduce((sum, t) => sum + parseInt(t.amount.replace(/\D/g, "")), 0);
    
  const labaBersih = totalPendapatan - totalPengeluaran;

  const handlePengeluaranSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keteranganPengeluaran || !pengeluaranNominal) {
      setToastMessage({ text: "Harap isi semua kolom pengeluaran", type: 'error' });
      return;
    }

    setConfirmDialog({
      title: "Catat Pengeluaran",
      message: `Apakah Anda yakin ingin menyimpan catatan pengeluaran sebesar Rp ${pengeluaranNominal}?`,
      type: "save",
      onConfirm: () => {
        const newTx: Transaction = {
          id: `TRX-${Date.now().toString().slice(-4)}`,
          type: kategoriPengeluaran,
          customer: keteranganPengeluaran,
          amount: `Rp ${pengeluaranNominal}`,
          date: new Date().toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          status: 'Keluar'
        };

        const updated = [newTx, ...transactions];
        setTransactions(updated);
        localStorage.setItem("pipo_transactions", JSON.stringify(updated));

        setToastMessage({ text: "Pengeluaran berhasil dicatat", type: 'success' });
        setActiveModal(null);
        setKeteranganPengeluaran("");
        setPengeluaranNominal("");
        setConfirmDialog(null);
      }
    });
  };

  const handlePenjualanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPembeli || !jenisTanaman || !penjualanJumlahKg || !penjualanHargaPerKg) {
      setToastMessage({ text: "Harap isi semua kolom penjualan", type: 'error' });
      return;
    }

    const totalStr = calculateTotalPenjualan();
    setConfirmDialog({
      title: "Konfirmasi Transaksi Baru",
      message: `Apakah Anda yakin ingin menyimpan transaksi penjualan untuk "${namaPembeli}" dengan total Rp ${totalStr}?`,
      type: "save",
      onConfirm: () => {
        const newTx: Transaction = {
          id: `INV-${Date.now().toString().slice(-4)}`,
          type: 'Penjualan',
          customer: namaPembeli,
          amount: `Rp ${totalStr}`,
          date: new Date().toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          status: 'Masuk',
          items: [{
            name: jenisTanaman,
            qty: parseFloat(penjualanJumlahKg),
            price: parseInt(penjualanHargaPerKg.replace(/\./g, "")),
            total: parseInt(totalStr.replace(/\./g, ""))
          }]
        };

        const updated = [newTx, ...transactions];
        setTransactions(updated);
        localStorage.setItem("pipo_transactions", JSON.stringify(updated));

        setActiveModal("struk");
        setSelectedStruk(newTx);
        setToastMessage({ text: "Penjualan berhasil dicatat", type: 'success' });

        setNamaPembeli("");
        setPenjualanJumlahKg("");
        setPenjualanHargaPerKg("");
        setConfirmDialog(null);
      }
    });
  };

  const getFarmMonogram = (name: string) => {
    if (!name) return "PH";
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleWhatsAppShare = async () => {
    if (!selectedStruk) return;
    const element = document.getElementById('receipt-content');
    if (!element) return;

    setToastMessage({ text: "Menyiapkan struk...", type: 'success' });

    try {
      // 1. Generate very high-quality blob image (pixelRatio 4)
      const blob = await htmlToImage.toBlob(element, { 
        backgroundColor: '#ffffff', 
        pixelRatio: 4, 
        cacheBust: true,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        }
      });

      if (!blob) throw new Error("Gagal membuat gambar struk.");

      const file = new File([blob], `Struk_${selectedStruk.id}.png`, { type: 'image/png' });

      // 2. Try native mobile share (Web Share API) first for complete native image sharing
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `Struk Penjualan ${selectedStruk.id}`,
            text: `Terima kasih! Berikut struk belanja dari ${farmProfile.name}.`
          });
          setToastMessage({ text: "Struk berhasil dibagikan!", type: 'success' });
          return;
        } catch (shareErr) {
          console.log("Web Share dibatalkan atau tidak didukung di lingkungan ini:", shareErr);
        }
      }

      // 3. Fallback for Desktop/PC: Copy high-quality image to clipboard
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ]);
        setToastMessage({ text: "Gambar struk disalin ke clipboard! Tempel (Ctrl+V) di WA.", type: 'success' });
      } catch (clipErr) {
        console.error("Gagal menyalin ke clipboard:", clipErr);
        setToastMessage({ text: "Gambar gagal disalin. Menggunakan teks nota.", type: 'error' });
      }

      // 4. Open the pre-filled beautiful formatted text receipt in WhatsApp
      const itemsText = selectedStruk.items?.map(item => 
        `- ${item.name}: ${item.qty} kg x Rp ${formatNumber(item.price.toString())} = Rp ${formatNumber(item.total.toString())}`
      ).join('\n') || "";

      const text = `*${farmProfile.name}*
${farmProfile.address ? `${farmProfile.address}` : ""}
${farmProfile.contact ? `Telp: ${farmProfile.contact}` : ""}
------------------------------
*NOTA PENJUALAN*
No. Nota  : ${selectedStruk.id}
Tanggal   : ${selectedStruk.date}
Pelanggan : ${selectedStruk.customer}
------------------------------
*Rincian Belanja:*
${itemsText}
------------------------------
*TOTAL BAYAR: ${selectedStruk.amount}*

Terima kasih atas kunjungan Anda!
_Sayur Sehat Keluarga Hebat_

*(Anda juga dapat menempel/Paste (Ctrl+V) gambar struk super tajam yang otomatis tersalin di kolom chat WhatsApp Anda!)*`;

      // Redirect to WhatsApp
      setTimeout(() => {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      }, 800);

    } catch (error) {
      console.error("Gagal membagikan struk:", error);
      setToastMessage({ text: "Gagal memproses struk untuk dibagikan", type: 'error' });
    }
  };

  const handleDownloadStruk = async () => {
    const element = document.getElementById('receipt-content');
    if (!element || !selectedStruk) return;
    
    setToastMessage({ text: "Menyiapkan gambar tajam...", type: 'success' });
    
    try {
      const blob = await htmlToImage.toBlob(element, { 
        backgroundColor: '#ffffff', 
        pixelRatio: 4, // 4x scale for super crisp, high-definition quality
        cacheBust: true,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        }
      });
      if (!blob) throw new Error("Gagal membuat gambar struk.");
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Struk_${selectedStruk.id}.png`;
      a.click();
      URL.revokeObjectURL(url);
      setToastMessage({ text: "Gambar struk tajam berhasil diunduh!", type: 'success' });
    } catch (error) {
      console.error("Gagal mengunduh struk:", error);
      setToastMessage({ text: "Gagal mengunduh struk", type: 'error' });
    }
  };

  const handlePrintStruk = () => {
    const element = document.getElementById('receipt-content');
    if (!element) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Cetak Struk - ${selectedStruk?.id}</title>
          <style>
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              font-family: monospace;
              padding: 20px;
              background: #ffffff;
              color: #000000;
              display: flex;
              justify-content: center;
              font-size: 12px;
            }
            #receipt-content {
              max-width: 320px;
              width: 100%;
            }
            .border-t { border-top: 1px dashed #000; }
            .border-b { border-bottom: 1px dashed #000; }
            .flex { display: flex; }
            .justify-between { justify-content: space-between; }
            .text-center { text-align: center; }
            .font-bold { font-weight: bold; }
            .text-sm { font-size: 12px; }
            .text-xs { font-size: 10px; }
            .text-base { font-size: 14px; }
            .uppercase { text-transform: uppercase; }
            .my-2 { margin-top: 8px; margin-bottom: 8px; }
            .my-3 { margin-top: 12px; margin-bottom: 12px; }
            .py-3 { padding-top: 12px; padding-bottom: 12px; }
            .pb-3 { padding-bottom: 12px; }
            .mb-2 { margin-bottom: 8px; }
            .mb-3 { margin-bottom: 12px; }
            .mb-5 { margin-bottom: 20px; }
            .mt-1 { margin-top: 4px; }
            .mt-2 { margin-top: 8px; }
            .mt-6 { margin-top: 24px; }
            .pt-4 { padding-top: 16px; }
            .space-y-1 > * + * { margin-top: 4px; }
            .space-y-2 > * + * { margin-top: 8px; }
            .text-gray-400, .text-gray-500 { color: #555555; }
            .text-gray-900, .text-gray-800 { color: #000000; }
            .truncate {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .monogram-badge {
              display: flex !important;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              width: 56px;
              height: 56px;
              border-radius: 12px;
              background: linear-gradient(135deg, #008060, #004D40) !important;
              color: #ffffff !important;
              margin: 0 auto 8px auto;
              border: 1px solid rgba(0, 128, 96, 0.2);
              position: relative;
              overflow: hidden;
            }
            .monogram-badge svg {
              width: 20px;
              height: 20px;
              color: #a7f3d0 !important;
              margin-bottom: 2px;
            }
            .monogram-badge span {
              font-size: 11px;
              font-weight: 900;
              letter-spacing: 0.05em;
              line-height: 1;
            }
            img { max-height: 50px; width: auto; object-fit: contain; }
          </style>
        </head>
        <body>
          <div id="receipt-content">
            ${element.innerHTML}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6 md:space-y-8 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${
          toastMessage.type === 'success' 
            ? 'bg-green-50 text-green-700 border-green-100' 
            : 'bg-red-50 text-red-700 border-red-100'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span className="font-medium text-sm">{toastMessage.text}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight hidden md:block">Kasir & Keuangan</h1>
          <p className="text-gray-500 mt-1 hidden md:block">Catat transaksi penjualan dan pengeluaran operasional.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setActiveModal('pengeluaran')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-3 md:py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors h-11 md:h-10"
          >
            <Receipt className="h-4 w-4" />
            Catat Pengeluaran
          </button>
          <button 
            onClick={() => setActiveModal('penjualan')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#008060] text-white px-5 py-3 md:py-2.5 rounded-xl text-sm font-semibold hover:bg-[#004D40] transition-colors h-11 md:h-10"
          >
            <ShoppingBag className="h-4 w-4" />
            Transaksi Baru
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
          <p className="text-xs md:text-sm font-semibold text-gray-500 mb-1.5 md:mb-2">Total Pendapatan</p>
          <h3 className="text-2xl md:text-3xl font-light text-[#424242]">Rp {formatNumber(totalPendapatan.toString())}</h3>
          <p className="text-xs md:text-sm text-green-500 mt-1.5 md:mt-2 flex items-center gap-1 font-medium">
            <ArrowUpRight className="h-4 w-4" /> Pemasukan kas
          </p>
        </div>
        
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
          <p className="text-xs md:text-sm font-semibold text-gray-500 mb-1.5 md:mb-2">Total Pengeluaran</p>
          <h3 className="text-2xl md:text-3xl font-light text-[#424242]">Rp {formatNumber(totalPengeluaran.toString())}</h3>
          <p className="text-xs md:text-sm text-red-500 mt-1.5 md:mt-2 flex items-center gap-1 font-medium">
            <ArrowDownRight className="h-4 w-4" /> Operasional kebun
          </p>
        </div>

        <div className="bg-[#004D40] rounded-2xl p-5 md:p-6 shadow-sm text-white">
          <p className="text-xs md:text-sm font-semibold text-gray-300 mb-1.5 md:mb-2">Laba Bersih</p>
          <h3 className="text-2xl md:text-3xl font-light">Rp {formatNumber(labaBersih.toString())}</h3>
          <p className="text-xs md:text-sm text-[#4ADE80] mt-1.5 md:mt-2 flex items-center gap-1 font-medium">
            <ArrowUpRight className="h-4 w-4" /> Keuntungan saat ini
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-base md:text-lg font-semibold text-[#424242]">Riwayat Transaksi</h3>
        </div>
        
        {/* Desktop View Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
              <tr>
                <th className="px-6 py-4">ID Transaksi</th>
                <th className="px-6 py-4">Keterangan / Pelanggan</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Tipe</th>
                <th className="px-6 py-4 text-right">Nominal</th>
                <th className="px-6 py-4 text-right">Aksi</th>
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
                  <td className="px-6 py-4 text-right">
                    {item.items && item.items.length > 0 && (
                      <button 
                        onClick={() => {
                          setSelectedStruk(item);
                          setActiveModal("struk");
                        }}
                        className="text-gray-500 hover:text-[#008060] transition-colors"
                        title="Lihat Struk"
                      >
                        <FileText className="h-5 w-5 inline" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Belum ada transaksi yang dicatat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View Card List */}
        <div className="block md:hidden p-4 space-y-3">
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              Belum ada transaksi yang dicatat.
            </div>
          ) : (
            transactions.map((item, idx) => (
              <div key={idx} className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-xs space-y-2.5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-mono font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                      {item.id}
                    </span>
                    <h4 className="font-semibold text-gray-800 text-sm mt-1.5">{item.customer}</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">{item.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm ${item.status === 'Keluar' ? 'text-red-600' : 'text-green-600'}`}>
                      {item.status === 'Keluar' ? '-' : '+'}{item.amount}
                    </p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 ${
                      item.status === 'Keluar' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                </div>

                {item.items && item.items.length > 0 && (
                  <div className="pt-2 border-t border-gray-50 flex justify-end">
                    <button
                      onClick={() => {
                        setSelectedStruk(item);
                        setActiveModal("struk");
                      }}
                      className="flex items-center gap-1.5 text-xs text-[#008060] font-bold bg-[#008060]/5 px-3 py-1.5 rounded-lg border border-[#008060]/10 hover:bg-[#008060]/10 transition-colors"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Lihat Struk
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'pengeluaran' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Catat Pengeluaran</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <form className="space-y-4" onSubmit={handlePengeluaranSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Pengeluaran</label>
                  <select 
                    value={kategoriPengeluaran}
                    onChange={(e) => setKategoriPengeluaran(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060]"
                    required
                  >
                    <option>Nutrisi / Pupuk</option>
                    <option>Peralatan (Netpot, dll)</option>
                    <option>Listrik / Air</option>
                    <option>Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                  <input 
                    type="text" 
                    value={keteranganPengeluaran}
                    onChange={(e) => setKeteranganPengeluaran(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060]" 
                    placeholder="Misal: Beli Nutrisi AB Mix 5L" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nominal (Rp)</label>
                  <input 
                    type="text" 
                    value={pengeluaranNominal}
                    onChange={(e) => setPengeluaranNominal(formatNumber(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060]" 
                    placeholder="0" 
                    required
                  />
                </div>
                <button type="submit" className="w-full bg-[#008060] text-white py-3 rounded-xl font-medium hover:bg-[#00664d] transition-colors mt-2">
                  Simpan Pengeluaran
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'penjualan' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Transaksi Penjualan Baru</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <form className="space-y-4" onSubmit={handlePenjualanSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pembeli</label>
                  <input 
                    type="text" 
                    value={namaPembeli}
                    onChange={(e) => setNamaPembeli(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060]" 
                    placeholder="Nama pelanggan / toko" 
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Tanaman</label>
                    <select 
                      value={jenisTanaman}
                      onChange={(e) => setJenisTanaman(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060]"
                      required
                    >
                      {availableCrops.length > 0 ? (
                        availableCrops.map((crop, i) => (
                          <option key={i} value={crop.name}>{crop.name} (Stok: {crop.stock} kg)</option>
                        ))
                      ) : (
                        <option value="" disabled>Belum ada panen</option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah (Kg)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      value={penjualanJumlahKg}
                      onChange={(e) => setPenjualanJumlahKg(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060]" 
                      placeholder="0.0" 
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga per Kg (Rp)</label>
                    <input 
                      type="text" 
                      value={penjualanHargaPerKg}
                      onChange={(e) => setPenjualanHargaPerKg(formatNumber(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060]" 
                      placeholder="0" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Harga (Rp)</label>
                    <input 
                      type="text" 
                      value={calculateTotalPenjualan()}
                      readOnly
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-[#008060] focus:outline-none" 
                      placeholder="0" 
                    />
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#008060] text-white py-3 rounded-xl font-medium hover:bg-[#00664d] transition-colors mt-2">
                  Catat Penjualan
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Struk */}
      {activeModal === 'struk' && selectedStruk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Struk Penjualan</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 bg-gray-100/60 overflow-y-auto max-h-[70vh]">
              {/* Receipt Content */}
              <div id="receipt-content" className="p-6 bg-white text-gray-800 font-mono text-sm border border-gray-200 rounded-2xl shadow-sm mx-auto max-w-[340px]">
                <div className="text-center mb-5 flex flex-col items-center">
                  {!logoError && farmProfile.logo ? (
                    <img 
                      src={farmProfile.logo} 
                      onError={() => setLogoError(true)} 
                      alt="Logo Toko" 
                      className="h-14 w-auto mb-2 object-contain max-h-14" 
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="monogram-badge h-14 w-14 rounded-2xl bg-gradient-to-br from-[#008060] to-[#004D40] flex flex-col items-center justify-center text-white mb-2 shadow-sm border border-emerald-700/20 relative overflow-hidden mx-auto">
                      <div className="absolute top-0 right-0 w-8 h-8 bg-white/10 rounded-full blur-xs -mr-2 -mt-2"></div>
                      <Sprout className="h-5 w-5 text-emerald-200 mb-0.5" />
                      <span className="text-[11px] font-black tracking-wider leading-none">{getFarmMonogram(farmProfile.name)}</span>
                    </div>
                  )}
                  <h2 className="text-sm font-bold tracking-tight text-gray-900 uppercase">{farmProfile.name}</h2>
                  {farmProfile.address && <p className="text-[10px] text-gray-400 mt-1 leading-relaxed text-center">{farmProfile.address}</p>}
                  {farmProfile.contact && <p className="text-[10px] text-gray-400 text-center">{farmProfile.contact}</p>}
                </div>
                
                <div className="border-t border-b border-dashed border-gray-300 py-3 my-3 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">TANGGAL:</span>
                    <span className="font-semibold text-gray-700">{selectedStruk.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">NO. NOTA:</span>
                    <span className="font-semibold text-gray-700">{selectedStruk.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">PELANGGAN:</span>
                    <span className="font-semibold text-gray-700 truncate max-w-[160px]">{selectedStruk.customer}</span>
                  </div>
                </div>

                <div className="border-b border-dashed border-gray-300 pb-3 mb-3 min-h-[60px] text-xs space-y-2">
                  {selectedStruk.items?.map((item, i) => (
                    <div key={i}>
                      <div className="font-bold text-gray-800 text-sm">{item.name}</div>
                      <div className="flex justify-between text-gray-500 mt-0.5">
                        <span>{item.qty} kg x Rp {formatNumber(item.price.toString())}</span>
                        <span className="font-semibold text-gray-800">Rp {formatNumber(item.total.toString())}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between font-bold text-base text-[#008060] my-2">
                  <span>TOTAL BAYAR</span>
                  <span>{selectedStruk.amount}</span>
                </div>
                
                <div className="text-center mt-6 pt-4 border-t border-dashed border-gray-200 text-[10px] text-gray-400 leading-normal">
                  <p className="font-bold text-gray-500">TERIMA KASIH ATAS KUNJUNGANNYA</p>
                  <p className="mt-1 font-medium">Sayur Sehat Keluarga Hebat</p>
                  <p className="text-[9px] mt-2 tracking-widest text-gray-300">=========================</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 border-t border-gray-100">
              <div className="grid grid-cols-4 gap-2 text-center">
                {/* Button 1: Tutup */}
                <button 
                  onClick={() => setActiveModal(null)}
                  className="flex flex-col items-center justify-center p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all group shadow-sm"
                >
                  <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700 transition-colors mb-1.5">
                    <X className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">Tutup</span>
                </button>

                {/* Button 2: Kirim WA */}
                <button 
                  onClick={handleWhatsAppShare}
                  className="flex flex-col items-center justify-center p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 active:scale-95 transition-all group shadow-sm"
                >
                  <div className="h-9 w-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors mb-1.5">
                    <Share2 className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">Kirim WA</span>
                </button>

                {/* Button 3: Cetak */}
                <button 
                  onClick={handlePrintStruk}
                  className="flex flex-col items-center justify-center p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-sky-50 hover:border-sky-200 active:scale-95 transition-all group shadow-sm"
                >
                  <div className="h-9 w-9 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 group-hover:bg-sky-100 group-hover:text-sky-700 transition-colors mb-1.5">
                    <Printer className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">Cetak</span>
                </button>

                {/* Button 4: Unduh */}
                <button 
                  onClick={handleDownloadStruk}
                  className="flex flex-col items-center justify-center p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-amber-50 hover:border-amber-200 active:scale-95 transition-all group shadow-sm"
                >
                  <div className="h-9 w-9 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors mb-1.5">
                    <Download className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">Unduh</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog Pop-up */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-150 border border-gray-100">
            <div className="p-6 text-center">
              <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-4 ${
                confirmDialog.type === "delete" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
              }`}>
                {confirmDialog.type === "delete" ? (
                  <AlertTriangle className="h-6 w-6" />
                ) : (
                  <HelpCircle className="h-6 w-6" />
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{confirmDialog.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">{confirmDialog.message}</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmDialog(null)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={confirmDialog.onConfirm}
                  className={`px-4 py-2.5 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm ${
                    confirmDialog.type === "delete" 
                      ? "bg-red-600 hover:bg-red-700" 
                      : "bg-[#008060] hover:bg-[#004D40]"
                  }`}
                >
                  Ya, Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
