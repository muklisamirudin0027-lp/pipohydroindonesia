import React, { useState, useEffect } from "react";
import { Leaf, Search, Plus, X, Sprout, CalendarDays, Trash2 } from "lucide-react";

interface Varietas {
  id: string;
  name: string;
}

interface SiklusTanam {
  id: string;
  varietasName: string;
  meja: string;
  jumlah: number;
  tanggalSemai: string;
  tanggalPindahTanam: string;
}

export function DashboardKebun() {
  const [activeTab, setActiveTab] = useState<"siklus" | "varietas">("siklus");
  const [activeModal, setActiveModal] = useState<"siklus" | "varietas" | "pindahTanam" | null>(null);
  const [selectedSiklusId, setSelectedSiklusId] = useState<string | null>(null);

  // States
  const [varietasList, setVarietasList] = useState<Varietas[]>([]);
  const [siklusList, setSiklusList] = useState<SiklusTanam[]>([]);

  // Form states for Varietas
  const [newVarietasName, setNewVarietasName] = useState("");

  // Form states for Siklus
  const [formSiklus, setFormSiklus] = useState({
    varietasName: "",
    meja: "",
    jumlah: "",
    tanggalSemai: new Date().toISOString().split('T')[0],
    tanggalPindahTanam: ""
  });

  // Form states for Pindah Tanam
  const [formPindahTanam, setFormPindahTanam] = useState({
    tanggalPindahTanam: new Date().toISOString().split('T')[0],
    meja: "",
    jumlah: ""
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedVarietas = localStorage.getItem("pipo_varietas");
    const savedSiklus = localStorage.getItem("pipo_siklus");

    if (savedVarietas) {
      setVarietasList(JSON.parse(savedVarietas));
    } else {
      // Default varietas
      const defaultVarietas = [
        { id: "1", name: "Selada Sementel" },
        { id: "2", name: "Selada Caipira" },
        { id: "3", name: "Selada RZ" }
      ];
      setVarietasList(defaultVarietas);
      localStorage.setItem("pipo_varietas", JSON.stringify(defaultVarietas));
    }

    if (savedSiklus) {
      setSiklusList(JSON.parse(savedSiklus));
    } else {
      // Default siklus to show some data
      const today = new Date();
      
      const semingguLalu = new Date(today);
      semingguLalu.setDate(today.getDate() - 7);
      
      const tigaMingguLalu = new Date(today);
      tigaMingguLalu.setDate(today.getDate() - 21);
      
      const defaultSiklus = [
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
      setSiklusList(defaultSiklus);
      localStorage.setItem("pipo_siklus", JSON.stringify(defaultSiklus));
    }
  }, []);

  const saveVarietas = (newList: Varietas[]) => {
    setVarietasList(newList);
    localStorage.setItem("pipo_varietas", JSON.stringify(newList));
  };

  const saveSiklus = (newList: SiklusTanam[]) => {
    setSiklusList(newList);
    localStorage.setItem("pipo_siklus", JSON.stringify(newList));
  };

  const handleAddVarietas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVarietasName.trim()) return;
    
    const newVar = { id: Date.now().toString(), name: newVarietasName };
    saveVarietas([...varietasList, newVar]);
    setNewVarietasName("");
    setActiveModal(null);
  };

  const handleDeleteVarietas = (id: string) => {
    saveVarietas(varietasList.filter(v => v.id !== id));
  };

  const handleAddSiklus = (e: React.FormEvent) => {
    e.preventDefault();
    const newSiklus = {
      id: Date.now().toString(),
      varietasName: formSiklus.varietasName || varietasList[0]?.name || "Tanaman Baru",
      meja: formSiklus.meja,
      jumlah: parseInt(formSiklus.jumlah) || 0,
      tanggalSemai: formSiklus.tanggalSemai,
      tanggalPindahTanam: formSiklus.tanggalPindahTanam
    };
    
    saveSiklus([newSiklus, ...siklusList]);
    setFormSiklus({
      varietasName: varietasList[0]?.name || "",
      meja: "",
      jumlah: "",
      tanggalSemai: new Date().toISOString().split('T')[0],
      tanggalPindahTanam: ""
    });
    setActiveModal(null);
  };

  const handleDeleteSiklus = (id: string) => {
    saveSiklus(siklusList.filter(s => s.id !== id));
  };

  const handlePindahTanamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSiklusId) return;

    const updatedList = siklusList.map(s => {
      if (s.id === selectedSiklusId) {
        return {
          ...s,
          tanggalPindahTanam: formPindahTanam.tanggalPindahTanam,
          meja: formPindahTanam.meja,
          jumlah: parseInt(formPindahTanam.jumlah) || s.jumlah
        };
      }
      return s;
    });

    saveSiklus(updatedList);
    setActiveModal(null);
    setSelectedSiklusId(null);
    setFormPindahTanam({
      tanggalPindahTanam: new Date().toISOString().split('T')[0],
      meja: "",
      jumlah: ""
    });
  };

  const calculatePlantStatus = (siklus: SiklusTanam) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let status = "Persemaian";
    let umurText = "0 Hari";
    
    // Jika sudah pindah tanam
    if (siklus.tanggalPindahTanam) {
      const pTanamDate = new Date(siklus.tanggalPindahTanam);
      pTanamDate.setHours(0,0,0,0);
      
      if (today >= pTanamDate) {
        const diffTime = Math.abs(today.getTime() - pTanamDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        umurText = `${diffDays} HST`; // Hari Setelah Tanam
        
        if (diffDays >= 30) {
          status = "Siap Panen";
        } else {
          status = "Pertumbuhan";
        }
        return { status, umurText };
      }
    }
    
    // Jika masih persemaian
    if (siklus.tanggalSemai) {
      const semaiDate = new Date(siklus.tanggalSemai);
      semaiDate.setHours(0,0,0,0);
      const diffTime = today.getTime() - semaiDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays >= 0) {
        umurText = `${diffDays} HSS`; // Hari Setelah Semai
      } else {
        umurText = "Belum Semai";
      }
    }
    
    return { status, umurText };
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-light text-[#424242]">Manajemen Kebun</h2>
          <p className="text-sm text-gray-500 mt-1">Kelola varietas dan pantau umur tanaman secara real-time.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setActiveModal("varietas")}
            className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            <Leaf className="h-4 w-4" />
            Tambah Varietas
          </button>
          <button 
            onClick={() => {
              if (varietasList.length > 0) {
                setFormSiklus({...formSiklus, varietasName: varietasList[0].name});
              }
              setActiveModal("siklus");
            }}
            className="flex items-center justify-center gap-2 bg-[#008060] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#004D40] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Catat Semaian Baru
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          <button 
            onClick={() => setActiveTab("siklus")}
            className={`px-6 py-4 text-sm font-semibold whitespace-nowrap ${activeTab === 'siklus' ? 'text-[#008060] border-b-2 border-[#008060]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Siklus Tanam Aktif
          </button>
          <button 
            onClick={() => setActiveTab("varietas")}
            className={`px-6 py-4 text-sm font-semibold whitespace-nowrap ${activeTab === 'varietas' ? 'text-[#008060] border-b-2 border-[#008060]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Daftar Varietas
          </button>
        </div>
        
        {activeTab === "siklus" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                <tr>
                  <th className="px-6 py-4">Varietas</th>
                  <th className="px-6 py-4">Lokasi / Meja</th>
                  <th className="px-6 py-4">Jumlah (Lubang)</th>
                  <th className="px-6 py-4">Umur Real-time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {siklusList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Belum ada siklus tanam aktif.
                    </td>
                  </tr>
                ) : (
                  siklusList.map((item) => {
                    const { status, umurText } = calculatePlantStatus(item);
                    return (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            status === 'Persemaian' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                          }`}>
                            {status === 'Persemaian' ? <Sprout className="h-4 w-4" /> : <Leaf className="h-4 w-4" />}
                          </div>
                          {item.varietasName}
                        </td>
                        <td className="px-6 py-4">{item.meja || "-"}</td>
                        <td className="px-6 py-4">{item.jumlah}</td>
                        <td className="px-6 py-4 font-semibold text-[#424242]">{umurText}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            status === 'Siap Panen' ? 'bg-green-100 text-green-700' :
                            status === 'Pertumbuhan' ? 'bg-blue-100 text-blue-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right flex justify-end gap-3 items-center h-full">
                          {status === 'Persemaian' && (
                            <button 
                              onClick={() => {
                                setSelectedSiklusId(item.id);
                                setFormPindahTanam({
                                  ...formPindahTanam,
                                  jumlah: item.jumlah.toString(),
                                  meja: item.meja || ""
                                });
                                setActiveModal("pindahTanam");
                              }} 
                              className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-medium transition-colors"
                            >
                              Pindah Tanam
                            </button>
                          )}
                          <button onClick={() => handleDeleteSiklus(item.id)} className="text-red-500 hover:text-red-700 font-medium text-sm">
                            <Trash2 className="h-4 w-4 inline" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex gap-4">
              <span>* HSS = Hari Setelah Semai</span>
              <span>* HST = Hari Setelah Tanam</span>
            </div>
          </div>
        )}

        {activeTab === "varietas" && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {varietasList.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500">
                  Belum ada varietas yang ditambahkan.
                </div>
              ) : (
                varietasList.map(v => (
                  <div key={v.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-[#008060] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center text-[#008060]">
                        <Leaf className="h-5 w-5" />
                      </div>
                      <span className="font-semibold text-gray-800">{v.name}</span>
                    </div>
                    <button onClick={() => handleDeleteVarietas(v.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {activeModal === "varietas" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Tambah Varietas Baru</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleAddVarietas} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Varietas</label>
                  <input 
                    type="text" 
                    value={newVarietasName}
                    onChange={(e) => setNewVarietasName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060]" 
                    placeholder="Misal: Selada Romaine" 
                    autoFocus
                  />
                </div>
                <button type="submit" className="w-full bg-[#008060] text-white py-3 rounded-xl font-medium hover:bg-[#00664d] transition-colors mt-2">
                  Simpan Varietas
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {activeModal === "siklus" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Catat Semaian Baru</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <form className="space-y-4" onSubmit={handleAddSiklus}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Varietas Tanaman</label>
                  {varietasList.length > 0 ? (
                    <select 
                      value={formSiklus.varietasName}
                      onChange={(e) => setFormSiklus({...formSiklus, varietasName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060]"
                    >
                      {varietasList.map(v => (
                        <option key={v.id} value={v.name}>{v.name}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm text-red-500 py-2">Silahkan tambah varietas terlebih dahulu.</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Semai</label>
                  <input 
                    type="date" 
                    value={formSiklus.tanggalSemai}
                    onChange={(e) => setFormSiklus({...formSiklus, tanggalSemai: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060]" 
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Umur HSS akan dihitung otomatis dari tanggal ini.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 mt-4">
                  <div className="col-span-2">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Opsional: Jika sudah dipindah tanam</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pindah Tanam</label>
                    <input 
                      type="date" 
                      value={formSiklus.tanggalPindahTanam}
                      onChange={(e) => setFormSiklus({...formSiklus, tanggalPindahTanam: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060]" 
                    />
                    <p className="text-xs text-gray-500 mt-1">Jika diisi, perhitungan umur berubah menjadi HST.</p>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi / Meja</label>
                    <input 
                      type="text" 
                      value={formSiklus.meja}
                      onChange={(e) => setFormSiklus({...formSiklus, meja: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060]" 
                      placeholder="Meja 1" 
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
                    <input 
                      type="number" 
                      value={formSiklus.jumlah}
                      onChange={(e) => setFormSiklus({...formSiklus, jumlah: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060]" 
                      placeholder="0" 
                    />
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#008060] text-white py-3 rounded-xl font-medium hover:bg-[#00664d] transition-colors mt-4">
                  Simpan Data
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {activeModal === "pindahTanam" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Pindah Tanam</h3>
              <button onClick={() => { setActiveModal(null); setSelectedSiklusId(null); }} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <form className="space-y-4" onSubmit={handlePindahTanamSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pindah Tanam</label>
                  <input 
                    type="date" 
                    value={formPindahTanam.tanggalPindahTanam}
                    onChange={(e) => setFormPindahTanam({...formPindahTanam, tanggalPindahTanam: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060]" 
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Umur HST akan dihitung otomatis dari tanggal ini.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi / Meja Baru</label>
                    <input 
                      type="text" 
                      value={formPindahTanam.meja}
                      onChange={(e) => setFormPindahTanam({...formPindahTanam, meja: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060]" 
                      placeholder="Meja 1" 
                      required
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Hidup</label>
                    <input 
                      type="number" 
                      value={formPindahTanam.jumlah}
                      onChange={(e) => setFormPindahTanam({...formPindahTanam, jumlah: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#008060]" 
                      placeholder="0" 
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#008060] text-white py-3 rounded-xl font-medium hover:bg-[#00664d] transition-colors mt-4">
                  Simpan Perubahan
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
