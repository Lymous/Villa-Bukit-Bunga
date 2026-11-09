import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  MessageCircle,
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
import { packages, rupiah, whatsappUrl } from "../data";

export default function FacilityDetail({ facility, featureIcons }) {
  const [params] = useSearchParams();
  const [photoIndex, setPhotoIndex] = useState(null);
  const pkg = packages.find(
    (item) =>
      String(item.id) === params.get("paket") &&
      item.facilities.includes(facility.packageFacility),
  );
  const subject = facility.name.toLocaleLowerCase("id-ID");
  const FacilityIcon = featureIcons[0];
  const query = reservationQuery(params);
  const returnPath = pkg
    ? `/paket/${pkg.slug}${query ? `?${query}` : ""}`
    : "/#fasilitas";
  const gallery = [
    facility.cover,
    ...facility.photos.filter((photo) => photo.src !== facility.cover.src),
  ];
  const relatedPackages = packages
    .filter((item) => item.facilities.includes(facility.packageFacility))
    .slice(0, 3);
  const breadcrumbs = pkg
    ? [
        { label: "Paket Menginap", to: "/paket" },
        { label: `Paket ${pkg.id}`, to: returnPath },
        { label: facility.name },
      ]
    : [{ label: facility.name }];

  useEffect(() => {
    document.title = `${facility.name} — Villa Bukit Bunga`;
  }, [facility.name]);
  useEffect(() => {
    setPhotoIndex(null);
  }, [pkg?.id, facility.id]);

  return (
    <>
      <div className="container detail-page">
        <Breadcrumbs items={breadcrumbs} />
        <div className="detail-heading">
          <div>
            <span className="eyebrow">{facility.label}</span>
            <h1>{facility.name}</h1>
          </div>
          <Link className="text-link" to={returnPath}>
            <ArrowLeft size={16} />
            {pkg ? `Kembali ke Paket ${pkg.id}` : "Lihat fasilitas villa"}
          </Link>
        </div>
        {pkg && (
          <div className="package-context">
            <FacilityIcon size={19} />
            <span>
              <strong>{facility.name}</strong> termasuk dalam Paket {pkg.id}
            </span>
            <Link to={returnPath}>
              Lihat paket <ArrowRight size={16} />
            </Link>
          </div>
        )}
        <PhotoGallery
          photos={gallery}
          title={facility.name}
          onOpen={setPhotoIndex}
        />
        <div className="detail-layout">
          <div className="detail-content">
            <section>
              <span className="eyebrow">KENALI FASILITAS VILLA</span>
              <h2>{facility.label}.</h2>
              <p className="room-description">{facility.description}</p>
              <ul className="room-feature-list">
                {facility.features.map((feature, index) => {
                  const Icon = featureIcons[index];
                  return (
                    <li key={feature}>
                      <Icon size={22} />
                      {feature}
                    </li>
                  );
                })}
              </ul>
              <button className="text-link" onClick={() => setPhotoIndex(0)}>
                Jelajahi seluruh foto {subject} <ArrowUpRight size={17} />
              </button>
            </section>
            {pkg && (
              <section className="things-to-know">
                <h3>
                  {facility.name} ini bagian dari Paket {pkg.id}
                </h3>
                <p>
                  Penggunaan {subject} sudah termasuk dalam harga Paket {pkg.id}{" "}
                  sebesar Rp{rupiah(pkg.price)} per malam.
                </p>
                <Link className="text-link" to={returnPath}>
                  Kembali ke rincian paket <ArrowRight size={17} />
                </Link>
              </section>
            )}
            <section className="things-to-know">
              <h3>Rencanakan kegiatan bersama pengelola</h3>
              <p>
                Konfirmasikan jadwal kegiatan, jumlah peserta, dan ketentuan
                penggunaan {subject} langsung dengan pengelola melalui WhatsApp.
              </p>
            </section>
          </div>
          {pkg ? (
            <BookingCard
              key={pkg.id}
              title={`Paket ${pkg.id}`}
              price={pkg.price}
              capacity={`${pkg.min}–${pkg.max}`}
              type="paket"
            />
          ) : (
            <aside className="booking-card">
              <span className="eyebrow">FASILITAS DALAM PAKET MENGINAP</span>
              <span className="booking-selected">{facility.name}</span>
              <p>
                {facility.name} termasuk dalam Paket 2–9. Jelajahi pilihan paket
                dan hubungi pengelola untuk merencanakan kunjunganmu.
              </p>
              <Link
                className="button full-width facility-package-link"
                to="/paket"
              >
                Lihat pilihan paket <ArrowRight size={16} />
              </Link>
              <a
                className="text-link facility-contact-link"
                href={whatsappUrl(
                  `Halo Villa Bukit Bunga, saya ingin menanyakan fasilitas ${subject} dan paket menginap untuk rombongan.`,
                )}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={16} /> Tanya via WhatsApp{" "}
                <ArrowUpRight size={15} />
              </a>
            </aside>
          )}
        </div>
        <section className="other-packages">
          <SectionIntro
            eyebrow="NIKMATI FASILITAS BERSAMA ROMBONGAN"
            title={`${facility.name} termasuk dalam paket berikut.`}
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
          title={facility.name}
          photos={gallery}
          initialIndex={photoIndex}
          onClose={() => setPhotoIndex(null)}
        />
      )}
    </>
  );
}
