import { Facebook, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0b1c17] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:gap-16 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo-putih.webp" alt="Pipo Hydro Indonesia Logo" className="h-10 w-auto object-contain" />
              <span className="text-sm md:text-lg font-bold tracking-widest text-white">
                PIPO HYDRO INDONESIA
              </span>
            </div>
            <p className="text-sm font-light leading-relaxed text-gray-400">
              Menghadirkan masa depan pertanian melalui sayuran segar berkualitas tinggi, tanpa pestisida, dan ditanam secara cerdas melalui sistem hidroponik NFT.
            </p>
            <div className="mt-8 flex gap-5">
              <a href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-8 text-xs font-semibold tracking-[0.2em] text-gray-400">
              JELAJAHI
            </h3>
            <ul className="space-y-4">
              {["Beranda", "Produk Kami", "Mengapa Kami", "Teknologi"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm font-light text-gray-300 hover:text-[#D4AF37] transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-8 text-xs font-semibold tracking-[0.2em] text-gray-400">
              PERUSAHAAN
            </h3>
            <ul className="space-y-4">
              {["Cerita Kami", "Keberlanjutan", "Karir", "Kontak"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm font-light text-gray-300 hover:text-[#D4AF37] transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-8 text-xs font-semibold tracking-[0.2em] text-gray-400">
              HUBUNGI KAMI
            </h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#008060] shrink-0" />
                <span className="text-sm font-light text-gray-300">
                  Dukuh Tambak, Desa Sumber<br />
                  Kec. Kradenan, Kab. Blora,<br />Jawa Tengah
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#008060] shrink-0" />
                <span className="text-sm font-light text-gray-300">+62 812 3456 7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#008060] shrink-0" />
                <span className="text-sm font-light text-gray-300">halo@pipohydro.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 sm:mt-24 flex flex-col items-center justify-between border-t border-white/10 pt-8 gap-4 md:flex-row text-center md:text-left">
          <p className="text-xs font-light text-gray-500">
            &copy; {new Date().getFullYear()} Pipo Hydro Indonesia. Hak Cipta Dilindungi.
          </p>
          <div className="flex gap-6 text-xs font-light text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
