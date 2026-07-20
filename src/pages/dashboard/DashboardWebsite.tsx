import React, { useState, useEffect } from "react";
import { 
  Globe, 
  Save, 
  Image as ImageIcon, 
  FileText, 
  Layers, 
  Upload, 
  Check, 
  HelpCircle,
  Sparkles,
  RefreshCw,
  ShoppingBag,
  Store,
  BookOpen,
  Users,
  Plus,
  Trash,
  Edit,
  Mail,
  Key,
  Phone,
  MapPin,
  UserCheck
} from "lucide-react";
import { fetchWebsiteContent, saveWebsiteContent, WebsiteContent, DEFAULT_WEBSITE_CONTENT, Article, GalleryItem } from "../../lib/websiteService";
import { auth, db } from "../../lib/firebase";
import { collection, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";

export function DashboardWebsite() {
  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [activeTab, setActiveTab] = useState<"hero" | "about" | "products" | "articles" | "gallery" | "users">("users");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [uploadType, setUploadType] = useState<{ [key: string]: "url" | "file" }>({
    heroBg: "file",
    aboutImg: "file",
    prod1Img: "file",
    prod2Img: "file",
    prod3Img: "file",
    articleImg: "file",
    galleryImg: "file"
  });

  // State managers for Articles, Gallery, and Users
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isNewArticle, setIsNewArticle] = useState(false);
  
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [isNewGalleryItem, setIsNewGalleryItem] = useState(false);

  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<any | null>(null);

  // Preselected beautiful agriculture images
  const unsplashGallery = {
    hero: [
      "https://images.unsplash.com/photo-1557844352-761f2565b576?auto=format&fit=crop&w=1000&q=80", // Vertical hydroponic
      "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=1000&q=80", // Fresh greenhouse
      "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1000&q=80", // Green leaf
    ],
    about: [
      "https://images.unsplash.com/photo-1595806653240-5e36502283eb?auto=format&fit=crop&w=1000&q=80", // Inspecting plants
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80", // Farm greenhouse
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80", // Modern tech agriculture
    ],
    products: [
      "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=800&q=80", // Fresh lettuce close up
      "https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?auto=format&fit=crop&w=800&q=80", // Head of lettuce
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80", // Harvest bowl
    ]
  };

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchWebsiteContent();
        setContent(data);
      } catch (err: any) {
        console.warn("Error fetching website content:", err);
        setContent({ ...DEFAULT_WEBSITE_CONTENT });
        if (err.message && err.message.includes("permission")) {
          setMessage({ 
            text: "Gagal memuat dari Database. Pastikan Anda telah mengatur Firestore Security Rules di Firebase Console agar mengizinkan akses 'read' dan 'write' ke collection 'website_content'. (Menampilkan bawaan asli)", 
            type: "error" 
          });
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Load registered users from Firestore
  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const snap = await getDocs(collection(db, "users"));
      const list: any[] = [];
      snap.forEach((doc) => {
        list.push({ uid: doc.id, ...doc.data() });
      });
      setUsers(list);
    } catch (err: any) {
      const isOffline = err instanceof Error && (
        err.message.toLowerCase().includes("offline") || 
        err.message.toLowerCase().includes("could not reach") || 
        err.message.toLowerCase().includes("network") || 
        err.message.toLowerCase().includes("unavailable")
      );
      if (isOffline) {
        console.warn("Gagal memuat pengguna karena Anda sedang offline:", err.message || err);
      } else {
        console.error("Gagal memuat pengguna:", err);
      }
    } finally {
      setUsersLoading(false);
    }
  };

  const handleSaveUser = async (userToSave: any) => {
    try {
      await setDoc(doc(db, "users", userToSave.uid), userToSave, { merge: true });
      setMessage({ text: "Data akun pengguna berhasil diperbarui!", type: "success" });
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      const isOffline = err instanceof Error && (
        err.message.toLowerCase().includes("offline") || 
        err.message.toLowerCase().includes("could not reach") || 
        err.message.toLowerCase().includes("network") || 
        err.message.toLowerCase().includes("unavailable")
      );
      if (isOffline) {
        console.warn("Gagal menyimpan data pengguna karena Anda sedang offline:", err.message || err);
        setMessage({ text: "Gagal menyimpan perubahan karena Anda sedang offline.", type: "error" });
      } else {
        console.error("Gagal menyimpan data pengguna:", err);
        setMessage({ text: "Gagal menyimpan perubahan akun.", type: "error" });
      }
    }
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleDeleteUser = async (uid: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data akun pengguna ini dari Firestore? Tindakan ini tidak dapat dibatalkan.")) {
      try {
        await deleteDoc(doc(db, "users", uid));
        setMessage({ text: "Data akun berhasil dihapus dari database.", type: "success" });
        fetchUsers();
      } catch (err: any) {
        const isOffline = err instanceof Error && (
          err.message.toLowerCase().includes("offline") || 
          err.message.toLowerCase().includes("could not reach") || 
          err.message.toLowerCase().includes("network") || 
          err.message.toLowerCase().includes("unavailable")
        );
        if (isOffline) {
          console.warn("Gagal menghapus pengguna karena Anda sedang offline:", err.message || err);
          setMessage({ text: "Gagal menghapus akun karena Anda sedang offline.", type: "error" });
        } else {
          console.error("Gagal menghapus pengguna:", err);
          setMessage({ text: "Gagal menghapus data akun.", type: "error" });
        }
      }
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  const handleResetPassword = async (email: string) => {
    if (!email) {
      alert("Akun ini tidak memiliki email yang terdaftar.");
      return;
    }
    if (window.confirm(`Kirim email pemulihan/reset sandi ke ${email}? Pengguna akan menerima tautan resmi dari Firebase untuk mengatur ulang kata sandi mereka secara aman.`)) {
      try {
        await sendPasswordResetEmail(auth, email);
        alert(`Link pemulihan kata sandi berhasil dikirim ke ${email}! Silakan beritahukan pengguna untuk memeriksa kotak masuk (atau folder spam) email mereka.`);
      } catch (err: any) {
        console.error("Gagal mengirim email reset:", err);
        alert(`Gagal mengirim email pemulihan: ${err.message || err}`);
      }
    }
  };

  // Article helper functions
  const handleSaveArticle = (article: Article) => {
    if (!content) return;
    const currentArticles = content.articles || [];
    let updated;
    if (isNewArticle) {
      updated = [...currentArticles, article];
    } else {
      updated = currentArticles.map((art) => art.id === article.id ? article : art);
    }
    setContent({ ...content, articles: updated });
    setEditingArticle(null);
    setMessage({ text: "Perubahan artikel ditambahkan ke daftar draft. Klik 'SIMPAN PERUBAHAN' untuk memublikasikan.", type: "success" });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const handleDeleteArticle = (id: string) => {
    if (!content) return;
    if (window.confirm("Apakah Anda yakin ingin menghapus artikel ini? Klik 'SIMPAN PERUBAHAN' setelahnya untuk menyimpan perubahan.")) {
      const currentArticles = content.articles || [];
      const updated = currentArticles.filter((art) => art.id !== id);
      setContent({ ...content, articles: updated });
      setMessage({ text: "Artikel dihapus dari draft. Klik 'SIMPAN PERUBAHAN' untuk memublikasikan.", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    }
  };

  // Gallery helper functions
  const handleSaveGalleryItem = (item: GalleryItem) => {
    if (!content) return;
    const currentGallery = content.gallery || [];
    let updated;
    if (isNewGalleryItem) {
      updated = [...currentGallery, item];
    } else {
      updated = currentGallery.map((gal) => gal.id === item.id ? item : gal);
    }
    setContent({ ...content, gallery: updated });
    setEditingGalleryItem(null);
    setMessage({ text: "Perubahan galeri ditambahkan ke daftar draft. Klik 'SIMPAN PERUBAHAN' untuk memublikasikan.", type: "success" });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const handleDeleteGalleryItem = (id: string) => {
    if (!content) return;
    if (window.confirm("Apakah Anda yakin ingin menghapus foto galeri ini? Klik 'SIMPAN PERUBAHAN' setelahnya untuk menyimpan perubahan.")) {
      const currentGallery = content.gallery || [];
      const updated = currentGallery.filter((gal) => gal.id !== id);
      setContent({ ...content, gallery: updated });
      setMessage({ text: "Foto dihapus dari draft. Klik 'SIMPAN PERUBAHAN' untuk memublikasikan.", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    }
  };

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    setMessage({ text: "", type: "" });
    try {
      await saveWebsiteContent(content);
      setMessage({ text: "Konten website berhasil disimpan dan dipublikasikan!", type: "success" });
    } catch (err: any) {
      if (err.message && err.message.includes("permission")) {
        setMessage({ text: "Gagal menyimpan: Izin akses ditolak. Perbarui Firestore Security Rules Anda untuk 'website_content'.", type: "error" });
      } else {
        setMessage({ text: "Gagal menyimpan konten website.", type: "error" });
      }
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm("Apakah Anda yakin ingin mengembalikan semua konten ke setelan bawaan asli?")) {
      setContent({ ...DEFAULT_WEBSITE_CONTENT });
      setMessage({ text: "Konten dikembalikan ke default. Klik 'Simpan Perubahan' untuk memublikasikan.", type: "success" });
    }
  };

  const handleImageUpload = (key: string, file: File, callback: (url: string) => void) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar melebihi batas maksimal 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        // Limit max dimensions for Firestore Base64 to ~800px to avoid doc size limits
        const maxDim = key.startsWith("prod") ? 400 : 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height *= maxDim / width;
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width *= maxDim / height;
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compress JPEG
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        callback(compressedBase64);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Memuat editor konten website...</div>;
  }

  if (!content) return null;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#008060] mb-1 font-semibold text-xs tracking-widest uppercase">
            <Globe className="h-4 w-4" /> KELOLA LANDING PAGE WEBSITE
          </div>
          <h2 className="text-2xl font-light text-[#424242]">Manajemen Website & Galeri</h2>
          <p className="text-sm text-gray-500 mt-1">Ubah kata-kata, deskripsi, dan upload gambar yang langsung tampil di website luar.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleResetDefaults}
            className="px-4 py-2.5 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-xs tracking-widest rounded-xl transition-all uppercase flex items-center gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Bawaan Asli
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-[#008060] hover:bg-[#004D40] text-white font-semibold text-xs tracking-widest rounded-xl transition-all uppercase flex items-center gap-2 shadow-md disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {saving ? "MENYIMPAN..." : "SIMPAN PERUBAHAN"}
          </button>
        </div>
      </div>

      {/* Message Toast */}
      {message.text && (
        <div className={`p-4 rounded-xl text-xs font-semibold ${
          message.type === "success" 
            ? "bg-green-50 border border-green-100 text-green-700" 
            : "bg-red-50 border border-red-100 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

      {/* Main CMS Layout */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 overflow-x-auto">
          {[
            { id: "users", label: "Kelola Akun (Daftar Pengguna)", icon: Users },
            { id: "hero", label: "Hero Banner Website", icon: Sparkles },
            { id: "about", label: "Cerita Kami (About Us)", icon: FileText },
            { id: "products", label: "Produk Selada Pilihan", icon: Layers },
            { id: "articles", label: "Artikel & Berita", icon: BookOpen },
            { id: "gallery", label: "Galeri Foto", icon: ImageIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 text-xs md:text-sm font-bold whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab.id 
                  ? "border-[#008060] text-[#008060] bg-white font-extrabold" 
                  : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50/20"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Fields */}
        <div className="p-6 md:p-8 space-y-8">
          
          {/* TAB 1: HERO BANNER */}
          {activeTab === "hero" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Text Fields */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-black tracking-wider text-gray-500 uppercase mb-2">Label Kecil (Badge)</label>
                    <input 
                      type="text"
                      value={content.hero.badge}
                      onChange={(e) => setContent({
                        ...content,
                        hero: { ...content.hero, badge: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008060]"
                      placeholder="e.g. 100% BEBAS PESTISIDA"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black tracking-wider text-gray-500 uppercase mb-2">Judul Baris 1</label>
                    <input 
                      type="text"
                      value={content.hero.titleLine1}
                      onChange={(e) => setContent({
                        ...content,
                        hero: { ...content.hero, titleLine1: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008060]"
                      placeholder="e.g. Sayuran Segar,"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black tracking-wider text-gray-500 uppercase mb-2">Judul Sorotan (Highlight Baris 2)</label>
                    <input 
                      type="text"
                      value={content.hero.titleLine2Highlight}
                      onChange={(e) => setContent({
                        ...content,
                        hero: { ...content.hero, titleLine2Highlight: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008060] text-[#008060] font-semibold"
                      placeholder="e.g. Berkualitas Premium."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black tracking-wider text-gray-500 uppercase mb-2">Deskripsi Utama</label>
                    <textarea 
                      rows={4}
                      value={content.hero.description}
                      onChange={(e) => setContent({
                        ...content,
                        hero: { ...content.hero, description: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008060] leading-relaxed"
                      placeholder="Tulis penjelasan singkat tentang kebun Anda..."
                    />
                  </div>
                </div>

                {/* Banner Image Customization */}
                <div className="space-y-5 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <h4 className="text-xs font-black tracking-wider text-gray-500 uppercase flex items-center gap-1">
                    <ImageIcon className="h-4 w-4 text-[#008060]" /> GAMBAR LATAR BELAKANG HERO
                  </h4>

                  {/* Image Preview */}
                  <div className="aspect-video w-full rounded-xl overflow-hidden border border-gray-200 relative bg-gray-200 group shadow-inner">
                    {content.hero.backgroundImage ? (
                      <img 
                        src={content.hero.backgroundImage} 
                        alt="Hero Bg Preview" 
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">Belum ada gambar</div>
                    )}
                  </div>

                  {/* Upload Source Picker */}
                  <div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-100">
                    <button
                      type="button"
                      onClick={() => setUploadType({ ...uploadType, heroBg: "file" })}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-md uppercase transition-all ${
                        uploadType.heroBg === "file" ? "bg-emerald-50 text-[#008060]" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadType({ ...uploadType, heroBg: "url" })}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-md uppercase transition-all ${
                        uploadType.heroBg === "url" ? "bg-emerald-50 text-[#008060]" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      Gunakan Link URL
                    </button>
                  </div>

                  {uploadType.heroBg === "file" ? (
                    <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 hover:border-[#008060] bg-white p-6 rounded-xl cursor-pointer text-xs font-bold tracking-widest text-[#008060] hover:bg-emerald-50/20 transition-all uppercase">
                      <Upload className="h-4 w-4" /> Upload Gambar (Maks 5MB)
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload("heroBg", file, (url) => {
                            setContent({ ...content, hero: { ...content.hero, backgroundImage: url } });
                          });
                        }}
                      />
                    </label>
                  ) : (
                    <input 
                      type="text"
                      value={content.hero.backgroundImage}
                      onChange={(e) => setContent({
                        ...content,
                        hero: { ...content.hero, backgroundImage: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:border-[#008060]"
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                  )}

                  {/* Quick Select Agricultural Gallery */}
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">PILIH CEPAT DARI GALERI ALAMI:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {unsplashGallery.hero.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setContent({ ...content, hero: { ...content.hero, backgroundImage: img } })}
                          className={`aspect-video rounded-lg overflow-hidden border relative hover:opacity-90 active:scale-95 transition-all ${
                            content.hero.backgroundImage === img ? "border-[#008060] ring-2 ring-[#008060]/20" : "border-gray-200"
                          }`}
                        >
                          <img src={img} className="h-full w-full object-cover" />
                          {content.hero.backgroundImage === img && (
                            <div className="absolute inset-0 bg-[#008060]/40 flex items-center justify-center text-white">
                              <Check className="h-4 w-4 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ABOUT US */}
          {activeTab === "about" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Text Fields */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-black tracking-wider text-gray-500 uppercase mb-2">Judul Cerita Baris 1</label>
                    <input 
                      type="text"
                      value={content.about.titleLine1}
                      onChange={(e) => setContent({
                        ...content,
                        about: { ...content.about, titleLine1: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008060]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black tracking-wider text-gray-500 uppercase mb-2">Judul Cerita Baris 2 (Highlight)</label>
                    <input 
                      type="text"
                      value={content.about.titleLine2Highlight}
                      onChange={(e) => setContent({
                        ...content,
                        about: { ...content.about, titleLine2Highlight: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008060] text-[#008060] font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black tracking-wider text-gray-500 uppercase mb-2">Paragraf Kisah 1</label>
                    <textarea 
                      rows={3}
                      value={content.about.paragraph1}
                      onChange={(e) => setContent({
                        ...content,
                        about: { ...content.about, paragraph1: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008060] leading-relaxed text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black tracking-wider text-gray-500 uppercase mb-2">Paragraf Kisah 2</label>
                    <textarea 
                      rows={3}
                      value={content.about.paragraph2}
                      onChange={(e) => setContent({
                        ...content,
                        about: { ...content.about, paragraph2: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008060] leading-relaxed text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black tracking-wider text-gray-500 uppercase mb-2">Paragraf Kisah 3</label>
                    <textarea 
                      rows={3}
                      value={content.about.paragraph3}
                      onChange={(e) => setContent({
                        ...content,
                        about: { ...content.about, paragraph3: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#008060] leading-relaxed text-gray-600"
                    />
                  </div>
                </div>

                {/* About Us Image Customization */}
                <div className="space-y-5 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <h4 className="text-xs font-black tracking-wider text-gray-500 uppercase flex items-center gap-1">
                    <ImageIcon className="h-4 w-4 text-[#008060]" /> GAMBAR CERITA
                  </h4>

                  {/* Image Preview */}
                  <div className="aspect-square w-full max-w-[320px] mx-auto rounded-xl overflow-hidden border border-gray-200 relative bg-gray-200 group shadow-inner">
                    {content.about.image ? (
                      <img 
                        src={content.about.image} 
                        alt="About Image Preview" 
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">Belum ada gambar</div>
                    )}
                  </div>

                  {/* Upload Source Picker */}
                  <div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-100">
                    <button
                      type="button"
                      onClick={() => setUploadType({ ...uploadType, aboutImg: "file" })}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-md uppercase transition-all ${
                        uploadType.aboutImg === "file" ? "bg-emerald-50 text-[#008060]" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadType({ ...uploadType, aboutImg: "url" })}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-md uppercase transition-all ${
                        uploadType.aboutImg === "url" ? "bg-emerald-50 text-[#008060]" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      Gunakan Link URL
                    </button>
                  </div>

                  {uploadType.aboutImg === "file" ? (
                    <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 hover:border-[#008060] bg-white p-6 rounded-xl cursor-pointer text-xs font-bold tracking-widest text-[#008060] hover:bg-emerald-50/20 transition-all uppercase">
                      <Upload className="h-4 w-4" /> Upload Gambar (Maks 5MB)
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload("aboutImg", file, (url) => {
                            setContent({ ...content, about: { ...content.about, image: url } });
                          });
                        }}
                      />
                    </label>
                  ) : (
                    <input 
                      type="text"
                      value={content.about.image}
                      onChange={(e) => setContent({
                        ...content,
                        about: { ...content.about, image: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:border-[#008060]"
                    />
                  )}

                  {/* Quick Select Agriculture Gallery */}
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">PILIH CEPAT DARI GALERI CERITA KITA:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {unsplashGallery.about.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setContent({ ...content, about: { ...content.about, image: img } })}
                          className={`aspect-square rounded-lg overflow-hidden border relative hover:opacity-90 active:scale-95 transition-all ${
                            content.about.image === img ? "border-[#008060] ring-2 ring-[#008060]/20" : "border-gray-200"
                          }`}
                        >
                          <img src={img} className="h-full w-full object-cover" />
                          {content.about.image === img && (
                            <div className="absolute inset-0 bg-[#008060]/40 flex items-center justify-center text-white">
                              <Check className="h-4 w-4 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FEATURED PRODUCTS */}
          {activeTab === "products" && (
            <div className="space-y-8">
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-xs text-[#004D40] leading-relaxed">
                <strong>Catatan Editor Produk:</strong> Anda dapat mengelola detail untuk 3 jenis sayuran selada yang ditampilkan di bagian "Produk Kami" pada halaman depan.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {content.products.map((product, idx) => {
                  const keyImg = `prod${idx+1}Img`;
                  return (
                    <div key={product.id} className="border border-gray-100 bg-gray-50/50 rounded-2xl p-4 md:p-5 space-y-4">
                      <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-2">
                        <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                          {idx + 1}
                        </div>
                        <h4 className="text-xs font-bold tracking-wider text-gray-700 uppercase">PRODUK SELADA {idx + 1}</h4>
                      </div>

                      {/* Product Image Preview & Custom uploader */}
                      <div className="aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 relative bg-gray-200 group shadow-inner">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={`Product ${idx+1}`} 
                            className="h-full w-full object-cover" 
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">Belum ada gambar</div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <label className="flex-1 text-center py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-[11px] font-bold tracking-widest rounded-lg cursor-pointer uppercase">
                          Upload File
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(`prod${idx+1}Img`, file, (url) => {
                                const newProds = [...content.products];
                                newProds[idx] = { ...newProds[idx], image: url };
                                setContent({ ...content, products: newProds });
                              });
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const newProds = [...content.products];
                            newProds[idx] = { ...newProds[idx], image: unsplashGallery.products[idx] };
                            setContent({ ...content, products: newProds });
                          }}
                          className="px-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-xs"
                          title="Gunakan default"
                        >
                          Reset
                        </button>
                      </div>

                      {/* Product Title Input */}
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nama Selada</label>
                        <input 
                          type="text"
                          value={product.title}
                          onChange={(e) => {
                            const newProds = [...content.products];
                            newProds[idx] = { ...newProds[idx], title: e.target.value };
                            setContent({ ...content, products: newProds });
                          }}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#008060]"
                        />
                      </div>

                      {/* Product Description Input */}
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Deskripsi Ringkas</label>
                        <textarea 
                          rows={3}
                          value={product.description}
                          onChange={(e) => {
                            const newProds = [...content.products];
                            newProds[idx] = { ...newProds[idx], description: e.target.value };
                            setContent({ ...content, products: newProds });
                          }}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#008060] leading-normal"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: ARTICLES MANAGEMENT */}
          {activeTab === "articles" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-bold text-gray-700">Daftar Artikel Edukasi & Pengumuman</h3>
                  <p className="text-xs text-gray-400 mt-1">Kelola artikel atau berita hidroponik yang akan dimunculkan di landing page website.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingArticle({
                      id: "art-" + Date.now(),
                      title: "",
                      category: "Edukasi",
                      excerpt: "",
                      content: "",
                      image: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80",
                      createdAt: new Date().toISOString().split("T")[0],
                      author: "Admin Pipo Hydro"
                    });
                    setIsNewArticle(true);
                  }}
                  className="px-4 py-2 bg-[#008060] hover:bg-[#004D40] text-white text-xs font-bold uppercase rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus className="h-4 w-4" /> Tambah Artikel Baru
                </button>
              </div>

              {/* Articles List Table/Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(content.articles || []).map((art) => (
                  <div key={art.id} className="border border-gray-200 bg-white p-4 rounded-xl flex gap-4 shadow-sm hover:border-emerald-300 transition-all">
                    <img src={art.image} alt={art.title} className="h-20 w-28 object-cover rounded-lg bg-gray-50 shrink-0" referrerPolicy="no-referrer" />
                    <div className="flex-grow flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[10px] font-black tracking-wider text-[#008060] uppercase bg-emerald-50 px-2 py-0.5 rounded-md">{art.category}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{art.createdAt}</span>
                        </div>
                        <h4 className="font-bold text-sm text-gray-900 mt-1 truncate">{art.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-2 mt-1">{art.excerpt}</p>
                      </div>
                      <div className="flex justify-end gap-2 pt-2 border-t border-gray-50 mt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingArticle(art);
                            setIsNewArticle(false);
                          }}
                          className="p-1.5 text-gray-600 hover:text-[#008060] hover:bg-emerald-50 rounded-lg transition-all"
                          title="Edit Artikel"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteArticle(art.id)}
                          className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Hapus Artikel"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {(content.articles || []).length === 0 && (
                  <p className="text-xs text-gray-400 py-6 text-center col-span-2">Belum ada artikel. Klik "Tambah Artikel Baru" untuk membuatnya.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: GALLERY MANAGEMENT */}
          {activeTab === "gallery" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-bold text-gray-700">Daftar Dokumentasi Foto Galeri</h3>
                  <p className="text-xs text-gray-400 mt-1">Kelola galeri foto kebun yang akan dimunculkan di landing page website.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingGalleryItem({
                      id: "gal-" + Date.now(),
                      imageUrl: "https://images.unsplash.com/photo-1557844352-761f2565b576?auto=format&fit=crop&w=800&q=80",
                      caption: "",
                      createdAt: new Date().toISOString().split("T")[0]
                    });
                    setIsNewGalleryItem(true);
                  }}
                  className="px-4 py-2 bg-[#008060] hover:bg-[#004D40] text-white text-xs font-bold uppercase rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus className="h-4 w-4" /> Tambah Foto Baru
                </button>
              </div>

              {/* Gallery List Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(content.gallery || []).map((item) => (
                  <div key={item.id} className="border border-gray-200 bg-white p-3 rounded-xl flex flex-col justify-between shadow-sm hover:border-emerald-300 transition-all">
                    <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-50 relative group">
                      <img src={item.imageUrl} alt={item.caption} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <p className="text-xs font-semibold text-gray-800 mt-2 line-clamp-2 min-h-[2rem]">{item.caption || "(Tanpa Keterangan)"}</p>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-2">
                      <span className="text-[9px] text-gray-400 font-mono">{item.createdAt}</span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingGalleryItem(item);
                            setIsNewGalleryItem(false);
                          }}
                          className="p-1 text-gray-600 hover:text-[#008060] hover:bg-emerald-50 rounded-md transition-all"
                          title="Edit Foto"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteGalleryItem(item.id)}
                          className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                          title="Hapus Foto"
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {(content.gallery || []).length === 0 && (
                  <p className="text-xs text-gray-400 py-6 text-center col-span-4">Belum ada foto dokumentasi. Klik "Tambah Foto Baru" untuk mengupload.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: REGISTERED ACCOUNTS MANAGEMENT */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-bold text-gray-700">Manajemen Akun Pengguna / Petani</h3>
                  <p className="text-xs text-gray-400 mt-1">Gunakan panel ini untuk mengawasi akun yang telah mendaftar, membantu reset kata sandi, serta mengubah hak akses / peran.</p>
                </div>
                
                {/* Search Bar for Users */}
                <input
                  type="text"
                  placeholder="Cari nama, email, peran..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full md:w-64 px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#008060]"
                />
              </div>

              {/* Warning/Tips */}
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-xs text-amber-800 flex gap-2">
                <HelpCircle className="h-4 w-4 text-amber-700 shrink-0" />
                <div className="leading-relaxed">
                  <strong>Pemberitahuan Sistem Keamanan:</strong> Demi alasan privasi dan kepatuhan sistem keamanan, sandi asli tidak dapat dibaca oleh siapa pun (termasuk admin). Jika seorang petani lupa kata sandinya, klik tombol <strong>"Reset Sandi"</strong> untuk mengirim email pemulihan resmi dari Firebase ke kotak masuk pengguna tersebut.
                </div>
              </div>

              {/* Users Grid */}
              {usersLoading ? (
                <div className="text-center py-8 text-xs text-gray-500">Memuat data akun pengguna dari Firestore...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {users
                    .filter(u => {
                      const text = `${u.email || ""} ${u.managerName || ""} ${u.farmName || ""} ${u.role || ""}`.toLowerCase();
                      return text.includes(userSearchQuery.toLowerCase());
                    })
                    .map((u) => (
                      <div key={u.uid} className="border border-gray-200 bg-white p-4 rounded-xl shadow-sm hover:border-[#008060] transition-all flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2 border-b border-gray-50 pb-2 mb-2">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-full bg-emerald-100 text-[#008060] flex items-center justify-center font-bold text-xs shrink-0">
                                {u.managerName ? u.managerName.charAt(0).toUpperCase() : (u.email ? u.email.charAt(0).toUpperCase() : "U")}
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-bold text-sm text-gray-900 truncate">{u.managerName || "Pengguna Tanpa Nama"}</h4>
                                <p className="text-[10px] text-gray-400 font-mono truncate max-w-[150px]">{u.uid}</p>
                              </div>
                            </div>
                            <span className={`text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-md ${
                              u.role === "admin" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-[#008060]"
                            }`}>
                              {u.role || "petani"}
                            </span>
                          </div>

                          <div className="space-y-1.5 text-xs text-gray-600">
                            <div className="flex items-center gap-1.5">
                              <Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                              <span className="truncate">Email: <strong>{u.email || "Belum diatur"}</strong></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Store className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                              <span className="truncate">Kebun: <strong>{u.farmName || "Belum diatur"}</strong></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                              <span>Kontak: <strong>{u.contactNumber || "Belum diatur"}</strong></span>
                            </div>
                            {u.address && (
                              <div className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                <span className="truncate">Alamat: {u.address}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-3 border-t border-gray-50 mt-3">
                          <button
                            type="button"
                            onClick={() => setEditingUser(u)}
                            className="flex-1 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-[10px] font-bold tracking-wider uppercase rounded-lg flex items-center justify-center gap-1 transition-all"
                          >
                            <Edit className="h-3 w-3" /> Edit Akun
                          </button>
                          <button
                            type="button"
                            onClick={() => handleResetPassword(u.email)}
                            className="flex-1 py-2 bg-emerald-50 hover:bg-[#008060] hover:text-white text-[#008060] text-[10px] font-bold tracking-wider uppercase rounded-lg flex items-center justify-center gap-1 transition-all"
                            title="Kirim link reset password"
                          >
                            <Key className="h-3 w-3" /> Reset Sandi
                          </button>
                          {auth.currentUser?.uid !== u.uid && (
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u.uid)}
                              className="p-2 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 rounded-lg transition-all"
                              title="Hapus Pengguna"
                            >
                              <Trash className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  {users.length === 0 && (
                    <p className="text-xs text-gray-400 py-6 text-center col-span-2">Tidak ditemukan pengguna terdaftar.</p>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* MODAL: EDIT/ADD ARTICLE */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-text">
          <div className="bg-white rounded-3xl overflow-hidden w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl relative">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="text-sm font-black tracking-wider uppercase text-[#008060]">
                {isNewArticle ? "Tambah Artikel Baru" : "Edit Artikel"}
              </h3>
              <button onClick={() => setEditingArticle(null)} className="text-gray-400 hover:text-gray-600 text-xs font-black">X</button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Judul Artikel</label>
                <input
                  type="text"
                  value={editingArticle.title}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#008060]"
                  placeholder="e.g. Tips Menyiram Bibit Selada Hidroponik"
                />
              </div>

              {/* Category & Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Kategori</label>
                  <select
                    value={editingArticle.category}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:border-[#008060]"
                  >
                    <option value="Edukasi">Edukasi</option>
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Budidaya">Budidaya</option>
                    <option value="Pengumuman">Pengumuman</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Tanggal Rilis</label>
                  <input
                    type="date"
                    value={editingArticle.createdAt}
                    onChange={(e) => setEditingArticle({ ...editingArticle, createdAt: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Author & Image URL/Upload */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Penulis</label>
                  <input
                    type="text"
                    value={editingArticle.author}
                    onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none"
                    placeholder="e.g. Admin Pipo Hydro"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Gambar Cover (Upload / URL)</label>
                  <div className="flex gap-2 mb-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
                    <button
                      type="button"
                      onClick={() => setUploadType({ ...uploadType, articleImg: "file" })}
                      className={`flex-1 py-1 text-[10px] font-bold rounded uppercase transition-all ${
                        uploadType.articleImg === "file" ? "bg-emerald-100 text-[#008060]" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      File
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadType({ ...uploadType, articleImg: "url" })}
                      className={`flex-1 py-1 text-[10px] font-bold rounded uppercase transition-all ${
                        uploadType.articleImg === "url" ? "bg-emerald-100 text-[#008060]" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      URL
                    </button>
                  </div>

                  {uploadType.articleImg === "file" ? (
                    <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-[#008060] bg-white p-4 rounded-lg cursor-pointer text-xs font-semibold text-[#008060] transition-all">
                      <Upload className="h-4 w-4" /> Pilih & Kompres Gambar
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload("article", file, (url) => {
                            setEditingArticle({ ...editingArticle, image: url });
                          });
                        }}
                      />
                    </label>
                  ) : (
                    <input
                      type="text"
                      value={editingArticle.image}
                      onChange={(e) => setEditingArticle({ ...editingArticle, image: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono focus:outline-none"
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                  )}

                  {/* Image Preview */}
                  {editingArticle.image && (
                    <div className="mt-2 aspect-video w-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                      <img src={editingArticle.image} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Kutipan Pendek (Excerpt)</label>
                <textarea
                  rows={2}
                  value={editingArticle.excerpt}
                  onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none"
                  placeholder="Kutipan pendek 1-2 kalimat untuk ditampilkan di kartu depan..."
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Konten Lengkap Artikel</label>
                <textarea
                  rows={8}
                  value={editingArticle.content}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none leading-relaxed"
                  placeholder="Tulis artikel lengkap di sini..."
                />
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingArticle(null)}
                className="px-4 py-2 border border-gray-200 text-gray-500 rounded-lg text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleSaveArticle(editingArticle)}
                disabled={!editingArticle.title || !editingArticle.content}
                className="px-5 py-2 bg-[#008060] text-white rounded-lg text-xs font-bold uppercase disabled:opacity-50"
              >
                Simpan ke Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT/ADD GALLERY ITEM */}
      {editingGalleryItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-text">
          <div className="bg-white rounded-3xl overflow-hidden w-full max-w-md shadow-2xl relative">
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="text-xs font-black tracking-wider uppercase text-[#008060]">
                {isNewGalleryItem ? "Tambah Foto Baru" : "Edit Foto"}
              </h3>
              <button onClick={() => setEditingGalleryItem(null)} className="text-gray-400 hover:text-gray-600 text-xs font-black">X</button>
            </div>

            <div className="p-5 space-y-4">
              {/* Caption */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Keterangan Foto (Caption)</label>
                <input
                  type="text"
                  value={editingGalleryItem.caption}
                  onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, caption: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none"
                  placeholder="e.g. Proses penyemaian benih selada RZ"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Tanggal</label>
                <input
                  type="date"
                  value={editingGalleryItem.createdAt}
                  onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, createdAt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none"
                />
              </div>

              {/* Image Source */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Pilih Gambar (Upload / URL)</label>
                <div className="flex gap-2 mb-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setUploadType({ ...uploadType, galleryImg: "file" })}
                    className={`flex-1 py-1 text-[10px] font-bold rounded uppercase transition-all ${
                      uploadType.galleryImg === "file" ? "bg-emerald-100 text-[#008060]" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    File
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadType({ ...uploadType, galleryImg: "url" })}
                    className={`flex-1 py-1 text-[10px] font-bold rounded uppercase transition-all ${
                      uploadType.galleryImg === "url" ? "bg-emerald-100 text-[#008060]" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    URL
                  </button>
                </div>

                {uploadType.galleryImg === "file" ? (
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-[#008060] bg-white p-4 rounded-lg cursor-pointer text-xs font-semibold text-[#008060] transition-all">
                    <Upload className="h-4 w-4" /> Pilih & Kompres Gambar
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload("gallery", file, (url) => {
                          setEditingGalleryItem({ ...editingGalleryItem, imageUrl: url });
                        });
                      }}
                    />
                  </label>
                ) : (
                  <input
                    type="text"
                    value={editingGalleryItem.imageUrl}
                    onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono focus:outline-none"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                )}

                {/* Preview */}
                {editingGalleryItem.imageUrl && (
                  <div className="mt-2 aspect-square w-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                    <img src={editingGalleryItem.imageUrl} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingGalleryItem(null)}
                className="px-4 py-2 border border-gray-200 text-gray-500 rounded-lg text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleSaveGalleryItem(editingGalleryItem)}
                disabled={!editingGalleryItem.imageUrl}
                className="px-5 py-2 bg-[#008060] text-white rounded-lg text-xs font-bold uppercase disabled:opacity-50"
              >
                Simpan ke Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT USER ACCOUNT DETAILS */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-text">
          <div className="bg-white rounded-3xl overflow-hidden w-full max-w-md shadow-2xl relative">
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="text-xs font-black tracking-wider uppercase text-[#008060]">
                Edit Profil Akun Petani / Pengguna
              </h3>
              <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-600 text-xs font-black">X</button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-emerald-50 text-[11px] text-[#004D40] p-3 rounded-lg leading-relaxed mb-2">
                Anda dapat membantu memperbaiki penulisan nama, nama kebun, nomor HP, atau alamat petani jika mereka mengalami kesulitan teknis.
              </div>

              {/* Name */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nama Pemilik/Manager</label>
                <input
                  type="text"
                  value={editingUser.managerName || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, managerName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none"
                  placeholder="e.g. Ahmad Supono"
                />
              </div>

              {/* Farm Name */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nama Kebun</label>
                <input
                  type="text"
                  value={editingUser.farmName || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, farmName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none"
                  placeholder="e.g. Supono Hydroponic Blora"
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nomor Telepon/HP</label>
                <input
                  type="text"
                  value={editingUser.contactNumber || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, contactNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none"
                  placeholder="e.g. 08123456789"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Hak Akses / Peran (Role)</label>
                <select
                  value={editingUser.role || "petani"}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none"
                >
                  <option value="petani">Petani (Standard)</option>
                  <option value="admin">Admin (Website & Akun Control)</option>
                </select>
              </div>

              {/* Address */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Alamat Lengkap Kebun</label>
                <textarea
                  rows={2}
                  value={editingUser.address || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none"
                  placeholder="Alamat lengkap lokasi instalasi hidroponik..."
                />
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 border border-gray-200 text-gray-500 rounded-lg text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleSaveUser(editingUser)}
                className="px-5 py-2 bg-[#008060] text-white rounded-lg text-xs font-bold uppercase"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
