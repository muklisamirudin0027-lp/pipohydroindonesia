import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { User, ArrowRight, Lock, ArrowLeft } from "lucide-react";
import { auth, googleProvider, db } from "../lib/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"petani" | "customer" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const saveUserRole = async (uid: string, selectedRole: string, userEmail: string | null) => {
    try {
      await setDoc(doc(db, "users", uid), {
        role: selectedRole,
        email: userEmail,
        createdAt: new Date().toISOString()
      });
      return true;
    } catch (e: any) {
      console.error("Error saving user role:", e);
      if (e.message && e.message.includes("client is offline")) {
        throw new Error("offline");
      }
      throw e;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      setError("Silakan pilih peran Anda terlebih dahulu (Petani atau Pembeli).");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      try {
        await saveUserRole(userCredential.user.uid, role, userCredential.user.email);
        if (role === "petani") {
          navigate("/dashboard");
        } else {
          navigate("/pembeli");
        }
      } catch (dbError: any) {
        if (dbError.message === "offline") {
          setError("Akun berhasil dibuat, namun gagal menyimpan peran karena database offline.");
        } else {
          setError("Gagal menyimpan data pengguna.");
        }
        await auth.signOut();
      }
    } catch (err: any) {
      setError("Gagal mendaftar. Email mungkin sudah terdaftar atau kata sandi terlalu lemah.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!role) {
      setError("Silakan pilih peran Anda terlebih dahulu (Petani atau Pembeli).");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Check if user already exists
      try {
        const userDoc = await getDoc(doc(db, "users", result.user.uid));
        let currentRole = role;
        
        if (userDoc.exists()) {
          // If they already exist, use their existing role instead of overwriting
          currentRole = userDoc.data().role;
        } else {
          // Only save role if this is a new user
          await saveUserRole(result.user.uid, role, result.user.email);
        }
        
        if (currentRole === "petani") {
          navigate("/dashboard");
        } else {
          navigate("/pembeli");
        }
      } catch (dbError: any) {
        console.error("Database error during Google sign-in:", dbError);
        if (dbError.message && dbError.message.includes("client is offline")) {
          setError("Pendaftaran berhasil, tetapi gagal menyimpan peran karena database offline. Silakan coba lagi nanti.");
        } else {
          setError("Gagal memproses data pengguna: " + dbError.message);
        }
        await auth.signOut();
      }
    } catch (err: any) {
      setError("Gagal mendaftar dengan Google.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#008060]/10 rounded-full blur-3xl -mr-40 -mt-40 mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#4ADE80]/10 rounded-full blur-3xl -ml-20 -mb-20 mix-blend-multiply pointer-events-none" />

      <Link 
        to="/" 
        className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center gap-2 text-gray-500 hover:text-[#008060] transition-colors z-20"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="text-sm font-medium">Kembali ke Beranda</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden relative z-10"
      >
        <div className="p-10">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <img src="/logo-hijau.webp" alt="Pipo Hydro" className="h-10" />
            </div>
          </div>

          <h2 className="text-2xl font-light text-center text-[#424242] mb-2">
            Buat Akun Baru
          </h2>
          <p className="text-sm font-light text-center text-gray-500 mb-8">
            Pilih peran Anda dan daftar untuk memulai
          </p>

          <div className="flex gap-4 mb-8">
            <button
              type="button"
              onClick={() => setRole("petani")}
              className={`flex-1 py-3 text-xs font-semibold tracking-widest rounded-full transition-all duration-300 ${
                role === "petani"
                  ? "bg-[#004D40] text-white shadow-md"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              PETANI
            </button>
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={`flex-1 py-3 text-xs font-semibold tracking-widest rounded-full transition-all duration-300 ${
                role === "customer"
                  ? "bg-[#004D40] text-white shadow-md"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              PEMBELI
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg text-center">
                {error}
              </div>
            )}
            <div>
              <div className="relative flex items-center">
                <User className="absolute left-4 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === "petani" ? "Email Petani" : "Email Pembeli"}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-[#008060] focus:ring-1 focus:ring-[#008060] transition-colors"
                  required
                />
              </div>
            </div>
            <div>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kata Sandi (Min. 6 karakter)"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-[#008060] focus:ring-1 focus:ring-[#008060] transition-colors"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !role}
              className="group flex w-full items-center justify-center gap-3 bg-[#008060] px-8 py-4 text-sm font-semibold tracking-widest text-white transition-all hover:bg-[#004D40] rounded-2xl shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "MEMPROSES..." : "DAFTAR SEKARANG"}
              {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>
          </form>

          <div className="my-6 flex items-center justify-center gap-4">
            <div className="h-px w-full bg-gray-200"></div>
            <span className="text-xs font-medium text-gray-400">ATAU</span>
            <div className="h-px w-full bg-gray-200"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading || !role}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-8 py-4 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Daftar dengan Google
          </button>

          <div className="mt-8 text-center">
            <p className="text-xs font-light text-gray-500">
              Sudah punya akun?{" "}
              <Link to="/login" className="font-semibold text-[#008060] hover:text-[#004D40]">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
