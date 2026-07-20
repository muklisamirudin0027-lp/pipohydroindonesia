import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  Leaf, 
  ShoppingBag, 
  Settings, 
  LogOut,
  Bell,
  Globe
} from "lucide-react";
import { motion } from "motion/react";

import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

// Dashboard Views
import { DashboardHome } from "./dashboard/DashboardHome";
import { DashboardKebun } from "./dashboard/DashboardKebun";
import { DashboardKasir } from "./dashboard/DashboardKasir";
import { DashboardPengaturan } from "./dashboard/DashboardPengaturan";
import { DashboardWebsite } from "./dashboard/DashboardWebsite";

export function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        } catch (error: any) {
          const isOffline = error instanceof Error && (
            error.message.toLowerCase().includes("offline") || 
            error.message.toLowerCase().includes("could not reach") || 
            error.message.toLowerCase().includes("network") || 
            error.message.toLowerCase().includes("unavailable")
          );
          if (isOffline) {
            console.warn("Client is offline. Using local fallback profile for Dashboard:", error.message || error);
            setUserData({
              managerName: user.displayName || "Petani Pipo",
              farmName: "Kebun Hidroponik Pipo",
              contactNumber: "0812-xxxx-xxxx",
              role: "admin",
              email: user.email
            });
          } else {
            console.error("Error fetching user data:", error);
          }
        }
      }
    };
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData();
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, [location.pathname]);

  useEffect(() => {
    if (userData?.role === "admin" && (location.pathname === "/dashboard" || location.pathname === "/dashboard/")) {
      navigate("/dashboard/website", { replace: true });
    }
  }, [userData, location.pathname, navigate]);

  const navItems = userData?.role === "admin"
    ? [
        { name: "Kelola Website", icon: Globe, path: "/dashboard/website" },
        { name: "Pengaturan", icon: Settings, path: "/dashboard/pengaturan" },
      ]
    : [
        { name: "Beranda", icon: Home, path: "/dashboard" },
        { name: "Kebun", icon: Leaf, path: "/dashboard/kebun" },
        { name: "Kasir", icon: ShoppingBag, path: "/dashboard/kasir" },
        { name: "Pengaturan", icon: Settings, path: "/dashboard/pengaturan" },
      ];

  const currentTabName = navItems.find(item => 
    location.pathname === item.path || 
    (item.path !== "/dashboard" && location.pathname.startsWith(item.path))
  )?.name || "Dashboard";

  return (
    <div className="flex h-screen bg-[#F5F7F5] overflow-hidden font-sans select-none">
      {/* Sidebar for Desktop */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col hidden md:flex shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-gray-50">
          {userData?.logoUrl ? (
            <img src={userData.logoUrl} alt="Logo" className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <img src="/logo-hijau.webp" alt="Pipo Hydro" className="h-8" />
          )}
          <span className="text-sm font-bold tracking-widest text-[#004D40] line-clamp-1 truncate">
            {userData?.farmName || "PIPO HYDRO"}
          </span>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
                             (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? "bg-[#008060]/10 text-[#008060] font-semibold" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "text-[#008060]" : "text-gray-400"}`} />
                <span className="text-sm">{item.name === "Kasir" ? "Kasir & Keuangan" : item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden pb-16 md:pb-0">
        {/* Top Header */}
        <header className="h-16 md:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-3">
            {/* Show tiny logo/icon on mobile header left side */}
            <div className="md:hidden flex items-center justify-center h-8 w-8 rounded-full bg-[#008060]/10 text-[#008060]">
              <Leaf className="h-4.5 w-4.5" />
            </div>
            <h1 className="text-lg md:text-xl font-bold md:font-semibold text-[#424242]">
              {currentTabName === "Kasir" ? "Kasir & Keuangan" : currentTabName}
            </h1>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <button className="relative p-2 text-gray-400 hover:text-[#008060] transition-colors md:block hidden">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-6 md:border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-[#424242]">{userData?.managerName || "Owner"}</p>
                <p className="text-xs text-gray-500">{userData?.role === "admin" ? "Administrator Website" : "Pemilik Kebun"}</p>
              </div>
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-[#008060]/10 flex items-center justify-center text-[#008060] font-bold overflow-hidden">
                {userData?.logoUrl ? (
                  <img src={userData.logoUrl} alt="Logo" className="h-full w-full object-cover" />
                ) : (
                  (userData?.managerName ? userData.managerName.charAt(0).toUpperCase() : "PM")
                )}
              </div>
            </div>

            {/* Logout button on mobile header */}
            <button
              onClick={handleLogout}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors md:hidden"
              title="Keluar"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Routes>
              {userData?.role === "admin" ? (
                <>
                  <Route path="/" element={<DashboardWebsite />} />
                  <Route path="/website" element={<DashboardWebsite />} />
                  <Route path="/pengaturan" element={<DashboardPengaturan />} />
                  <Route path="*" element={<DashboardWebsite />} />
                </>
              ) : (
                <>
                  <Route path="/" element={<DashboardHome />} />
                  <Route path="/kebun" element={<DashboardKebun />} />
                  <Route path="/kasir" element={<DashboardKasir />} />
                  <Route path="/pengaturan" element={<DashboardPengaturan />} />
                </>
              )}
            </Routes>
          </motion.div>
        </div>
      </main>

      {/* Bottom Tab Bar for Mobile Devices */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-100 flex justify-around items-center px-2 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                           (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-150 ${
                isActive 
                  ? "text-[#008060] font-semibold" 
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <item.icon className={`h-5 w-5 mb-1 ${isActive ? "text-[#008060] scale-110" : "text-gray-400"}`} />
              <span className="text-[10px] tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
