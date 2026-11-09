import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Presentation,
  Users,
  Wifi,
} from "lucide-react";
import {
  BookingCard,
  Breadcrumbs,
  ContactBanner,
  Lightbox,
  PackageCard,
  PhotoGallery,
  SectionIntro,
  reservationQuery,
} from "../components/Shared";
import { hall, packages, rupiah } from "../data";

export default function Hall() {
  const [params] = useSearchParams();
  const [photoIndex, setPhotoIndex] = useState(null);
  const pkg = packages.find(
    (item) =>
      String(item.id) === params.get("paket") &&
      item.facilities.includes("Aula"),
  );
  const query = reservationQuery(params);
  const standalonePath = `/aula${query ? `?${query}` : ""}`;
  const returnPath = pkg
    ? `/paket/${pkg.slug}${query ? `?${query}` : ""}`
    : "/#fasilitas";
  const gallery = [
    hall.cover,
    ...hall.photos.filter((photo) => photo.src !== hall.cover.src),
  ];
  const relatedPackages = packages
    .filter((item) => item.facilities.includes("Aula"))
    .slice(0, 3);
  const breadcrumbs = pkg
    ? [
        { label: "Paket Menginap", to: "/paket" },
        { label: `Paket ${pkg.id}`, to: returnPath },
        { label: "Aula" },
      ]
    : [{ label: "Aula" }];

  useEffect(() => {
    document.title = `Aula · Rp${rupiah(hall.price)}/Malam — Villa Bukit Bunga`;
  }, []);
  useEffect(() => {
    setPhotoIndex(null);
  }, [pkg?.id]);

  return (
    <>
      <div className="container detail-page">
        <Breadcrumbs items={breadcrumbs} />
        <div className="detail-heading">
          <div>
            <span className="eyebrow">{hall.label}</span>
            <h1>Aula</h1>
          </div>
          <Link className="text-link" to={returnPath}>
            <ArrowLeft size={16} />
            {pkg ? `Kembali ke Paket ${pkg.id}` : "Lihat fasilitas villa"}
          </Link>
        </div>
        {pkg && (
          <div className="package-context">
            <Presentation size={19} />
            <span>
              <strong>Aula</strong> termasuk dalam Paket {pkg.id}
            </span>
            <Link to={returnPath}>
              Lihat paket <ArrowRight size={16} />
            </Link>
          </div>
        )}
        <PhotoGallery photos={gallery} title="Aula" onOpen={setPhotoIndex} />
        <div className="detail-layout">
          <div className="detail-content">
            <section>
              <span className="eyebrow">KENALI RUANG ACARAMU</span>
              <h2>{hall.label}.</h2>
              <p className="room-description">{hall.description}</p>
              {pkg && (
                <div className="room-unit-price">
                  <span>Harga sewa aula satuan</span>
                  <strong>
                    Rp{rupiah(hall.price)} <small>/ malam</small>
                  </strong>
                  <Link
                    className="text-link hall-standalone-link"
                    to={standalonePath}
                  >
                    Reservasi aula satuan <ArrowUpRight size={15} />
                  </Link>
                </div>
              )}
              <ul className="room-feature-list">
                {hall.features.map((feature, index) => {
                  const Icon = [Presentation, Users, Wifi][index];
                  return (
                    <li key={feature}>
                      <Icon size={22} />
                      {feature}
                    </li>
                  );
                })}
              </ul>
              <button className="text-link" onClick={() => setPhotoIndex(0)}>
                Jelajahi seluruh foto aula <ArrowUpRight size={17} />
              </button>
            </section>
            {pkg && (
              <section className="things-to-know">
                <h3>Aula ini bagian dari Paket {pkg.id}</h3>
                <p>
                  Penggunaan aula sudah termasuk dalam harga Paket {pkg.id}{" "}
                  sebesar Rp{rupiah(pkg.price)} per malam. Sound system serta
                  meja dan kursi rapat juga tercantum dalam fasilitas paket.
                  Harga sewa aula satuan ditampilkan terpisah untuk pilihan di
                  luar paket.
                </p>
                <Link className="text-link" to={returnPath}>
                  Kembali ke rincian paket <ArrowRight size={17} />
                </Link>
              </section>
            )}
            <section className="things-to-know">
              <h3>Rencanakan acara bersama pengelola</h3>
              <p>
                Untuk sewa aula satuan, konfirmasikan jadwal, jumlah peserta,
                durasi penggunaan, serta kebutuhan sound system dan meja kursi
                rapat langsung dengan pengelola melalui WhatsApp.
              </p>
            </section>
          </div>
          <BookingCard
            key={pkg?.id || "aula-satuan"}
            title={pkg ? `Paket ${pkg.id}` : "Aula"}
            price={pkg ? pkg.price : hall.price}
            capacity={pkg ? `${pkg.min}–${pkg.max}` : undefined}
            type={pkg ? "paket" : "aula"}
          />
        </div>
        <section className="other-packages">
          <SectionIntro
            eyebrow="RENCANAKAN ACARA & MENGINAP BERSAMA"
            title="Aula termasuk dalam paket berikut."
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
      </div>
      <ContactBanner />
      {photoIndex !== null && (
        <Lightbox
          title="Aula"
          photos={gallery}
          initialIndex={photoIndex}
          onClose={() => setPhotoIndex(null)}
        />
      )}
    </>
  );
}
