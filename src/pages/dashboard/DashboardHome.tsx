import React, { useState, useEffect } from "react";
import { 
  Leaf,
  Activity,
  X,
  Sprout,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  Plus,
  Scale,
  Calendar,
  Layers,
  Clock,
  CheckCircle,
  FileText,
  AlertTriangle,
  HelpCircle
} from "lucide-react";

interface SiklusTanam {
  id: string;
  varietasName: string;
  meja: string;
  jumlah: number;
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

export function DashboardHome() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    type: "delete" | "save";
  } | null>(null);
  const [siklusList, setSiklusList] = useState<SiklusTanam[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Form states for Quick Actions on Home Screen
  const [formSemai, setFormSemai] = useState({
    varietasName: "",
    meja: "",
    jumlah: "",
    tanggalSemai: new Date().toISOString().split('T')[0]
  });
  
  const [formPanen, setFormPanen] = useState({
    siklusId: "",
    hasilKg: "",
    tanggalPanen: new Date().toISOString().split('T')[0]
  });

  const [formJual, setFormJual] = useState({
    customer: "",
    varietasName: "",
    qty: "",
    pricePerKg: "",
    date: new Date().toISOString().split('T')[0]
  });

  const [toast, setToast] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Load data from local storage
  const loadData = () => {
    const savedSiklus = localStorage.getItem("pipo_siklus");
    const savedTx = localStorage.getItem("pipo_transactions");

    let currentSiklus: SiklusTanam[] = [];
    if (savedSiklus) {
      currentSiklus = JSON.parse(savedSiklus);
      setSiklusList(currentSiklus);
    } else {
      // Default initial siklus
      const today = new Date();
      const semingguLalu = new Date(today);
      semingguLalu.setDate(today.getDate() - 7);
      
      const tigaMingguLalu = new Date(today);
      tigaMingguLalu.setDate(today.getDate() - 21);

      const defaultSiklus: SiklusTanam[] = [
        { 
          id: "1", 
          varietasName: "Selada Sementel", 
          meja: "Meja 1", 
          jumlah: 500, 
          tanggalSemai: semingguLalu.toISOString().split('T')[0],
          tanggalPindahTanam: ""
        },
        { 
          id: "2", 
          varietasName: "Selada Caipira", 
          meja: "Meja 2", 
          jumlah: 450, 
          tanggalSemai: tigaMingguLalu.toISOString().split('T')[0],
          tanggalPindahTanam: semingguLalu.toISOString().split('T')[0]
        }
      ];
      currentSiklus = defaultSiklus;
      setSiklusList(defaultSiklus);
      localStorage.setItem("pipo_siklus", JSON.stringify(defaultSiklus));
    }

    if (savedTx) {
      setTransactions(JSON.parse(savedTx));
    } else {
      const initialTx: Transaction[] = [
        { id: "INV-001", type: "Penjualan", customer: "Pak Budi (Restoran A)", amount: "Rp 1.500.000", date: "18 Jul 2026, 08:30", status: "Masuk" },
        { id: "INV-002", type: "Penjualan", customer: "Ibu Siti", amount: "Rp 35.000", date: "18 Jul 2026, 10:15", status: "Masuk" },
        { id: "INV-003", type: "Operasional", customer: "Beli Nutrisi AB Mix", amount: "Rp 250.000", date: "17 Jul 2026, 09:00", status: "Keluar" },
      ];
      setTransactions(initialTx);
      localStorage.setItem("pipo_transactions", JSON.stringify(initialTx));
    }

    // Set default values for forms
    if (currentSiklus.length > 0) {
      const activeOnly = currentSiklus.filter(s => !s.tanggalPanen);
      if (activeOnly.length > 0) {
        setFormPanen(prev => ({ ...prev, siklusId: activeOnly[0].id }));
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Trigger load when modal becomes active to fetch latest stock or list
  useEffect(() => {
    if (activeModal) {
      loadData();
    }
  }, [activeModal]);

  // Toast timer
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Calculations for plant statuses
  const calculatePlantStatus = (siklus: SiklusTanam) => {
    if (siklus.tanggalPanen) {
      return { status: "Dipanen", umurText: `${siklus.hasilKg} kg`, progress: 100, isReady: false };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let status = "Persemaian";
    let umurText = "0 HSS";
    let progress = 0;
    let isReady = false;
    
    if (siklus.tanggalPindahTanam) {
      const pTanamDate = new Date(siklus.tanggalPindahTanam);
      pTanamDate.setHours(0,0,0,0);
      
      if (today >= pTanamDate) {
        const diffTime = Math.abs(today.getTime() - pTanamDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        umurText = `${diffDays} HST`;
        
        // Assume 30 days of growth is standard harvest ready
        progress = Math.min(Math.round((diffDays / 30) * 100), 100);
        
        if (diffDays >= 30) {
          status = "Siap Panen";
          isReady = true;
        } else {
          status = "Pertumbuhan";
        }
        return { status, umurText, progress, isReady };
      }
    }
    
    if (siklus.tanggalSemai) {
      const semaiDate = new Date(siklus.tanggalSemai);
      semaiDate.setHours(0,0,0,0);
      const diffTime = today.getTime() - semaiDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays >= 0) {
        umurText = `${diffDays} HSS`;
        // Assume 14 days of seeding is standard pindah tanam ready
        progress = Math.min(Math.round((diffDays / 14) * 100), 100);
        if (diffDays >= 14) {
          status = "Siap Pindah Tanam";
        }
      } else {
        umurText = "Belum Semai";
        progress = 0;
      }
      return { status, umurText, progress, isReady };
    }
    
    return { status, umurText, progress, isReady };
  };

  // Real calculations for dashboard cards
  const activeSiklus = siklusList.filter(s => !s.tanggalPanen);
  const totalLubangTanam = activeSiklus.reduce((sum, s) => sum + s.jumlah, 0);
  const activeSiklusCount = activeSiklus.length;
  
  const totalHasilPanen = siklusList
    .filter(s => s.tanggalPanen && s.hasilKg)
    .reduce((sum, s) => sum + (s.hasilKg || 0), 0);

  const totalPemasukan = transactions
    .filter(t => t.status === "Masuk")
    .reduce((sum, t) => {
      const amt = parseInt(t.amount.replace(/\D/g, "")) || 0;
      return sum + amt;
    }, 0);

  // Group harvested stocks for Sale selection
  const stockMap = new Map<string, number>();
  siklusList.forEach(s => {
    if (s.tanggalPanen && s.hasilKg) {
      const current = stockMap.get(s.varietasName) || 0;
      stockMap.set(s.varietasName, current + s.hasilKg);
    }
  });
  const availableCrops = Array.from(stockMap.entries()).map(([name, stock]) => ({ name, stock }));

  // Form Submissions
  const handleSemaiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSemai.varietasName || !formSemai.jumlah) {
      setToast({ text: "Harap isi varietas dan jumlah benih", type: "error" });
      return;
    }

    setConfirmDialog({
      title: "Simpan Siklus Semaian",
      message: `Apakah Anda yakin ingin memulai penyemaian "${formSemai.varietasName}" sebanyak ${formSemai.jumlah} lubang tanam?`,
      type: "save",
      onConfirm: () => {
        const newSiklus: SiklusTanam = {
          id: `SKL-${Date.now()}`,
          varietasName: formSemai.varietasName,
          meja: formSemai.meja || "Meja Belum Ditentukan",
          jumlah: parseInt(formSemai.jumlah) || 0,
          tanggalSemai: formSemai.tanggalSemai,
          tanggalPindahTanam: ""
        };

        const updated = [...siklusList, newSiklus];
        setSiklusList(updated);
        localStorage.setItem("pipo_siklus", JSON.stringify(updated));

        setToast({ text: `Siklus ${formSemai.varietasName} berhasil disemai!`, type: "success" });
        setActiveModal(null);
        setFormSemai({
          varietasName: "",
          meja: "",
          jumlah: "",
          tanggalSemai: new Date().toISOString().split('T')[0]
        });
        setConfirmDialog(null);
      }
    });
  };

  const handlePanenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPanen.siklusId || !formPanen.hasilKg) {
      setToast({ text: "Harap pilih siklus dan isi hasil panen", type: "error" });
      return;
    }

    const item = siklusList.find(s => s.id === formPanen.siklusId);
    setConfirmDialog({
      title: "Konfirmasi Hasil Panen",
      message: `Apakah Anda yakin data panen untuk "${item?.varietasName || ""}" sebesar ${formPanen.hasilKg} kg sudah benar?`,
      type: "save",
      onConfirm: () => {
        const updated = siklusList.map(s => {
          if (s.id === formPanen.siklusId) {
            return {
              ...s,
              tanggalPanen: formPanen.tanggalPanen,
              hasilKg: parseFloat(formPanen.hasilKg) || 0
            };
          }
          return s;
        });

        setSiklusList(updated);
        localStorage.setItem("pipo_siklus", JSON.stringify(updated));

        setToast({ text: `Panen ${item?.varietasName || ""} berhasil dicatat!`, type: "success" });
        setActiveModal(null);
        setFormPanen({
          siklusId: "",
          hasilKg: "",
          tanggalPanen: new Date().toISOString().split('T')[0]
        });
        setConfirmDialog(null);
      }
    });
  };

  const handleJualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { customer, varietasName, qty, pricePerKg } = formJual;
    if (!customer || !varietasName || !qty || !pricePerKg) {
      setToast({ text: "Harap isi seluruh formulir transaksi", type: "error" });
      return;
    }

    const qtyVal = parseFloat(qty);
    const priceVal = parseInt(pricePerKg.replace(/\D/g, ""));
    const totalVal = qtyVal * priceVal;

    setConfirmDialog({
      title: "Simpan Transaksi Penjualan",
      message: `Apakah Anda yakin ingin mencatat penjualan "${varietasName}" ke "${customer}" dengan total Rp ${totalVal.toLocaleString('id-ID')}?`,
      type: "save",
      onConfirm: () => {
        const newTx: Transaction = {
          id: `INV-${Date.now().toString().slice(-4)}`,
          type: "Penjualan",
          customer: customer,
          amount: `Rp ${totalVal.toLocaleString('id-ID')}`,
          date: new Date().toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          status: "Masuk",
          items: [{
            name: varietasName,
            qty: qtyVal,
            price: priceVal,
            total: totalVal
          }]
        };

        const updated = [newTx, ...transactions];
        setTransactions(updated);
        localStorage.setItem("pipo_transactions", JSON.stringify(updated));

        setToast({ text: `Transaksi penjualan ke ${customer} berhasil dicatat!`, type: "success" });
        setActiveModal(null);
        setFormJual({
          customer: "",
          varietasName: "",
          qty: "",
          pricePerKg: "",
          date: new Date().toISOString().split('T')[0]
        });
        setConfirmDialog(null);
      }
    });
  };

  return (
    <div className="space-y-6 md:space-y-8 relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-4.5 rounded-2xl shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span className="text-sm font-semibold">{toast.text}</span>
        </div>
      )}

      {/* Main Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col justify-between gap-1">
          <div>
            <p className="text-[10px] md:text-xs font-bold tracking-wider text-gray-400 mb-1.5 uppercase">Siklus Aktif</p>
            <h3 className="text-xl md:text-3xl font-bold text-gray-800">{activeSiklusCount} <span className="text-xs md:text-sm font-medium text-gray-500">Blok</span></h3>
          </div>
          <div className="flex items-center gap-1.5 mt-2.5 text-[10px] md:text-xs text-gray-500 font-medium">
            <Layers className="h-3.5 w-3.5 text-[#008060]" />
            <span>Sedang dalam pertumbuhan</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col justify-between gap-1">
          <div>
            <p className="text-[10px] md:text-xs font-bold tracking-wider text-gray-400 mb-1.5 uppercase">Lubang Tanam</p>
            <h3 className="text-xl md:text-3xl font-bold text-gray-800">{totalLubangTanam.toLocaleString('id-ID')} <span className="text-xs md:text-sm font-medium text-gray-500">Pcs</span></h3>
          </div>
          <div className="flex items-center gap-1.5 mt-2.5 text-[10px] md:text-xs text-gray-500 font-medium">
            <Sprout className="h-3.5 w-3.5 text-green-500" />
            <span>Kapasitas meja terpakai</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col justify-between gap-1">
          <div>
            <p className="text-[10px] md:text-xs font-bold tracking-wider text-gray-400 mb-1.5 uppercase">Hasil Panen</p>
            <h3 className="text-xl md:text-3xl font-bold text-gray-800">{totalHasilPanen.toLocaleString('id-ID')} <span className="text-xs md:text-sm font-medium text-gray-500">Kg</span></h3>
          </div>
          <div className="flex items-center gap-1.5 mt-2.5 text-[10px] md:text-xs text-gray-500 font-medium">
            <Scale className="h-3.5 w-3.5 text-blue-500" />
            <span>Total panen tercatat</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col justify-between gap-1">
          <div>
            <p className="text-[10px] md:text-xs font-bold tracking-wider text-gray-400 mb-1.5 uppercase">Pemasukan Kas</p>
            <h3 className="text-xl md:text-3xl font-bold text-[#008060]">Rp {totalPemasukan.toLocaleString('id-ID')}</h3>
          </div>
          <div className="flex items-center gap-1.5 mt-2.5 text-[10px] md:text-xs text-green-600 font-bold">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Omset Penjualan Sayur</span>
          </div>
        </div>
      </div>

      {/* Grid Layout for Cycles and Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Crops List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base md:text-lg font-bold text-gray-800">Status Pertumbuhan Sayur</h3>
                <p className="text-xs text-gray-400 mt-0.5">Memantau hari setelah semai (HSS) dan hari setelah tanam (HST).</p>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-[#008060] bg-[#008060]/10 px-2.5 py-1 rounded-full shrink-0">
                <Activity className="h-3.5 w-3.5 animate-pulse" />
                SISTEM NORMAL
              </span>
            </div>
            
            <div className="space-y-4">
              {activeSiklus.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-gray-100 rounded-2xl text-gray-400 space-y-2">
                  <Leaf className="h-10 w-10 mx-auto text-gray-300" />
                  <p className="text-sm font-semibold">Belum ada siklus tanam aktif</p>
                  <p className="text-xs text-gray-400">Silakan catat masa semai baru melalui tombol Aksi Cepat.</p>
                </div>
              ) : (
                activeSiklus.map((item) => {
                  const { status, umurText, progress, isReady } = calculatePlantStatus(item);
                  return (
                    <div key={item.id} className="p-4 rounded-2xl border border-gray-50 hover:bg-gray-50/50 transition-all space-y-3 shadow-xs">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                            isReady ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
                          }`}>
                            {isReady ? <CheckCircle className="h-5 w-5" /> : <Sprout className="h-5 w-5" />}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-800">{item.varietasName}</h4>
                            <p className="text-xs text-gray-400 mt-0.5">Lokasi: {item.meja} • {item.jumlah} lubang tanam</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                            status.includes("Siap") ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                          }`}>
                            {status}
                          </span>
                          <p className="text-xs font-bold text-gray-800 mt-1">{umurText}</p>
                        </div>
                      </div>

                      {/* Micro Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                          <span>Masa Tumbuh</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              isReady ? "bg-green-500" : "bg-[#008060]"
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Quick Actions & Recent Transactions */}
        <div className="space-y-6">
          
          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-800 mb-4 tracking-tight uppercase">Aksi Cepat Mandiri</h3>
            <div className="space-y-2.5">
              <button 
                onClick={() => {
                  setFormSemai({
                    varietasName: "",
                    meja: "",
                    jumlah: "",
                    tanggalSemai: new Date().toISOString().split('T')[0]
                  });
                  setActiveModal('semai');
                }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-100 hover:border-[#008060]/30 hover:bg-[#008060]/5 rounded-xl transition-all text-left text-xs md:text-sm font-semibold text-gray-600 hover:text-[#008060]"
              >
                <Plus className="h-4.5 w-4.5 text-[#008060]" />
                <span>Mulai Semai Baru</span>
              </button>
              
              <button 
                onClick={() => {
                  if (activeSiklus.length > 0) {
                    setFormPanen({
                      siklusId: activeSiklus[0].id,
                      hasilKg: "",
                      tanggalPanen: new Date().toISOString().split('T')[0]
                    });
                  }
                  setActiveModal('panen');
                }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-100 hover:border-[#008060]/30 hover:bg-[#008060]/5 rounded-xl transition-all text-left text-xs md:text-sm font-semibold text-gray-600 hover:text-[#008060]"
              >
                <Scale className="h-4.5 w-4.5 text-blue-600" />
                <span>Input Hasil Panen</span>
              </button>
              
              <button 
                onClick={() => {
                  const defaultCropName = availableCrops.length > 0 ? availableCrops[0].name : "";
                  setFormJual({
                    customer: "",
                    varietasName: defaultCropName,
                    qty: "",
                    pricePerKg: "",
                    date: new Date().toISOString().split('T')[0]
                  });
                  setActiveModal('transaksi');
                }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-100 hover:border-[#008060]/30 hover:bg-[#008060]/5 rounded-xl transition-all text-left text-xs md:text-sm font-semibold text-gray-600 hover:text-[#008060]"
              >
                <ShoppingBag className="h-4.5 w-4.5 text-[#008060]" />
                <span>Transaksi Penjualan Baru</span>
              </button>
            </div>
          </div>

          {/* Recent Sales Activity */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-800 mb-4 tracking-tight uppercase">Keuangan Terakhir</h3>
            <div className="space-y-3.5">
              {transactions.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">Belum ada transaksi</p>
              ) : (
                transactions.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-gray-800 line-clamp-1">{item.customer}</p>
                      <span className="text-[9px] font-semibold text-gray-400 tracking-wider uppercase">{item.type}</span>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-bold ${item.status === 'Keluar' ? 'text-red-500' : 'text-green-600'}`}>
                        {item.status === 'Keluar' ? '-' : '+'}{item.amount}
                      </p>
                      <span className="text-[9px] text-gray-400">{item.date.split(',')[0]}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Modals for Quick Actions */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">
                {activeModal === 'semai' && 'Mulai Masa Semai Baru'}
                {activeModal === 'panen' && 'Input Data Hasil Panen'}
                {activeModal === 'transaksi' && 'Transaksi Penjualan Baru'}
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-5">
              {activeModal === 'semai' && (
                <form className="space-y-4" onSubmit={handleSemaiSubmit}>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Varietas / Nama Sayur</label>
                    <input 
                      type="text" 
                      value={formSemai.varietasName}
                      onChange={(e) => setFormSemai({ ...formSemai, varietasName: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060] text-sm" 
                      placeholder="Misal: Selada Sementel, Pakcoy, dll" 
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Jumlah Lubang Tanam</label>
                      <input 
                        type="number" 
                        value={formSemai.jumlah}
                        onChange={(e) => setFormSemai({ ...formSemai, jumlah: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060] text-sm" 
                        placeholder="Contoh: 500" 
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Lokasi Meja / Blok</label>
                      <input 
                        type="text" 
                        value={formSemai.meja}
                        onChange={(e) => setFormSemai({ ...formSemai, meja: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060] text-sm" 
                        placeholder="Misal: Meja 1" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Tanggal Mulai Semai</label>
                    <input 
                      type="date" 
                      value={formSemai.tanggalSemai}
                      onChange={(e) => setFormSemai({ ...formSemai, tanggalSemai: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060] text-sm" 
                      required
                    />
                  </div>
                  <button type="submit" className="w-full bg-[#008060] text-white py-3 rounded-xl font-bold hover:bg-[#00664d] transition-colors mt-2 text-sm shadow-sm">
                    Simpan & Mulai Semai
                  </button>
                </form>
              )}
              
              {activeModal === 'panen' && (
                <form className="space-y-4" onSubmit={handlePanenSubmit}>
                  {activeSiklus.length === 0 ? (
                    <div className="text-center py-6 space-y-2">
                      <p className="text-sm text-gray-500">Tidak ada siklus aktif yang siap dipanen saat ini.</p>
                      <button type="button" onClick={() => setActiveModal('semai')} className="text-xs text-[#008060] font-bold hover:underline">Semai tanaman baru terlebih dahulu</button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Pilih Siklus Tanam Aktif</label>
                        <select 
                          value={formPanen.siklusId}
                          onChange={(e) => setFormPanen({ ...formPanen, siklusId: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060] text-sm bg-white"
                          required
                        >
                          {activeSiklus.map((s) => (
                            <option key={s.id} value={s.id}>{s.varietasName} ({s.meja} - {s.jumlah} lubang)</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Hasil Panen (Kg)</label>
                          <input 
                            type="number" 
                            step="0.1"
                            value={formPanen.hasilKg}
                            onChange={(e) => setFormPanen({ ...formPanen, hasilKg: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060] text-sm" 
                            placeholder="Contoh: 15.5" 
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Tanggal Panen</label>
                          <input 
                            type="date" 
                            value={formPanen.tanggalPanen}
                            onChange={(e) => setFormPanen({ ...formPanen, tanggalPanen: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060] text-sm" 
                            required
                          />
                        </div>
                      </div>
                      <button type="submit" className="w-full bg-[#008060] text-white py-3 rounded-xl font-bold hover:bg-[#00664d] transition-colors mt-2 text-sm shadow-sm">
                        Simpan Hasil Panen
                      </button>
                    </>
                  )}
                </form>
              )}
              
              {activeModal === 'transaksi' && (
                <form className="space-y-4" onSubmit={handleJualSubmit}>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Nama Pembeli / Pelanggan</label>
                    <input 
                      type="text" 
                      value={formJual.customer}
                      onChange={(e) => setFormJual({ ...formJual, customer: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060] text-sm" 
                      placeholder="Nama pelanggan / Restoran" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Pilih Jenis Sayur Hasil Panen</label>
                    {availableCrops.length === 0 ? (
                      <div className="space-y-2">
                        <input 
                          type="text" 
                          value={formJual.varietasName}
                          onChange={(e) => setFormJual({ ...formJual, varietasName: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060] text-sm" 
                          placeholder="Misal: Selada Sementel (Manual)" 
                          required
                        />
                        <p className="text-[10px] text-gray-400">Belum ada panen tercatat. Anda dapat mengetikkan jenis sayur secara manual.</p>
                      </div>
                    ) : (
                      <select 
                        value={formJual.varietasName}
                        onChange={(e) => setFormJual({ ...formJual, varietasName: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060] text-sm bg-white"
                        required
                      >
                        {availableCrops.map((crop, idx) => (
                          <option key={idx} value={crop.name}>{crop.name} (Stok: {crop.stock} kg)</option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Jumlah (Kg)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={formJual.qty}
                        onChange={(e) => setFormJual({ ...formJual, qty: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060] text-sm" 
                        placeholder="Contoh: 5" 
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Harga / Kg (Rp)</label>
                      <input 
                        type="number" 
                        value={formJual.pricePerKg}
                        onChange={(e) => setFormJual({ ...formJual, pricePerKg: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060] text-sm" 
                        placeholder="Contoh: 25000" 
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-[#008060] text-white py-3 rounded-xl font-bold hover:bg-[#00664d] transition-colors mt-2 text-sm shadow-sm">
                    Simpan Transaksi Penjualan
                  </button>
                </form>
              )}
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
                  {confirmDialog.type === "delete" ? "Ya, Hapus" : "Ya, Simpan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
