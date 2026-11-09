import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Download,
  Info,
  Users,
  X,
} from "lucide-react";
import {
  BookingCard,
  Breadcrumbs,
  ContactBanner,
  EmptyState,
  Lightbox,
  PackageCard,
  RoomCard,
  SectionIntro,
} from "../components/Shared";
import {
  diningRoom,
  hall,
  images,
  packages,
  pool,
  rooms,
  rupiah,
} from "../data";
import { NotFound } from "../App";

export default function Packages() {
  const [params, setParams] = useSearchParams();
  const group = params.get("grup") || "semua";
  const guests = params.get("tamu") || "";
  const sort = params.get("urut") || "nomor";
  const maxPrice = params.get("max_price") || "";
  const minRooms = params.get("min_kamar") || "";
  useEffect(() => {
    document.title = "9 Paket Menginap — Villa Bukit Bunga";
  }, []);
  const setFilter = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value || value === "semua" || value === "nomor") next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true, preventScrollReset: true });
  };
  const filtered = packages
    .filter((pkg) => {
      const matchesGroup =
        group === "semua" ||
        (group === "kecil" && pkg.max <= 40) ||
        (group === "sedang" && pkg.max > 40 && pkg.max <= 65) ||
        (group === "besar" && pkg.max > 65);
      return (
        matchesGroup &&
        (!guests || (Number(guests) >= pkg.min && Number(guests) <= pkg.max)) &&
        (!maxPrice || pkg.price <= Number(maxPrice)) &&
        (!minRooms ||
          pkg.rooms.reduce((sum, room) => sum + room.quantity, 0) >=
            Number(minRooms))
      );
    })
    .sort((a, b) =>
      sort === "harga-naik"
        ? a.price - b.price
        : sort === "harga-turun"
          ? b.price - a.price
          : a.id - b.id,
    );
  const isFiltered = group !== "semua" || !!guests || !!maxPrice || !!minRooms;
  return (
    <>
      <section className="page-heading package-page-heading">
        <div className="container">
          <Breadcrumbs items={[{ label: "Paket Menginap" }]} />
          <div className="page-heading-row">
            <div>
              <span className="eyebrow">PAKET SESUAI KEBUTUHANMU</span>
              <h1>
                Daftar Paket Villa
                <br />
                <em>Keluarga & Rombongan</em>
              </h1>
            </div>
            <div>
              <p>
                Mulai dari paket keluarga Rp500.000 hingga paket rombongan untuk
                125 orang.
              </p>
              <a
                className="text-link"
                href="/villa-bukit-bunga-flyer.pdf"
                target="_blank"
                rel="noreferrer"
              >
                <Download size={16} /> Lihat brosur lengkap
              </a>
            </div>
          </div>
          <div className="catalog-stats">
            <span>
              <strong>9</strong>Pilihan Paket
            </span>
            <span>
              <strong>10–125</strong>Kapasitas Tamu
            </span>
            <span>
              <strong>4</strong>Tipe Kamar
            </span>
          </div>
        </div>
      </section>
      <section className="container packages-catalog">
        <div className="catalog-toolbar">
          <div
            className="filter-tabs"
            role="group"
            aria-label="Filter ukuran rombongan"
          >
            {[
              ["semua", "Semua paket"],
              ["kecil", "Hingga 40 orang"],
              ["sedang", "41–65 orang"],
              ["besar", "66–125 orang"],
            ].map(([value, label]) => (
              <button
                key={value}
                className={group === value ? "selected" : ""}
                aria-pressed={group === value}
                onClick={() => setFilter("grup", value)}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="sort-control">
            Urutkan{" "}
            <select
              value={sort}
              onChange={(e) => setFilter("urut", e.target.value)}
            >
              <option value="nomor">Nomor paket</option>
              <option value="harga-naik">Harga terendah</option>
              <option value="harga-turun">Harga tertinggi</option>
            </select>
          </label>
        </div>
        <div className="catalog-subbar">
          <span>
            {filtered.length} paket untuk dipilih
            {maxPrice && <> · Maks. Rp{rupiah(Number(maxPrice))}</>}
            {minRooms && <> · Min. {minRooms} kamar</>}
          </span>
          <div className="guest-filter">
            <label htmlFor="guest-count">
              <Users size={16} /> Jumlah tamu
            </label>
            <input
              id="guest-count"
              type="number"
              min="1"
              max="125"
              placeholder="Mis. 35"
              value={guests}
              onChange={(e) => setFilter("tamu", e.target.value)}
            />
            {isFiltered && (
              <button
                className="clear-filter"
                onClick={() => setParams({})}
                aria-label="Hapus filter"
              >
                <X size={14} /> Reset
              </button>
            )}
          </div>
        </div>
        {filtered.length ? (
          <div className="package-grid">
            {filtered.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Belum ada paket yang sesuai"
            text="Coba ubah jumlah tamu atau ukuran rombongan. Pengelola juga bisa membantu menyesuaikan rencanamu."
            reset={() => setParams({})}
          />
        )}
        <div className="catalog-note">
          <Info size={20} />
          <p>
            Harga, kapasitas, dan isi paket mengacu pada brosur Villa Bukit
            Bunga. Klik paket untuk melihat rincian kamar, fasilitas, dan
            pengaturan tidur. Ketersediaan dikonfirmasi langsung oleh pengelola.
          </p>
        </div>
      </section>
      <ContactBanner />
    </>
  );
}

export function PackageDetail() {
  const { id } = useParams();
  const pkg = packages.find(
    (item) => String(item.id) === id || item.slug === id,
  );
  const [photoIndex, setPhotoIndex] = useState(null);
  useEffect(() => {
    setPhotoIndex(null);
  }, [id]);
  useEffect(() => {
    if (pkg)
      document.title = `Paket ${pkg.id} · ${pkg.min}–${pkg.max} Orang — Villa Bukit Bunga`;
  }, [pkg]);
  if (!pkg) return <NotFound />;
  const includesHall = pkg.facilities.includes("Aula");
  const includesDining = pkg.facilities.includes("Ruang makan");
  const includesPool = pkg.facilities.includes("Kolam renang");
  const hasFacilityCards = includesHall || includesDining || includesPool;
  const gallery = (
    pkg.id === 1
      ? rooms.find((room) => room.id === "kamar-besar").photos
      : [
          pkg.cover,
          ...pkg.rooms.map(
            (entry) => rooms.find((room) => room.id === entry.id).cover,
          ),
          images.hall[0],
          images.dining_room[1],
          images.pool[1],
          images.villa_yard[9],
        ]
  ).filter(
    (photo, index, all) =>
      all.findIndex((item) => item.src === photo.src) === index,
  );
  return (
    <>
      <div className="container detail-page">
        <Breadcrumbs
          items={[
            { label: "Paket Menginap", to: "/paket" },
            { label: `Paket ${pkg.id}` },
          ]}
        />
        <div className="detail-heading">
          <div>
            <span className="eyebrow">
              KEBERSAMAAN, DIRENCANAKAN LEBIH MUDAH
            </span>
            <h1>
              Paket {pkg.id}
              <em className="heading-side-note">
                {" "}
                / untuk {pkg.min}–{pkg.max} orang
              </em>
            </h1>
          </div>
          <Link className="text-link" to="/paket">
            <ArrowLeft size={16} /> Semua paket
          </Link>
        </div>
        <div className="room-photo-grid package-photo-grid">
          {gallery.slice(0, 5).map((photo, index) => (
            <button
              key={photo.src}
              className={`room-photo photo-${index}`}
              onClick={() => setPhotoIndex(index)}
              aria-label={`Lihat foto ${index + 1} Paket ${pkg.id}`}
            >
              <img
                src={index === 0 ? photo.src : photo.thumb}
                alt={`Suasana Villa Bukit Bunga — foto ${index + 1}`}
                loading={index === 0 ? "eager" : "lazy"}
                width="900"
                height="600"
              />
              {index === 0 && (
                <span className="gallery-label">
                  Suasana villa · lihat fasilitas yang termasuk di bawah
                </span>
              )}
              {index === 4 && (
                <span className="all-photos">Lihat semua foto</span>
              )}
            </button>
          ))}
        </div>
        <button
          className="mobile-photos-button button button-outline"
          onClick={() => setPhotoIndex(0)}
        >
          Lihat foto suasana villa <ArrowUpRight size={15} />
        </button>
        <div className="detail-layout">
          <div className="detail-content">
            <section>
              <span className="eyebrow">YANG KAMU DAPATKAN</span>
              <h2>
                {hasFacilityCards
                  ? "Kamar & fasilitas dalam paket ini."
                  : "Kamar dalam paket ini."}
              </h2>
              <p className="section-description">
                {hasFacilityCards
                  ? "Klik kartu kamar atau fasilitas untuk melihat foto dan mengenal ruang yang kamu dapatkan."
                  : "Klik pilihan kamar untuk melihat foto dan mengenal ruang menginapmu."}
              </p>
              <div className="included-room-grid">
                {pkg.rooms.map((entry) => (
                  <RoomCard
                    key={entry.id}
                    room={rooms.find((room) => room.id === entry.id)}
                    quantity={entry.quantity}
                    packageId={pkg.id}
                  />
                ))}
                {includesHall && (
                  <RoomCard room={hall} quantity={1} packageId={pkg.id} />
                )}
                {includesDining && (
                  <RoomCard room={diningRoom} quantity={1} packageId={pkg.id} />
                )}
                {includesPool && (
                  <RoomCard room={pool} quantity={1} packageId={pkg.id} />
                )}
              </div>
              {pkg.sleep && (
                <div className="sleep-note">
                  <Info size={18} />
                  <span>{pkg.sleep}</span>
                </div>
              )}
            </section>
            <section className="included-facilities">
              <span className="eyebrow">FASILITAS PAKET</span>
              <h2>
                {pkg.facilities.length
                  ? "Lengkap untuk berkumpul."
                  : "Tentang fasilitas paket."}
              </h2>
              {pkg.facilities.length ? (
                <ul className="check-list">
                  {pkg.facilities.map((facility) => (
                    <li key={facility}>
                      <Check size={17} />
                      {facility}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="sleep-note">
                  <Info size={18} />
                  <span>{pkg.note}</span>
                </div>
              )}
              {pkg.facilities.length > 0 && (
                <Link className="text-link" to="/#fasilitas">
                  Lihat foto fasilitas villa <ArrowUpRight size={16} />
                </Link>
              )}
            </section>
            <section className="things-to-know">
              <h3>Sebelum merencanakan kunjungan</h3>
              <p>
                Harga Rp{rupiah(pkg.price)} berlaku untuk satu paket per malam.
                Konfirmasikan tanggal, jumlah tamu, pembagian tempat tidur,
                serta waktu check-in dan check-out kepada pengelola saat
                reservasi.
              </p>
              <a
                className="text-link"
                href="/villa-bukit-bunga-flyer.pdf"
                target="_blank"
                rel="noreferrer"
              >
                <Download size={16} /> Lihat informasi pada brosur
              </a>
            </section>
          </div>
          <BookingCard
            key={pkg.id}
            title={`Paket ${pkg.id}`}
            price={pkg.price}
            capacity={`${pkg.min}–${pkg.max}`}
            type="paket"
          />
        </div>
        <section className="other-packages">
          <SectionIntro
            eyebrow="MASIH INGIN MEMBANDINGKAN?"
            title="Pilihan paket lainnya."
          >
            <Link className="text-link" to="/paket">
              Semua paket <ArrowUpRight size={17} />
            </Link>
          </SectionIntro>
          <div className="package-grid">
            {packages
              .filter((item) => item.id !== pkg.id)
              .sort((a, b) => Math.abs(a.id - pkg.id) - Math.abs(b.id - pkg.id))
              .slice(0, 3)
              .map((item) => (
                <PackageCard key={item.id} pkg={item} />
              ))}
          </div>
        </section>
      </div>
      <ContactBanner />
      {photoIndex !== null && (
        <Lightbox
          photos={gallery}
          initialIndex={photoIndex}
          title={`Suasana villa — Paket ${pkg.id}`}
          onClose={() => setPhotoIndex(null)}
        />
      )}
    </>
  );
}
