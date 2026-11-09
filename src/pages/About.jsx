import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  Car,
  MapPin,
  Presentation,
  Utensils,
  Waves,
  Wifi,
} from "lucide-react";
import { Breadcrumbs, ContactBanner, SectionIntro } from "../components/Shared";
import { images, villa } from "../data";

export default function About() {
  useEffect(() => {
    document.title = "Tentang Villa Bukit Bunga — Pacet, Mojokerto";
  }, []);
  return (
    <>
      <section className="page-heading package-page-heading">
        <div className="container">
          <Breadcrumbs items={[{ label: "Tentang Kami" }]} />
          <div className="page-heading-row">
            <div>
              <span className="eyebrow">VILLA KELUARGA & ROMBONGAN</span>
              <h1>
                Tentang
                <br />
                <em>Villa Bukit Bunga</em>
              </h1>
            </div>
            <p>
              Tempat berkumpul, beristirahat, dan berbagi momen di Pacet,
              Mojokerto.
            </p>
          </div>
        </div>
      </section>
      <section className="container location-section section-pad">
        <div className="location-image">
          <img
            src={images.villa_yard[9].src}
            alt="Suasana halaman Villa Bukit Bunga"
            fetchPriority="high"
            width="900"
            height="700"
          />
        </div>
        <div className="location-content">
          <span className="eyebrow">SELAMAT DATANG DI PACET</span>
          <h2>
            Villa Keluarga & Rombongan
            <br />
            <em>di Pacet, Mojokerto</em>
          </h2>
          <p>
            Villa Bukit Bunga menyediakan pilihan kamar dan paket menginap untuk
            pertemuan keluarga, sekolah, kampus, LDKS, dan berbagai kegiatan
            rombongan.
          </p>
          <p>
            Kenali empat tipe kamar, sembilan pilihan paket, dan fasilitas villa
            melalui foto asli. Rencanakan kunjunganmu langsung dengan pengelola
            melalui WhatsApp.
          </p>
          <Link className="button button-outline" to="/paket">
            Jelajahi Pilihan Paket <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <section className="facilities-section section-pad">
        <div className="container">
          <SectionIntro
            center
            eyebrow="UNTUK KEBUTUHAN MENGINAPMU"
            title="Apa yang Kami Sediakan"
          />
          <div className="about-amenities">
            {[
              [Waves, "Kolam Renang", "Bersantai dan berenang bersama."],
              [
                Presentation,
                "Aula & Sound System",
                "Ruang untuk pertemuan dan kegiatan.",
              ],
              [
                BedDouble,
                "Pilihan Kamar",
                "Standart, Duluxe, Private, dan Kamar Besar.",
              ],
              [
                Utensils,
                "Ruang Makan & Dapur",
                "Fasilitas untuk waktu makan bersama.",
              ],
              [Car, "Area Parkir", "Area untuk kendaraan tamu villa."],
              [Wifi, "Wi-Fi Tersedia", "Tetap terhubung selama kunjungan."],
            ].map(([Icon, title, text]) => (
              <div key={title}>
                <Icon size={28} />
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
          <p className="section-footnote">
            Fasilitas yang termasuk mengikuti rincian paket. Paket 1 tidak
            termasuk aula.
          </p>
        </div>
      </section>
      <section className="container location-section section-pad">
        <div className="location-content">
          <span className="eyebrow">KONTAK & LOKASI</span>
          <h2>
            Mudah Dijangkau,
            <br />
            <em>Tenang Tersembunyi</em>
          </h2>
          <div className="address">
            <MapPin size={21} />
            <div>
              <strong>{villa.name}</strong>
              <span>{villa.address}</span>
            </div>
          </div>
          <a
            className="button"
            href={villa.maps}
            target="_blank"
            rel="noreferrer"
          >
            Buka Google Maps <ArrowUpRight size={17} />
          </a>
        </div>
        <div className="location-image">
          <img
            src={images.pool[1].src}
            alt="Kolam renang dan halaman villa"
            loading="lazy"
            width="900"
            height="700"
          />
        </div>
      </section>
      <ContactBanner />
    </>
  );
}
