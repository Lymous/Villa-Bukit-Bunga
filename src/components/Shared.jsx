import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Download,
  Flower2,
  Grid2X2,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Play,
  Presentation,
  Users,
  Utensils,
  Waves,
  X,
} from "lucide-react";
import { rooms, rupiah, villa, whatsappUrl } from "../data";

export function Logo({ light = false }) {
  return (
    <Link
      to="/"
      className={`brand ${light ? "brand-light" : ""}`}
      aria-label="Villa Bukit Bunga — Beranda"
    >
      <img
        className="brand-logo"
        src={light ? "/logo/logo-white.svg" : "/logo/logo.svg"}
        alt=""
        width="42"
        height="42"
      />
      <span className="brand-name">
        Villa Bukit Bunga<small>PACET · MOJOKERTO</small>
      </span>
    </Link>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const heroPage =
    location.pathname === "/" ||
    location.pathname === "/paket" ||
    location.pathname === "/tentang-kami";
  const transparent = heroPage && !scrolled && !menuOpen;
  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 40);
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);
  useEffect(() => {
    if (!menuOpen) return;
    const onEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [menuOpen]);
  return (
    <header
      className={`site-header ${heroPage ? "header-over-hero" : ""} ${transparent ? "header-transparent" : ""}`}
    >
      <div className="container header-inner">
        <Logo light={transparent} />
        <button
          className="icon-button menu-toggle"
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav
          id="main-navigation"
          className={`main-nav ${menuOpen ? "is-open" : ""}`}
          aria-label="Navigasi utama"
        >
          <NavLink to="/kamar">Kamar</NavLink>
          <NavLink to="/aula">Aula</NavLink>
          <NavLink to="/paket">Paket Villa</NavLink>
          <Link to="/#fasilitas">Fasilitas</Link>
          <Link to="/#cara-pesan">Cara Pesan</Link>
          <NavLink to="/tentang-kami">Tentang Kami</NavLink>
          <a
            className="button button-small nav-book"
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={16} /> Reservasi
          </a>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <Logo light />
          <p>
            Villa keluarga dan rombongan gathering di kawasan sejuk Pacet,
            Mojokerto. Pilihan kamar dan paket menginap untuk reuni, acara
            sekolah, kampus, dan kebersamaan keluarga.
          </p>
          <div className="footer-social">
            <a
              aria-label="WhatsApp Villa"
              href={whatsappUrl()}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={19} />
            </a>
            <a
              aria-label="Lokasi Villa"
              href={villa.maps}
              target="_blank"
              rel="noreferrer"
            >
              <MapPin size={19} />
            </a>
          </div>
        </div>
        <div>
          <span className="footer-title">JELAJAHI</span>
          <Link to="/kamar">Pilihan kamar</Link>
          <Link to="/aula">Sewa aula satuan</Link>
          <Link to="/ruang-makan">Ruang makan</Link>
          <Link to="/kolam-renang">Kolam renang</Link>
          <Link to="/paket">Paket menginap</Link>
          <Link to="/#fasilitas">Fasilitas villa</Link>
        </div>
        <div>
          <span className="footer-title">PILIHAN PAKET</span>
          {[1, 3, 6, 9].map((id) => (
            <Link key={id} to={`/paket/${id}`}>
              Paket {id}
              {id === 1 ? " (Keluarga)" : id === 9 ? " (Rombongan besar)" : ""}
            </Link>
          ))}
        </div>
        <div>
          <span className="footer-title">KONTAK & LOKASI</span>
          <p>{villa.address}</p>
          <a href={whatsappUrl()} target="_blank" rel="noreferrer">
            <MessageCircle size={16} /> {villa.phone}
          </a>
          <a href={villa.maps} target="_blank" rel="noreferrer">
            Petunjuk arah <ArrowUpRight size={15} />
          </a>
          <a
            href="/villa-bukit-bunga-flyer.pdf"
            target="_blank"
            rel="noreferrer"
          >
            <Download size={16} /> Brosur paket
          </a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} Villa Bukit Bunga Pacet. Hak Cipta
          Dilindungi.
        </span>
        <span>Reservasi langsung via WhatsApp</span>
      </div>
    </footer>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  text,
  children,
  center = false,
}) {
  return (
    <div className={`section-intro ${center ? "text-center" : ""}`}>
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
      {children}
    </div>
  );
}

export function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link to="/">Beranda</Link>
      {items.map((item, i) => (
        <span key={i}>
          <ChevronRight size={13} />
          {item.to ? (
            <Link to={item.to}>{item.label}</Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

const facilityCardTypes = {
  hall: {
    subject: "aula",
    caption: "Ruang pertemuan",
    Icon: Presentation,
    className: "hall-card",
  },
  dining: {
    subject: "ruang makan",
    caption: "Ruang makan bersama",
    Icon: Utensils,
    className: "dining-card",
  },
  pool: {
    subject: "kolam renang",
    caption: "Fasilitas kolam renang",
    Icon: Waves,
    className: "pool-card",
  },
};

export function RoomCard({ room, quantity, packageId }) {
  const facilityType = facilityCardTypes[room.kind];
  const isHall = room.kind === "hall";
  const isFacility = Boolean(facilityType);
  const subject = facilityType?.subject || "kamar";
  const path = isFacility ? `/${room.id}` : `/kamar/${room.id}`;
  const SpaceIcon = facilityType?.Icon || BedDouble;
  const [params] = useSearchParams();
  const query = new URLSearchParams();
  if (packageId) query.set("paket", String(packageId));
  for (const [key, value] of new URLSearchParams(reservationQuery(params)))
    query.set(key, value);
  return (
    <CardWithVideo
      video={room.video}
      title={isFacility ? room.name : `Kamar ${room.name}`}
    >
      <Link
        className={`room-card${isFacility ? ` facility-space-card ${facilityType.className}` : ""}`}
        to={`${path}${query.size ? `?${query}` : ""}`}
      >
        <div className="image-wrap">
          <img
            src={room.cover.thumb}
            alt={`Interior ${isFacility ? subject : `kamar ${room.name}`} di Villa Bukit Bunga`}
            loading="lazy"
            width="720"
            height="480"
          />
          {quantity && (
            <span className="photo-pill">
              {isFacility
                ? `${room.name} termasuk`
                : `${quantity} kamar termasuk`}
            </span>
          )}
          <span className="image-arrow">
            <ArrowUpRight size={21} />
          </span>
        </div>
        <div className="room-card-body">
          <div className="room-card-top">
            <h3>{room.name}</h3>
            <span className="tiny-label">
              {quantity
                ? "LIHAT FOTO"
                : isHall
                  ? "SEWA SATUAN"
                  : isFacility
                    ? "FASILITAS VILLA"
                    : "PER KAMAR"}
            </span>
          </div>
          <p>{room.label}</p>
          <div className="room-card-amenities">
            <span>
              <SpaceIcon size={13} /> {facilityType?.caption || "Tempat tidur"}
            </span>
            <span>
              {isFacility
                ? `${room.photos.length} foto ${subject}`
                : "Kamar mandi dalam"}
            </span>
          </div>
          {!quantity && room.price != null && (
            <div className="room-price">
              <div>
                <small>{isHall ? "HARGA SEWA AULA" : "HARGA PER KAMAR"}</small>
                <strong>Rp {rupiah(room.price)}</strong>
                <span>/malam</span>
              </div>
              <span className="card-action">
                {isHall ? "Lihat aula" : "Lihat kamar"} <ArrowRight size={14} />
              </span>
            </div>
          )}
          {(quantity || room.price == null) && (
            <span className="text-link">
              Jelajahi foto {subject} <ArrowRight size={15} />
            </span>
          )}
        </div>
      </Link>
    </CardWithVideo>
  );
}

export function CardWithVideo({ video, title, children }) {
  const [videoOpen, setVideoOpen] = useState(false);
  if (!video) return children;
  return (
    <div className="card-with-video">
      {children}
      <button
        className="card-video-button"
        type="button"
        aria-label={`Lihat video ${title}`}
        onClick={() => setVideoOpen(true)}
      >
        <Play size={14} fill="currentColor" /> Lihat video
      </button>
      {videoOpen && (
        <VideoDialog
          video={video}
          title={title}
          onClose={() => setVideoOpen(false)}
        />
      )}
    </div>
  );
}

export function VideoPlayer({ video, title, autoPlay = false, videoRef }) {
  return (
    <video
      ref={videoRef}
      className="video-player"
      controls
      playsInline
      preload="none"
      poster={video.poster}
      autoPlay={autoPlay}
      aria-label={`Video ${title}`}
    >
      <source src={video.src} type={video.type || "video/mp4"} />
      Browser Anda belum mendukung pemutar video.{" "}
      <a href={video.src} target="_blank" rel="noreferrer">
        Buka video {title}
      </a>
      .
    </video>
  );
}

export function VideoDialog({ video, title, onClose }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    const player = dialog.querySelector("video");
    const previousFocus = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    player?.play().catch(() => {});
    return () => {
      player?.pause();
      dialog.close();
      document.body.style.overflow = overflow;
      requestAnimationFrame(() => {
        if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
          previousFocus.focus({ preventScroll: true });
      });
    };
  }, []);
  return (
    <dialog
      ref={dialogRef}
      className="lightbox video-dialog"
      aria-label={`Video ${title}`}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="lightbox-header">
        <div>
          <strong>{title}</strong>
          <span>Video villa · {formatDuration(video.duration)}</span>
        </div>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Tutup video"
        >
          <X />
        </button>
      </div>
      <div className="video-stage">
        <VideoPlayer video={video} title={title} autoPlay />
      </div>
    </dialog>
  );
}

export function formatDuration(seconds) {
  const total = Math.floor(seconds || 0);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

export function PackageCard({ pkg }) {
  const [params] = useSearchParams();
  const query = reservationQuery(params);
  const roomCount = pkg.rooms.reduce((sum, room) => sum + room.quantity, 0);
  return (
    <Link
      className="package-card"
      to={`/paket/${pkg.slug}${query ? `?${query}` : ""}`}
    >
      <div className="image-wrap">
        <img
          src={pkg.cover.thumb}
          alt={`Villa Bukit Bunga — Paket ${pkg.id}`}
          loading="lazy"
          width="720"
          height="480"
        />
        <div className="package-photo-badges">
          <span>
            <Users size={13} /> {pkg.min}–{pkg.max} Orang
          </span>
          {pkg.id > 1 && <span className="gold-badge">Aula + Sound</span>}
        </div>
        <span className="package-number">Paket {pkg.id}</span>
      </div>
      <div className="package-card-body">
        <div className="package-card-heading">
          <h3>
            Paket {pkg.id}
            {pkg.title && <span> — {pkg.title}</span>}
          </h3>
        </div>
        <div className="package-meta">
          <span>
            <Users size={15} /> {pkg.min}–{pkg.max} orang
          </span>
          <span>
            <BedDouble size={15} /> {roomCount} kamar
          </span>
        </div>
        <p className="package-room-list">
          {pkg.rooms
            .map(
              (entry) =>
                `${entry.quantity} Kamar ${rooms.find((r) => r.id === entry.id).name}`,
            )
            .join(" + ")}
          {pkg.id === 1 ? ". Tanpa aula." : "."}
        </p>
        <div className="package-facility-tags">
          {(pkg.id === 1
            ? ["1 Kamar Besar", "Tanpa aula"]
            : ["Aula & sound system", "Ruang makan", "Dapur", "Kolam renang"]
          ).map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        <div className="package-card-bottom">
          <div>
            <small>HARGA PAKET</small>
            <strong>Rp {rupiah(pkg.price)}</strong>
            <span>/malam</span>
          </div>
          <span className="card-action">
            Lihat Detail <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function Lightbox({ photos, initialIndex = 0, title, onClose }) {
  const [index, setIndex] = useState(initialIndex);
  const dialogRef = useRef(null);
  const clearGallerySelection = () => {
    const selection = window.getSelection();
    if (
      selection &&
      (dialogRef.current?.contains(selection.anchorNode) ||
        dialogRef.current?.contains(selection.focusNode))
    )
      selection.removeAllRanges();
  };
  const selectPhoto = (nextIndex) => {
    clearGallerySelection();
    setIndex(nextIndex);
  };
  const step = (amount) => {
    clearGallerySelection();
    setIndex((current) => (current + amount + photos.length) % photos.length);
  };
  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      requestAnimationFrame(() => {
        if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
          previousFocus.focus({ preventScroll: true });
      });
    };
  }, []);
  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label={`Galeri foto ${title}`}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          step(1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          step(-1);
        }
      }}
    >
      <div className="lightbox-header">
        <div>
          <strong>{title}</strong>
          <span aria-live="polite">
            Foto {index + 1} dari {photos.length}
          </span>
        </div>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Tutup galeri"
        >
          <X />
        </button>
      </div>
      <div className="lightbox-stage">
        <button
          className="icon-button gallery-prev"
          onClick={() => step(-1)}
          aria-label="Foto sebelumnya"
        >
          <ChevronLeft />
        </button>
        <img
          src={photos[index].src}
          alt={`${title} — foto ${index + 1}`}
          draggable={false}
        />
        <button
          className="icon-button gallery-next"
          onClick={() => step(1)}
          aria-label="Foto berikutnya"
        >
          <ChevronRight />
        </button>
      </div>
      <div className="lightbox-thumbs">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            className={i === index ? "selected" : ""}
            onClick={() => selectPhoto(i)}
            aria-label={`Tampilkan foto ${i + 1}`}
            aria-pressed={i === index}
          >
            <img src={photo.thumb} alt="" loading="lazy" draggable={false} />
          </button>
        ))}
      </div>
    </dialog>
  );
}

export function PhotoGallery({ photos, title, onOpen }) {
  const visiblePhotos = photos.slice(0, 5);
  return (
    <>
      <div
        className={`room-photo-grid${photos.length === 3 ? " gallery-three" : ""}`}
      >
        {visiblePhotos.map((photo, index) => (
          <button
            key={photo.src}
            className={`room-photo photo-${index}`}
            onClick={() => onOpen(index)}
            aria-label={`Lihat foto ${index + 1} ${title}`}
          >
            <img
              src={index === 0 ? photo.src : photo.thumb}
              alt={`${title} — sudut ${index + 1}`}
              loading={index === 0 ? "eager" : "lazy"}
              width="900"
              height="600"
            />
            {index === visiblePhotos.length - 1 && (
              <span className="all-photos">
                <Grid2X2 size={16} /> Lihat {photos.length} foto
              </span>
            )}
          </button>
        ))}
      </div>
      <button
        className="mobile-photos-button button button-outline"
        onClick={() => onOpen(0)}
      >
        <Grid2X2 size={16} /> Lihat semua {photos.length} foto
      </button>
    </>
  );
}

export function BookingCard({ title, price, capacity, type = "kamar" }) {
  const [params] = useSearchParams();
  const [checkin, setCheckin] = useState(validDate(params.get("check_in")));
  const [checkout, setCheckout] = useState(validDate(params.get("check_out")));
  const [guests, setGuests] = useState(params.get("tamu") || "");
  const today = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Jakarta",
  }).format(new Date());
  const message = `Halo Villa Bukit Bunga, saya ingin menanyakan ketersediaan ${title}.${checkin ? `\nCheck-in: ${checkin}` : ""}${checkout ? `\nCheck-out: ${checkout}` : ""}${guests ? `\nJumlah tamu: ${guests} orang` : ""}\nHarga yang tertera: Rp${rupiah(price)} per malam. Terima kasih.`;
  const openReservation = (event) => {
    event.preventDefault();
    window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
  };
  return (
    <aside className="booking-card">
      <span className="eyebrow">RENCANAKAN KUNJUNGANMU</span>
      <span className="booking-selected">Pilihanmu: {title}</span>
      <div className="booking-price">
        Rp{rupiah(price)}
        <span>/ malam</span>
      </div>
      <p>
        {type === "paket"
          ? "Harga untuk satu paket menginap"
          : type === "aula"
            ? "Harga sewa aula satuan, per malam"
            : "Harga per kamar, per malam"}
      </p>
      {capacity && (
        <div className="booking-capacity">
          <Users size={18} /> Kapasitas {capacity} orang
        </div>
      )}
      <form onSubmit={openReservation}>
        <div className="booking-dates">
          <label>
            Check-in <span>(opsional)</span>
            <input
              type="date"
              min={today}
              value={checkin}
              onChange={(event) => {
                setCheckin(event.target.value);
                if (checkout && checkout <= event.target.value) setCheckout("");
              }}
            />
          </label>
          <label>
            Check-out <span>(opsional)</span>
            <input
              type="date"
              min={checkin ? nextDay(checkin) : today}
              value={checkout}
              onChange={(event) => setCheckout(event.target.value)}
            />
          </label>
        </div>
        <label className="booking-guests">
          Jumlah tamu <span>(opsional)</span>
          <input
            type="number"
            min="1"
            max={capacity ? Number(capacity.split("–")[1]) : undefined}
            placeholder="Jumlah orang yang menginap"
            value={guests}
            onChange={(event) => setGuests(event.target.value)}
          />
        </label>
        <button className="button full-width" type="submit">
          <MessageCircle size={18} /> Reservasi via WhatsApp{" "}
          <ArrowUpRight size={16} />
        </button>
      </form>
      <span className="booking-note">
        Terhubung langsung dengan pengelola via WhatsApp. Ketersediaan dan
        reservasi dikonfirmasi oleh pengelola.
      </span>
      <a className="phone-link" href={`tel:+${villa.whatsapp}`}>
        <Phone size={14} /> {villa.phone}
      </a>
    </aside>
  );
}

function nextDay(date) {
  const day = new Date(`${date}T12:00:00Z`);
  day.setUTCDate(day.getUTCDate() + 1);
  return day.toISOString().slice(0, 10);
}

function validDate(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
    ? value
    : "";
}

export function reservationQuery(params) {
  const query = new URLSearchParams();
  for (const key of ["check_in", "check_out", "tamu"])
    if (params.get(key)) query.set(key, params.get(key));
  return query.toString();
}

export function ContactBanner() {
  return (
    <section className="contact-banner container">
      <div className="banner-flower" aria-hidden="true">
        <Flower2 />
      </div>
      <div>
        <span className="eyebrow">VILLA KELUARGA & ROMBONGAN DI PACET</span>
        <h2>Punya Rencana Acara di Pacet?</h2>
        <p>
          Ceritakan rencana acaramu. Kami bantu temukan kamar dan paket yang
          sesuai.
        </p>
      </div>
      <a
        className="button button-cream"
        href={whatsappUrl()}
        target="_blank"
        rel="noreferrer"
      >
        <MessageCircle size={18} /> Hubungi via WhatsApp{" "}
        <ArrowUpRight size={16} />
      </a>
    </section>
  );
}

export function EmptyState({ title, text, reset }) {
  return (
    <div className="empty-state">
      <Flower2 size={36} />
      <h3>{title}</h3>
      <p>{text}</p>
      <button className="button button-outline" onClick={reset}>
        Tampilkan semua paket <ArrowRight size={16} />
      </button>
    </div>
  );
}
