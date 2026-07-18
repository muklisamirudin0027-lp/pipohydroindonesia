import React, { useState, useEffect } from "react";
import { User, Lock, Bell, Store, Shield } from "lucide-react";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export function DashboardPengaturan() {
  const [activeTab, setActiveTab] = useState("profil");
  const [farmName, setFarmName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [address, setAddress] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFarmName(data.farmName || "");
            setManagerName(data.managerName || data.name || "");
            setAddress(data.address || "");
            setLogoUrl(data.logoUrl || "");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setLoading(false);
    };
    
    // Wait for auth to initialize if it hasn't
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;
    
    setSaving(true);
    setMessage({ text: "", type: "" });
    try {
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, {
        farmName,
        managerName,
        address,
        logoUrl
      }, { merge: true });
      setMessage({ text: "Profil berhasil disimpan!", type: "success" });
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ text: "Gagal menyimpan profil.", type: "error" });
    }
    setSaving(false);
    
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Memuat data...</div>;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ text: "Ukuran file maksimal 5MB.", type: "error" });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 256;
          const MAX_HEIGHT = 256;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress to jpeg to save space
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setLogoUrl(dataUrl);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-light text-[#424242]">Pengaturan Akun</h2>
        <p className="text-sm text-gray-500 mt-1">Kelola preferensi dan profil Anda.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          <button 
            onClick={() => setActiveTab("profil")}
            className={`px-6 py-4 text-sm font-semibold whitespace-nowrap ${activeTab === 'profil' ? 'text-[#008060] border-b-2 border-[#008060]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Profil Kebun
          </button>
          <button 
            onClick={() => setActiveTab("akun")}
            className={`px-6 py-4 text-sm font-semibold whitespace-nowrap ${activeTab === 'akun' ? 'text-[#008060] border-b-2 border-[#008060]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Akun & Keamanan
          </button>
          <button 
            onClick={() => setActiveTab("notifikasi")}
            className={`px-6 py-4 text-sm font-semibold whitespace-nowrap ${activeTab === 'notifikasi' ? 'text-[#008060] border-b-2 border-[#008060]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Notifikasi
          </button>
        </div>
        
        <div className="p-8 space-y-8">
          {activeTab === "profil" && (
            <>
              <div className="flex items-center gap-6 pb-8 border-b border-gray-50">
                <div className="h-24 w-24 rounded-full bg-[#008060]/10 flex items-center justify-center text-[#008060] text-3xl font-bold overflow-hidden">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="h-full w-full object-cover" />
                  ) : (
                    managerName ? managerName.charAt(0).toUpperCase() : "PM"
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#424242]">{managerName || "Owner"}</h3>
                  <p className="text-sm text-gray-500 mb-3">Pemilik Kebun</p>
                  <label className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
                    Ubah Foto
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
              </div>

              <form className="space-y-6" onSubmit={handleSaveProfile}>
                {message.text && (
                  <div className={`p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Kebun / Usaha</label>
                    <div className="relative">
                      <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input 
                        type="text" 
                        value={farmName}
                        onChange={(e) => setFarmName(e.target.value)}
                        placeholder="Kebun Hidroponik Saya" 
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#008060]" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Owner</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input 
                        type="text" 
                        value={managerName}
                        onChange={(e) => setManagerName(e.target.value)}
                        placeholder="Nama Anda" 
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#008060]" 
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Kebun Utama</label>
                  <textarea 
                    rows={3} 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Alamat Kebun Anda" 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#008060]"
                  ></textarea>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="bg-[#008060] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#004D40] transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            </>
          )}

          {activeTab === "akun" && (
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ubah Email</h3>
                <div className="grid grid-cols-1 gap-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Saat Ini</label>
                    <input type="email" disabled defaultValue="petani@example.com" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Baru</label>
                    <input type="email" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#008060]" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ubah Kata Sandi</h3>
                <div className="grid grid-cols-1 gap-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kata Sandi Saat Ini</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input type="password" className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#008060]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kata Sandi Baru</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input type="password" className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#008060]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" className="bg-[#008060] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#004D40] transition-colors">
                  Perbarui Keamanan
                </button>
              </div>
            </form>
          )}

          {activeTab === "notifikasi" && (
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Preferensi Notifikasi</h3>
              
              <div className="space-y-4">
                {[
                  { title: "Pengingat Jadwal Panen", desc: "Dapatkan pemberitahuan saat tanaman mendekati masa panen." },
                  { title: "Peringatan Nutrisi", desc: "Dapatkan saran saat jadwal pemberian nutrisi tiba." },
                  { title: "Laporan Penjualan Mingguan", desc: "Terima ringkasan penjualan melalui email setiap minggu." },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl">
                    <div className="mt-1">
                      <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-gray-300 text-[#008060] focus:ring-[#008060]" />
                    </div>
                    <div>
                      <label className="font-medium text-gray-900">{item.title}</label>
                      <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" className="bg-[#008060] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#004D40] transition-colors">
                  Simpan Preferensi
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
