import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bath,
  BedDouble,
  Info,
  Wifi,
} from "lucide-react";
import {
  BookingCard,
  Breadcrumbs,
  ContactBanner,
  Lightbox,
  PackageCard,
  PhotoGallery,
  RoomCard,
  SectionIntro,
  VideoPlayer,
  reservationQuery,
} from "../components/Shared";
import { packages, rooms, rupiah } from "../data";
import { NotFound } from "../App";

export default function Rooms() {
  useEffect(() => {
    document.title = "Pilihan Kamar — Villa Bukit Bunga";
  }, []);
  return (
    <>
      <section className="page-heading">
        <div className="container">
          <Breadcrumbs items={[{ label: "Kamar" }]} />
          <div className="page-heading-row">
            <div>
              <span className="eyebrow">SEBUAH RUANG UNTUK BERISTIRAHAT</span>
              <h1>
                Singgah sejenak.
                <br />
                <em>Nyaman bersama.</em>
              </h1>
            </div>
            <p>
              Empat tipe kamar, satu tujuan:
              <br />
              waktu istirahat yang berarti.
            </p>
          </div>
        </div>
      </section>
      <section className="container room-catalog">
        <div className="room-grid">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
        <div className="catalog-note">
          <Info size={20} />
          <p>
            Harga di atas adalah harga per kamar, per malam. Datang bersama
            rombongan? <Link to="/paket">Jelajahi paket menginap</Link> untuk
            melihat kombinasi kamar dan fasilitas.
          </p>
        </div>
      </section>
      <ContactBanner />
    </>
  );
}

export function RoomDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const room = rooms.find((item) => item.id === id);
  const pkg = packages.find(
    (item) =>
      String(item.id) === searchParams.get("paket") &&
      item.rooms.some((entry) => entry.id === id),
  );
  const [photoIndex, setPhotoIndex] = useState(null);
  useEffect(() => {
    if (room)
      document.title = `Kamar ${room.name} · Rp${rupiah(room.price)}/Malam — Villa Bukit Bunga`;
  }, [room]);
  useEffect(() => {
    setPhotoIndex(null);
  }, [id]);
  if (!room) return <NotFound />;
  const galleryPhotos = [
    room.cover,
    ...room.photos.filter((photo) => photo.src !== room.cover.src),
  ];
  const query = reservationQuery(searchParams);
  const returnToPackage = pkg
    ? `/paket/${pkg.slug}${query ? `?${query}` : ""}`
    : "/kamar";
  const relatedPackages = packages
    .filter((item) => item.rooms.some((entry) => entry.id === room.id))
    .slice(0, 3);
  const breadcrumbs = pkg
    ? [
        { label: "Paket Menginap", to: "/paket" },
        { label: `Paket ${pkg.id}`, to: returnToPackage },
        { label: room.name },
      ]
    : [{ label: "Kamar", to: "/kamar" }, { label: room.name }];
  return (
    <>
      <div className="container detail-page">
        <Breadcrumbs items={breadcrumbs} />
        <div className="detail-heading">
          <div>
            <span className="eyebrow">{room.label}</span>
            <h1>{room.name}</h1>
          </div>
          <Link className="text-link" to={returnToPackage}>
            <ArrowLeft size={16} />{" "}
            {pkg ? `Kembali ke Paket ${pkg.id}` : "Semua kamar"}
          </Link>
        </div>
        {pkg && (
          <div className="package-context">
            <BedDouble size={19} />
            <span>
              <strong>
                {pkg.rooms.find((entry) => entry.id === id).quantity} ×{" "}
                {room.name}
              </strong>{" "}
              termasuk dalam Paket {pkg.id}
            </span>
            <Link to={returnToPackage}>
              Lihat paket <ArrowRight size={16} />
            </Link>
          </div>
        )}
        <PhotoGallery
          photos={galleryPhotos}
          title={`kamar ${room.name}`}
          onOpen={setPhotoIndex}
        />
        <div className="detail-layout">
          <div className="detail-content">
            <section>
              <span className="eyebrow">KENALI KAMARMU</span>
              <h2>{room.label}.</h2>
              <p className="room-description">{room.description}</p>
              {pkg && (
                <div className="room-unit-price">
                  <span>Harga kamar satuan</span>
                  <strong>
                    Rp{rupiah(room.price)} <small>/ kamar / malam</small>
                  </strong>
                </div>
              )}
              <ul className="room-feature-list">
                {room.features.map((feature, i) => {
                  const Icon = [BedDouble, Bath, Wifi][i];
                  return (
                    <li key={feature}>
                      <Icon size={22} />
                      {feature}
                    </li>
                  );
                })}
              </ul>
              <button className="text-link" onClick={() => setPhotoIndex(0)}>
                Jelajahi seluruh foto kamar <ArrowUpRight size={17} />
              </button>
            </section>
            {room.video && (
              <section className="room-video-section" id="video-private">
                <span className="eyebrow">KENALI LEBIH DEKAT</span>
                <h2>Video {room.name}</h2>
                <p className="section-description">
                  Lihat suasana {room.name} melalui video villa.
                </p>
                <VideoPlayer video={room.video} title={`Kamar ${room.name}`} />
              </section>
            )}
            {pkg && (
              <section className="things-to-know">
                <h3>Kamar ini bagian dari Paket {pkg.id}</h3>
                <p>
                  Harga paket Rp{rupiah(pkg.price)} per malam untuk {pkg.min}–
                  {pkg.max} orang. Harga kamar satuan ditampilkan terpisah agar
                  kamu bisa membandingkan pilihan.
                </p>
                <Link className="text-link" to={returnToPackage}>
                  Kembali ke rincian paket <ArrowRight size={17} />
                </Link>
              </section>
            )}
            <section className="things-to-know">
              <h3>Rencanakan menginap dengan tenang</h3>
              <p>
                Galeri menampilkan foto-foto tipe kamar {room.name}. Penempatan
                dan unit kamar mengikuti ketersediaan. Konfirmasikan jumlah
                tamu, kebutuhan tempat tidur, serta waktu check-in dan check-out
                kepada pengelola.
              </p>
            </section>
          </div>
          <BookingCard
            key={`${id}-${pkg?.id || "satuan"}`}
            title={pkg ? `Paket ${pkg.id}` : `kamar ${room.name}`}
            price={pkg ? pkg.price : room.price}
            capacity={pkg ? `${pkg.min}–${pkg.max}` : undefined}
            type={pkg ? "paket" : "kamar"}
          />
        </div>
        {relatedPackages.length > 0 && (
          <section className="other-packages">
            <SectionIntro
              eyebrow="DATANG BERSAMA ROMBONGAN?"
              title="Kamar ini ada di paket berikut."
            >
              <Link className="text-link" to="/paket">
                Semua paket <ArrowUpRight size={17} />
              </Link>
            </SectionIntro>
            <div className="package-grid">
              {relatedPackages.map((item) => (
                <PackageCard key={item.id} pkg={item} />
              ))}
            </div>
          </section>
        )}
        <section className="other-packages">
          <SectionIntro
            eyebrow="KENALI PILIHAN LAINNYA"
            title="Ruang istirahat lainnya."
          />
          <div className="room-grid three-rooms">
            {rooms
              .filter((item) => item.id !== id)
              .map((item) => (
                <RoomCard key={item.id} room={item} />
              ))}
          </div>
        </section>
      </div>
      <ContactBanner />
      {photoIndex !== null && (
        <Lightbox
          key={room.id}
          title={`Kamar ${room.name}`}
          photos={galleryPhotos}
          initialIndex={photoIndex}
          onClose={() => setPhotoIndex(null)}
        />
      )}
    </>
  );
}
