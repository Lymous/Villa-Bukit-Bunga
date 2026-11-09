import { useEffect, useRef } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Header, Footer } from "./components/Shared";
import Home from "./pages/Home";
import Packages, { PackageDetail } from "./pages/Packages";
import Rooms, { RoomDetail } from "./pages/Rooms";
import About from "./pages/About";
import Hall from "./pages/Hall";
import DiningRoom from "./pages/DiningRoom";
import Pool from "./pages/Pool";
import { whatsappUrl } from "./data";

function PageNavigation() {
  const { pathname, hash } = useLocation();
  const firstRender = useRef(true);
  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() =>
        document
          .getElementById(decodeURIComponent(hash.slice(1)))
          ?.scrollIntoView({ behavior: "smooth" }),
      );
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
      if (!firstRender.current)
        document.querySelector("main")?.focus({ preventScroll: true });
    }
    firstRender.current = false;
  }, [pathname, hash]);
  return null;
}

export function NotFound() {
  useEffect(() => {
    document.title = "Halaman tidak ditemukan — Villa Bukit Bunga";
  }, []);
  return (
    <div className="container not-found">
      <span className="eyebrow">HALAMAN TIDAK DITEMUKAN</span>
      <h1>
        Mari kembali
        <br />
        ke tempat yang tepat.
      </h1>
      <p>Halaman yang kamu cari belum tersedia.</p>
      <Link className="button" to="/">
        <ArrowLeft size={17} /> Kembali ke beranda
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Langsung ke konten
      </a>
      <PageNavigation />
      <Header />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/paket" element={<Packages />} />
          <Route path="/paket/:id" element={<PackageDetail />} />
          <Route path="/kamar" element={<Rooms />} />
          <Route path="/kamar/:id" element={<RoomDetail />} />
          <Route path="/aula" element={<Hall />} />
          <Route path="/ruang-makan" element={<DiningRoom />} />
          <Route path="/kolam-renang" element={<Pool />} />
          <Route path="/tentang-kami" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <a
        className="floating-whatsapp"
        href={whatsappUrl()}
        target="_blank"
        rel="noreferrer"
        aria-label="Hubungi Villa melalui WhatsApp"
      >
        <MessageCircle size={22} />
        <span>Hubungi Villa</span>
      </a>
    </>
  );
}
