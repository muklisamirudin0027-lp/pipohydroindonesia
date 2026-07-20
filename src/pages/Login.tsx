import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Leaf, User, ArrowRight, Lock, ArrowLeft } from "lucide-react";
import { auth, googleProvider, db } from "../lib/firebase";
import { signInWithPopup, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const checkRoleAndNavigate = async (uid: string) => {
    try {
      // Just check if they exist, or even skip that since they successfully auth'd.
      // We'll still check to be safe.
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        navigate("/dashboard");
      } else {
        // If not exists in DB but authenticated, we can assume they are a farmer or just log them out
        navigate("/dashboard"); 
      }
    } catch (e: any) {
      const isOffline = e instanceof Error && (
        e.message.toLowerCase().includes("offline") || 
        e.message.toLowerCase().includes("could not reach") || 
        e.message.toLowerCase().includes("network") || 
        e.message.toLowerCase().includes("unavailable")
      );
      if (isOffline) {
        console.warn("Error getting user role (client is offline):", e.message || e);
        navigate("/dashboard");
      } else {
        console.error("Error getting user role:", e);
        navigate("/dashboard"); // Default fallback
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    const isSpecialAdmin = email.trim().toLowerCase() === "admin@pipohydro.com" && password === "adminpipohydro";

    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } catch (signInErr: any) {
        // If it's the custom admin credential and sign-in failed (e.g. account not created yet), auto-create it!
        if (isSpecialAdmin && (
          signInErr.code === "auth/user-not-found" || 
          signInErr.code === "auth/invalid-credential" || 
          signInErr.code === "auth/wrong-password" ||
          signInErr.code === "auth/invalid-email"
        )) {
          const { createUserWithEmailAndPassword } = await import("firebase/auth");
          userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
          
          // Seed the admin profile in Firestore
          const { setDoc, doc } = await import("firebase/firestore");
          await setDoc(doc(db, "users", userCredential.user.uid), {
            role: "admin",
            farmName: "Pipo Hydro Indonesia",
            managerName: "Administrator Website",
            logoUrl: "/logo-hijau.webp",
            contactNumber: "081234567890",
            address: "Blora, Jawa Tengah"
          });
        } else {
          throw signInErr;
        }
      }

      // Ensure the admin document in Firestore has role "admin"
      if (isSpecialAdmin && userCredential) {
        const { setDoc, doc } = await import("firebase/firestore");
        await setDoc(doc(db, "users", userCredential.user.uid), {
          role: "admin",
          farmName: "Pipo Hydro Indonesia",
          managerName: "Administrator Website",
          logoUrl: "/logo-hijau.webp",
          contactNumber: "081234567890",
          address: "Blora, Jawa Tengah"
        }, { merge: true });
      }

      await checkRoleAndNavigate(userCredential.user.uid);
    } catch (err: any) {
      if (err.code === "auth/network-request-failed") {
        setError("Gagal terhubung. Periksa koneksi internet Anda.");
      } else {
        setError("Email atau password salah.");
      }
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const result = await signInWithPopup(auth, googleProvider);
      await checkRoleAndNavigate(result.user.uid);
    } catch (err: any) {
      if (err.code === "auth/network-request-failed") {
        setError("Gagal terhubung. Periksa koneksi internet Anda.");
      } else {
        setError("Gagal masuk dengan Google.");
      }
      console.warn(err);
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
            Selamat Datang
          </h2>
          <p className="text-sm font-light text-center text-gray-500 mb-8">
            Silakan masuk untuk melanjutkan
          </p>

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
                  placeholder="Email Anda"
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
                  placeholder="Kata Sandi"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-[#008060] focus:ring-1 focus:ring-[#008060] transition-colors"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:bg-[#008060] peer-checked:border-[#008060] transition-all flex items-center justify-center group-hover:border-[#008060]">
                    <svg
                      className={`w-3.5 h-3.5 text-white ${rememberMe ? 'opacity-100' : 'opacity-0'} transition-opacity`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Tetap masuk</span>
              </label>

              <a href="#" className="text-xs font-medium text-[#008060] hover:text-[#004D40]">
                Lupa kata sandi?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-3 bg-[#008060] px-8 py-4 text-sm font-semibold tracking-widest text-white transition-all hover:bg-[#004D40] rounded-2xl shadow-md disabled:opacity-70"
            >
              {loading ? "MEMPROSES..." : "MASUK"}
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
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-8 py-4 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300 disabled:opacity-70"
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
            Masuk dengan Google
          </button>

          <div className="mt-6 text-center">
            <p className="text-xs font-light text-gray-500">
              Belum punya akun?{" "}
              <Link to="/register" className="font-semibold text-[#008060] hover:text-[#004D40]">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
