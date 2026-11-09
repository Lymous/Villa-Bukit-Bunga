import images from "./image-manifest.json";
import videos from "./video-manifest.json";

export const villa = {
  name: "Villa Bukit Bunga",
  phone: "0858 0840 8835",
  whatsapp: "6285808408835",
  address: "Jln. Air Panas KM. 2, Gapuk, Made, Pacet, Mojokerto",
  maps: "https://maps.app.goo.gl/NKuxipnTqgjS1ypW7",
};

export const rupiah = (value) => new Intl.NumberFormat("id-ID").format(value);
export const whatsappUrl = (
  message = "Halo Villa Bukit Bunga, saya ingin menanyakan ketersediaan kamar dan paket menginap.",
) => `https://wa.me/${villa.whatsapp}?text=${encodeURIComponent(message)}`;

// Harga kamar mengikuti permintaan pemilik. Harga dan komposisi paket mengikuti PDF.
export const rooms = [
  {
    id: "standart",
    name: "Standart",
    price: 125000,
    label: "Sederhana, tetap nyaman",
    description:
      "Ruang istirahat yang pas setelah seharian menikmati kebersamaan. Pilihan sederhana untuk liburan keluarga maupun perjalanan bersama teman.",
    folder: "standart",
    coverIndex: 3,
    features: ["Tempat tidur", "Kamar mandi dalam", "Akses Wi-Fi villa"],
  },
  {
    id: "duluxe",
    name: "Duluxe",
    price: 250000,
    label: "Lebih leluasa untuk beristirahat",
    description:
      "Nikmati waktu santai di kamar Duluxe. Lihat berbagai sudut kamar dan pilih suasana menginap yang paling sesuai untuk perjalananmu.",
    folder: "duluxe",
    coverIndex: 20,
    features: ["Tempat tidur", "Kamar mandi dalam", "Akses Wi-Fi villa"],
  },
  {
    id: "private",
    name: "Private",
    price: 500000,
    label: "Momen menginap lebih personal",
    description:
      "Pilihan kamar untuk menikmati waktu bersama orang terdekat. Jelajahi foto interior, tempat tidur, dan sudut kamar sebelum merencanakan kunjungan.",
    folder: "private",
    coverIndex: 3,
    video: videos.private,
    features: ["Tempat tidur", "Kamar mandi dalam", "Akses Wi-Fi villa"],
  },
  {
    id: "kamar-besar",
    name: "Kamar Besar",
    price: 500000,
    label: "Satu ruang, banyak cerita",
    description:
      "Ruang menginap bersama untuk keluarga besar atau rombongan kecil. Kamar Besar juga tersedia dalam Paket 1 untuk 10–18 orang, tanpa aula.",
    folder: "big_room",
    coverIndex: 0,
    features: ["Ruang tidur bersama", "Kamar mandi dalam", "Akses Wi-Fi villa"],
  },
].map((room) => ({
  ...room,
  photos: images[room.folder],
  cover: images[room.folder][room.coverIndex],
}));

const sharedFacilities = [
  "Aula",
  "Sound system",
  "Meja & kursi rapat",
  "Ruang makan",
  "Dapur",
  "Kolam renang",
  "Wi-Fi",
  "Area parkir",
  "3 kamar mandi luar",
];

export const hall = {
  id: "aula",
  kind: "hall",
  name: "Aula",
  price: 500000,
  label: "Ruang berkumpul untuk setiap acara",
  description:
    "Ruang untuk pertemuan keluarga, kegiatan sekolah, kampus, dan acara rombongan. Kenali suasana aula melalui foto-foto asli sebelum merencanakan kegiatanmu.",
  features: ["Ruang pertemuan", "Kegiatan rombongan", "Akses Wi-Fi villa"],
  photos: images.hall,
  cover: images.hall[0],
};

export const diningRoom = {
  id: "ruang-makan",
  kind: "dining",
  packageFacility: "Ruang makan",
  name: "Ruang Makan",
  label: "Waktu makan, waktu bersama",
  description:
    "Ruang untuk menikmati waktu makan dan berkumpul bersama keluarga atau rombongan. Lihat suasana dan sudut-sudut ruang makan melalui foto-foto asli villa.",
  features: ["Ruang makan bersama", "Area duduk", "Acara rombongan"],
  photos: images.dining_room,
  cover: images.dining_room[1],
};

export const pool = {
  id: "kolam-renang",
  kind: "pool",
  packageFacility: "Kolam renang",
  name: "Kolam Renang",
  label: "Segarkan waktu bersama",
  description:
    "Nikmati suasana kolam renang di Villa Bukit Bunga bersama keluarga dan rombongan. Jelajahi foto-foto asli kolam sebelum merencanakan kunjunganmu.",
  features: ["Kolam renang", "Suasana villa", "Liburan bersama"],
  photos: images.pool,
  cover: images.pool[0],
};

export const packages = [
  {
    id: 1,
    price: 500000,
    min: 10,
    max: 18,
    rooms: [{ id: "kamar-besar", quantity: 1 }],
    facilities: [],
    note: "Paket ini tidak termasuk aula. Fasilitas lain dapat dikonfirmasi saat reservasi.",
    sleep: "Menginap bersama dalam 1 kamar besar.",
    cover: rooms[3].cover,
    tag: "Rombongan kecil",
  },
  {
    id: 2,
    price: 1250000,
    min: 25,
    max: 40,
    rooms: [{ id: "standart", quantity: 4 }],
    sleep: "Sebagian tamu tidur di aula.",
    cover: images.villa_yard[1],
  },
  {
    id: 3,
    price: 1400000,
    min: 25,
    max: 50,
    rooms: [{ id: "standart", quantity: 5 }],
    sleep: "Sebagian tamu tidur di aula.",
    cover: images.standart[0],
  },
  {
    id: 4,
    price: 1600000,
    min: 25,
    max: 40,
    rooms: [{ id: "duluxe", quantity: 4 }],
    sleep: "Sebagian tamu tidur di aula.",
    cover: images.duluxe[2],
  },
  {
    id: 5,
    price: 1850000,
    min: 25,
    max: 40,
    rooms: [{ id: "duluxe", quantity: 5 }],
    cover: rooms[1].cover,
  },
  {
    id: 6,
    price: 2250000,
    min: 40,
    max: 60,
    rooms: [
      { id: "standart", quantity: 5 },
      { id: "duluxe", quantity: 5 },
    ],
    sleep: "Semua tamu bisa tidur di kamar.",
    cover: images.villa_yard[9],
    tag: "Untuk kebersamaan",
  },
  {
    id: 7,
    price: 2750000,
    min: 50,
    max: 65,
    rooms: [
      { id: "standart", quantity: 5 },
      { id: "duluxe", quantity: 5 },
      { id: "kamar-besar", quantity: 1 },
    ],
    sleep: "Semua tamu bisa tidur di kamar.",
    cover: images.villa_yard[8],
  },
  {
    id: 8,
    price: 3250000,
    min: 50,
    max: 75,
    rooms: [
      { id: "standart", quantity: 5 },
      { id: "duluxe", quantity: 8 },
    ],
    cover: images.hall[0],
  },
  {
    id: 9,
    price: 3750000,
    min: 75,
    max: 125,
    rooms: [
      { id: "standart", quantity: 5 },
      { id: "duluxe", quantity: 8 },
      { id: "kamar-besar", quantity: 1 },
    ],
    cover: images.pool[1],
    tag: "Rombongan besar",
  },
].map((pkg, index) => ({
  facilities: sharedFacilities,
  title: [
    "Family Retreat",
    "Gathering Mini",
    "Gathering Family Plus",
    "Deluxe Comfort",
    "Deluxe Premium",
    "Big Group Harmony",
    "Grand Summit",
    "Corporate Exclusives",
    "Full Villa Royalty",
  ][index],
  slug: [
    "paket-1-family-retreat",
    "paket-2-gathering-mini",
    "paket-3-gathering-family-plus",
    "paket-4-deluxe-comfort",
    "paket-5-deluxe-premium",
    "paket-6-big-group-harmony",
    "paket-7-grand-summit",
    "paket-8-corporate-exclusives",
    "paket-9-full-villa-royalty",
  ][index],
  ...pkg,
}));

export const facilities = [
  {
    id: "kolam",
    name: pool.name,
    icon: "Waves",
    description: "Segarkan hari dengan berenang bersama.",
    photos: pool.photos,
    cover: pool.cover,
  },
  {
    id: "aula",
    name: "Aula pertemuan",
    icon: "Presentation",
    description: "Ruang berkumpul untuk beragam acara.",
    photos: images.hall,
    cover: images.hall[0],
  },
  {
    id: "ruang-makan",
    name: diningRoom.name,
    icon: "Utensils",
    description: "Obrolan hangat di sela waktu makan.",
    photos: diningRoom.photos,
    cover: diningRoom.cover,
  },
  {
    id: "halaman",
    name: "Halaman Villa",
    icon: "Trees",
    description: "Ruang terbuka untuk menikmati suasana.",
    photos: images.villa_yard,
    cover: images.villa_yard[9],
    video: videos.yard,
  },
];

export { images };
