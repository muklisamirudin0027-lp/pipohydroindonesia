import { Routes, Route, Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Leaf, 
  ShoppingBag, 
  Settings, 
  LogOut,
  Bell
} from "lucide-react";
import { motion } from "motion/react";

// Dashboard Views
import { DashboardHome } from "./dashboard/DashboardHome";
import { DashboardKebun } from "./dashboard/DashboardKebun";
import { DashboardKasir } from "./dashboard/DashboardKasir";
import { DashboardPengaturan } from "./dashboard/DashboardPengaturan";

export function Dashboard() {
  const location = useLocation();

  const navItems = [
    { name: "Beranda", icon: Home, path: "/dashboard" },
    { name: "Kebun", icon: Leaf, path: "/dashboard/kebun" },
    { name: "Kasir & Penjualan", icon: ShoppingBag, path: "/dashboard/kasir" },
    { name: "Pengaturan", icon: Settings, path: "/dashboard/pengaturan" },
  ];

  return (
    <div className="flex h-screen bg-[#F5F7F5] overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3 border-b border-gray-50">
          <img src="/logo-hijau.webp" alt="Pipo Hydro" className="h-8" />
          <span className="text-sm font-bold tracking-widest text-[#004D40]">
            PIPO HYDRO
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
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm">Keluar</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-semibold text-[#424242]">
            {navItems.find(item => location.pathname === item.path || (item.path !== "/dashboard" && location.pathname.startsWith(item.path)))?.name || "Dashboard"}
          </h1>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-[#008060] transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <div className="text-right">
                <p className="text-sm font-semibold text-[#424242]">Petani Milenial</p>
                <p className="text-xs text-gray-500">Admin Kradenan</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-[#008060]/10 flex items-center justify-center text-[#008060] font-bold">
                PM
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/kebun" element={<DashboardKebun />} />
              <Route path="/kasir" element={<DashboardKasir />} />
              <Route path="/pengaturan" element={<DashboardPengaturan />} />
            </Routes>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
