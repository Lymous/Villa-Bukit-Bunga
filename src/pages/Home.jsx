import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Camera,
  Car,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  MessageCircle,
  Presentation,
  Search,
  SlidersHorizontal,
  Trees,
  Users,
  Utensils,
  Waves,
  Wifi,
} from "lucide-react";
import {
  ContactBanner,
  Lightbox,
  RoomCard,
  SectionIntro,
  VideoPlayer,
} from "../components/Shared";
import {
  facilities,
  hall,
  images,
  packages,
  rooms,
  rupiah,
  villa,
  whatsappUrl,
} from "../data";

const icons = { Waves, Presentation, Utensils, Trees };

function HeroSearch() {
  const navigate = useNavigate();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const today = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Jakarta",
  }).format(new Date());
  function submit(event) {
    event.preventDefault();
    const params = new URLSearchParams();
    for (const [key, value] of new FormData(event.currentTarget))
      if (value) params.set(key, value);
    navigate(`/paket${params.size ? `?${params}` : ""}`);
  }
  return (
    <form
      className="hero-search"
      onSubmit={submit}
      aria-label="Cari paket menginap"
    >
      <div className="hero-search-row">
        <label className={`hero-search-field ${checkin ? "has-value" : ""}`}>
          <CalendarDays size={18} />
          <span>{checkin ? "Check-in" : "Check-in (opsional)"}</span>
          <input
            type="date"
            name="check_in"
            aria-label="Tanggal check-in"
            min={today}
            value={checkin}
            onChange={(event) => {
              setCheckin(event.target.value);
              if (checkout && checkout <= event.target.value) setCheckout("");
            }}
          />
        </label>
        <label className={`hero-search-field ${checkout ? "has-value" : ""}`}>
          <CalendarDays size={18} />
          <span>{checkout ? "Check-out" : "Check-out (opsional)"}</span>
          <input
            type="date"
            name="check_out"
            aria-label="Tanggal check-out"
            min={
              checkin
                ? new Date(
                    new Date(`${checkin}T12:00:00Z`).getTime() + 86400000,
                  )
                    .toISOString()
                    .slice(0, 10)
                : today
            }
            value={checkout}
            onChange={(event) => setCheckout(event.target.value)}
          />
        </label>
        <label className="hero-guest-field">
          <Users size={18} />
          <input
            type="number"
            name="tamu"
            min="1"
            max="125"
            placeholder="Jumlah tamu"
            aria-label="Jumlah tamu"
          />
        </label>
        <button className="button button-gold" type="submit">
          <Search size={17} /> Cari
        </button>
      </div>
      <div className="hero-filter-toggle">
        <button
          type="button"
          aria-expanded={filtersOpen}
          aria-controls="hero-filters"
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          <SlidersHorizontal size={14} /> Filter{" "}
          <ChevronDown size={13} className={filtersOpen ? "rotated" : ""} />
        </button>
        <span>Temukan paketmu · Konfirmasi tanggal via WhatsApp</span>
      </div>
      {filtersOpen && (
        <div id="hero-filters" className="hero-filters">
          <label>
            Harga maksimal per malam
            <select name="max_price">
              <option value="">Semua harga</option>
              <option value="1500000">Hingga Rp1.500.000</option>
              <option value="2500000">Hingga Rp2.500.000</option>
              <option value="3750000">Hingga Rp3.750.000</option>
            </select>
          </label>
          <label>
            Minimal jumlah kamar
            <select name="min_kamar">
              <option value="">Semua pilihan</option>
              <option value="5">5 kamar</option>
              <option value="10">10 kamar</option>
              <option value="13">13 kamar</option>
            </select>
          </label>
          <label>
            Urutkan
            <select name="urut">
              <option value="nomor">Nomor paket</option>
              <option value="harga-naik">Harga terendah</option>
              <option value="harga-turun">Harga tertinggi</option>
            </select>
          </label>
        </div>
      )}
    </form>
  );
}

function FeaturedPackage({ pkg, className = "" }) {
  return (
    <Link to={`/paket/${pkg.slug}`} className={`featured-package ${className}`}>
      <img
        src={pkg.cover.src}
        alt={`Villa Bukit Bunga — Paket ${pkg.id}`}
        loading="lazy"
        width="1200"
        height="800"
      />
      <div className="featured-shade" />
      <span className="featured-badge">
        {pkg.id === 1
          ? "Keluarga"
          : pkg.id === 9
            ? "Rombongan Besar"
            : "Aula + Sound"}
      </span>
      <div className="featured-content">
        <h3>
          Paket {pkg.id} — {pkg.title}
        </h3>
        <p>
          <span>
            <Users size={14} /> {pkg.min}–{pkg.max} Orang
          </span>
          <span>
            {pkg.rooms.reduce((total, entry) => total + entry.quantity, 0)}{" "}
            Kamar
          </span>
          <span>{pkg.id === 1 ? "Tanpa aula" : "Aula & kolam renang"}</span>
        </p>
        <div>
          <strong>
            Rp {rupiah(pkg.price)} <small>/malam</small>
          </strong>
          <span className="featured-cta">
            Lihat Detail <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [gallery, setGallery] = useState(null);
  const yardVideoRef = useRef(null);
  const yardPhotosRef = useRef(null);
  const yard = facilities.find((facility) => facility.id === "halaman");
  const openGallery = (facility, initialIndex = 0) => {
    yardVideoRef.current?.pause();
    setGallery({ ...facility, initialIndex });
  };
  const scrollYardPhotos = (direction) => {
    const strip = yardPhotosRef.current;
    if (!strip) return;
    const atStart = strip.scrollLeft <= 2;
    const atEnd = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 2;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? "instant"
      : "smooth";
    if ((direction < 0 && atStart) || (direction > 0 && atEnd))
      strip.scrollTo({ left: direction > 0 ? 0 : strip.scrollWidth, behavior });
    else
      strip.scrollBy({ left: direction * strip.clientWidth * 0.8, behavior });
  };
  useEffect(() => {
    document.title =
      "Villa Bukit Bunga — Sewa Villa Keluarga & Gathering Pacet Mojokerto";
  }, []);
  return (
    <>
      <section className="hero">
        <div className="hero-background">
          <img
            className="hero-image"
            src={images.pool[1].src}
            alt="Kolam renang dan halaman Villa Bukit Bunga di Pacet"
            width="1800"
            height="1013"
            fetchPriority="high"
          />
          <div className="hero-shade" />
          <div className="hero-pattern" />
        </div>
        <div className="container hero-content">
          <div className="hero-location">
            <MapPin size={14} /> Pacet, Mojokerto <span>•</span>{" "}
            <span>Jawa Timur</span>
          </div>
          <h1>
            Complete Your
            <br />
            <em>Every Moment</em>
          </h1>
          <p>
            Villa Keluarga & Rombongan Gathering di Pacet. Cocok untuk Reuni,
            Acara Sekolah,
            <br className="desktop-break" /> Kampus, LDKS, dan Komunitas dengan
            Kolam Renang & Aula Sound System.
          </p>
          <HeroSearch />
        </div>
        <div className="hero-stats">
          <div className="container">
            <div>
              <strong>4 Tipe</strong>
              <span>Pilihan Kamar Menginap</span>
            </div>
            <div>
              <strong>9 Pilihan</strong>
              <span>Paket Sesuai Kebutuhan</span>
            </div>
            <div>
              <strong>125 Orang</strong>
              <span>Kapasitas Paket Terbesar</span>
            </div>
          </div>
        </div>
      </section>
      <section className="featured-section section-pad">
        <div className="container">
          <SectionIntro
            eyebrow="PILIHAN TERBAIK PACET"
            title={
              <>
                Paket Villa <em>Favorit</em>
              </>
            }
          >
            <Link className="text-link" to="/paket">
              Lihat Semua <ArrowRight size={16} />
            </Link>
          </SectionIntro>
          <div className="featured-grid">
            <FeaturedPackage pkg={packages[0]} />
            <FeaturedPackage pkg={packages[1]} />
            <FeaturedPackage pkg={packages[5]} className="featured-wide" />
            <Link className="featured-explore" to="/paket">
              <span className="eyebrow">PILIH SESUAI KEBUTUHANMU</span>
              <h3>
                Lihat <em>9 Paket</em>
                <br />
                Villa Lengkap
              </h3>
              <p>
                Mulai Rp500.000/malam
                <br />
                untuk keluarga hingga rombongan.
              </p>
              <span className="button button-gold">
                Jelajahi Semua Paket <ArrowRight size={16} />
              </span>
            </Link>
          </div>
        </div>
      </section>
      {yard?.video && (
        <section
          className="villa-yard-section section-pad"
          id="halaman-villa"
          aria-label="Halaman Villa"
        >
          <div className="container">
            <SectionIntro
              eyebrow="KENALI SUASANA VILLA"
              title={
                <>
                  Halaman <em>Villa</em>
                </>
              }
              text="Lihat suasana dan area villa melalui video atau langsung pilih foto-foto halamannya."
            />
            <VideoPlayer
              video={yard.video}
              title={yard.name}
              videoRef={yardVideoRef}
            />
            <div className="yard-photos-header">
              <h3>
                <Camera size={18} /> Foto Halaman Villa{" "}
                <span>{yard.photos.length} foto</span>
              </h3>
              <div className="yard-photos-controls">
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Geser foto halaman ke kiri"
                  onClick={() => scrollYardPhotos(-1)}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Geser foto halaman ke kanan"
                  onClick={() => scrollYardPhotos(1)}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
            <div
              className="yard-photo-strip"
              ref={yardPhotosRef}
              role="group"
              aria-label="Foto-foto Halaman Villa"
            >
              {yard.photos.map((photo, index) => (
                <button
                  type="button"
                  className="yard-photo-thumbnail"
                  key={photo.src}
                  aria-label={`Lihat foto halaman ${index + 1}`}
                  onClick={() => openGallery(yard, index)}
                >
                  <img
                    src={photo.thumb}
                    alt={`Halaman Villa Bukit Bunga — foto ${index + 1}`}
                    loading="lazy"
                    width="360"
                    height="225"
                  />
                  <span>{index + 1}</span>
                </button>
              ))}
            </div>
            <div className="yard-photos-caption">
              <p>
                Pilih foto untuk memperbesar, atau geser untuk melihat sudut
                lainnya.
              </p>
              <button
                type="button"
                className="text-link"
                onClick={() => openGallery(yard)}
              >
                Lihat semua {yard.photos.length} foto <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </section>
      )}
      <section className="rooms-section section-pad">
        <div className="container">
          <SectionIntro
            eyebrow="PILIHAN KAMAR SATUAN"
            title={
              <>
                Kamar Nyaman,
                <br />
                <em>Harga Bersahabat</em>
              </>
            }
            text="Pilih tipe kamar yang paling sesuai untuk waktu istirahatmu."
          >
            <Link className="text-link" to="/kamar">
              Semua Kamar <ArrowRight size={16} />
            </Link>
          </SectionIntro>
          <div className="room-grid">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
          <p className="section-footnote">
            Harga per kamar, per malam. Klik kamar untuk melihat seluruh foto.
          </p>
        </div>
      </section>
      <section className="facilities-section section-pad" id="fasilitas">
        <div className="container">
          <SectionIntro
            center
            eyebrow="FASILITAS VILLA BUKIT BUNGA"
            title={
              <>
                Segala Kenyamanan
                <br />
                <em>di Satu Tempat</em>
              </>
            }
            text="Kenali fasilitas dan suasana villa melalui foto-foto asli kami."
          />
          <div className="facility-grid">
            {facilities.map((facility) => {
              const Icon = icons[facility.icon];
              const isHall = facility.id === "aula";
              const detailPath = isHall
                ? "/aula"
                : facility.id === "ruang-makan"
                  ? "/ruang-makan"
                  : facility.id === "kolam"
                    ? "/kolam-renang"
                    : undefined;
              const Card = detailPath ? Link : "button";
              return (
                <Card
                  key={facility.id}
                  className="facility-card"
                  to={detailPath}
                  onClick={detailPath ? undefined : () => openGallery(facility)}
                  aria-label={
                    detailPath
                      ? `Lihat detail dan foto ${isHall ? "Aula" : facility.name}`
                      : `Lihat foto ${facility.name}`
                  }
                >
                  <div className="image-wrap">
                    <img
                      src={facility.cover.thumb}
                      alt={facility.name}
                      loading="lazy"
                      width="720"
                      height="540"
                    />
                    <span className="image-arrow">
                      <Camera size={18} />
                    </span>
                  </div>
                  <div className="facility-card-body">
                    <h3>
                      <Icon size={19} /> {facility.name}
                    </h3>
                    <p>{facility.description}</p>
                    {isHall && (
                      <p className="facility-rental-price">
                        Sewa satuan <strong>Rp{rupiah(hall.price)}</strong>{" "}
                        /malam
                      </p>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
          <div className="amenity-strip">
            <span>
              <Wifi size={23} /> Wi-Fi Tersedia
            </span>
            <span>
              <Car size={23} /> Area Parkir
            </span>
            <span>
              <Utensils size={23} /> Dapur
            </span>
            <span>
              <Presentation size={23} /> Sound System & Meja Kursi Rapat
            </span>
          </div>
          <p className="section-footnote">
            Fasilitas yang termasuk mengikuti paket pilihanmu. Paket 1 tidak
            termasuk aula.
          </p>
        </div>
      </section>
      <section className="how-section section-pad" id="cara-pesan">
        <div className="container">
          <SectionIntro
            center
            eyebrow="MUDAH & LANGSUNG DENGAN PENGELOLA"
            title={
              <>
                Cara Reservasi <em>Villa</em>
              </>
            }
            text="Tiga langkah sederhana untuk merencanakan kunjunganmu."
          />
          <div className="steps-grid">
            {[
              {
                n: "01",
                icon: Search,
                title: "Pilih Kamar atau Paket",
                text: "Jelajahi pilihan, harga, kapasitas, dan foto kamar yang tersedia.",
              },
              {
                n: "02",
                icon: MessageCircle,
                title: "Hubungi via WhatsApp",
                text: "Kirim pilihan kamar atau paket beserta rencana tanggal menginap.",
              },
              {
                n: "03",
                icon: Check,
                title: "Konfirmasi dengan Pengelola",
                text: "Pastikan ketersediaan, jumlah tamu, dan rincian reservasi langsung dengan kami.",
              },
            ].map((step) => (
              <div key={step.n} className="step">
                <span className="step-number">{step.n}</span>
                <span className="step-icon">
                  <step.icon size={25} />
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <a
              className="button"
              href={whatsappUrl()}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={17} /> Tanya Ketersediaan Sekarang{" "}
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>
      <section className="location-section container section-pad" id="lokasi">
        <div className="location-image">
          <img
            src={images.villa_yard[9].src}
            alt="Halaman dan bangunan Villa Bukit Bunga"
            loading="lazy"
            width="900"
            height="700"
          />
          <span>
            <MapPin size={16} /> PACET, MOJOKERTO
          </span>
        </div>
        <div className="location-content">
          <span className="eyebrow">KAMI TUNGGU DI PACET</span>
          <h2>
            Mudah Dijangkau,
            <br />
            <em>Tenang Tersembunyi</em>
          </h2>
          <p>
            Temui kami di kawasan Pacet, Mojokerto. Jadikan Villa Bukit Bunga
            tempat bertemu, beristirahat, dan menikmati kebersamaan.
          </p>
          <div className="address">
            <MapPin size={21} />
            <div>
              <strong>Villa Bukit Bunga</strong>
              <span>{villa.address}</span>
            </div>
          </div>
          <a
            className="button button-outline"
            href={villa.maps}
            target="_blank"
            rel="noreferrer"
          >
            Buka Google Maps <ArrowUpRight size={18} />
          </a>
        </div>
      </section>
      <ContactBanner />
      {gallery && (
        <Lightbox
          photos={gallery.photos}
          title={gallery.name}
          initialIndex={gallery.initialIndex}
          onClose={() => setGallery(null)}
        />
      )}
    </>
  );
}
