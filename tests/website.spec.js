import { test, expect } from "@playwright/test";

test("shows the four requested room prices and no account or payment links", async ({
  page,
}) => {
  await page.goto("/kamar");
  const cards = page.locator(".room-catalog .room-card");
  await expect(cards).toHaveCount(4);
  for (const [name, price] of [
    ["Standart", "125.000"],
    ["Duluxe", "250.000"],
    ["Private", "500.000"],
    ["Kamar Besar", "500.000"],
  ]) {
    const card = cards.filter({
      has: page.getByRole("heading", { name, exact: true }),
    });
    await expect(card).toContainText(`Rp ${price}`);
    await expect(card).toContainText("/malam");
  }
  await expect(
    page.locator(
      'a[href*="login"],a[href*="admin"],a[href*="checkout"],a[href*="invoice"],a[href*="register"]',
    ),
  ).toHaveCount(0);
});

test("all nine packages match the flyer prices, capacities and room combinations", async ({
  page,
}) => {
  const flyer = [
    [1, "500.000", "10–18", [["Kamar Besar", 1]]],
    [2, "1.250.000", "25–40", [["Standart", 4]]],
    [3, "1.400.000", "25–50", [["Standart", 5]]],
    [4, "1.600.000", "25–40", [["Duluxe", 4]]],
    [5, "1.850.000", "25–40", [["Duluxe", 5]]],
    [
      6,
      "2.250.000",
      "40–60",
      [
        ["Standart", 5],
        ["Duluxe", 5],
      ],
    ],
    [
      7,
      "2.750.000",
      "50–65",
      [
        ["Standart", 5],
        ["Duluxe", 5],
        ["Kamar Besar", 1],
      ],
    ],
    [
      8,
      "3.250.000",
      "50–75",
      [
        ["Standart", 5],
        ["Duluxe", 8],
      ],
    ],
    [
      9,
      "3.750.000",
      "75–125",
      [
        ["Standart", 5],
        ["Duluxe", 8],
        ["Kamar Besar", 1],
      ],
    ],
  ];
  for (const [id, price, capacity, rooms] of flyer) {
    await page.goto(`/paket/${id}`);
    await expect(page.locator(".booking-price")).toContainText(`Rp${price}`);
    await expect(page.locator(".booking-capacity")).toContainText(capacity);
    const included = page.locator(
      ".included-room-grid .room-card:not(.facility-space-card)",
    );
    await expect(included).toHaveCount(rooms.length);
    for (const [name, quantity] of rooms) {
      const room = included.filter({
        has: page.getByRole("heading", { name, exact: true }),
      });
      await expect(room).toContainText(`${quantity} kamar termasuk`);
    }
    if (id === 1) {
      await expect(page.locator(".included-room-grid .pool-card")).toHaveCount(
        0,
      );
      await expect(
        page.locator(".included-room-grid .dining-card"),
      ).toHaveCount(0);
      await expect(page.locator(".included-room-grid .hall-card")).toHaveCount(
        0,
      );
      await expect(page.locator(".included-facilities")).toContainText(
        "tidak termasuk aula",
      );
      await expect(
        page.locator(".included-facilities .check-list"),
      ).toHaveCount(0);
    } else {
      const aula = page.locator(".included-room-grid .hall-card");
      await expect(aula).toHaveCount(1);
      await expect(aula).toContainText("Aula termasuk");
      await expect(aula).toHaveAttribute("href", `/aula?paket=${id}`);
      const dining = page.locator(".included-room-grid .dining-card");
      await expect(dining).toHaveCount(1);
      await expect(dining).toContainText("Ruang Makan termasuk");
      await expect(dining).toHaveAttribute("href", `/ruang-makan?paket=${id}`);
      const pool = page.locator(".included-room-grid .pool-card");
      await expect(pool).toHaveCount(1);
      await expect(pool).toContainText("Kolam Renang termasuk");
      await expect(pool).toHaveAttribute("href", `/kolam-renang?paket=${id}`);
      await expect(
        page.locator(".included-facilities .check-list li"),
      ).toHaveText([
        "Aula",
        "Sound system",
        "Meja & kursi rapat",
        "Ruang makan",
        "Dapur",
        "Kolam renang",
        "Wi-Fi",
        "Area parkir",
        "3 kamar mandi luar",
      ]);
    }
    if ([2, 3, 4].includes(id))
      await expect(page.locator(".detail-content")).toContainText(
        "Sebagian tamu tidur di aula",
      );
    if ([6, 7].includes(id))
      await expect(page.locator(".detail-content")).toContainText(
        "Semua tamu bisa tidur di kamar",
      );
  }
});

test("package → included room → photo gallery → return to package", async ({
  page,
}) => {
  await page.goto("/paket");
  await page
    .locator(".package-card")
    .filter({ has: page.getByRole("heading", { name: /Paket 1 —/ }) })
    .click();
  await expect(page).toHaveURL(/paket-1-family-retreat/);
  await page.locator(".included-room-grid .room-card").click();
  await expect(page).toHaveURL(/kamar\/kamar-besar\?paket=1/);
  await expect(page.locator(".package-context")).toContainText(
    "1 × Kamar Besar",
  );
  await expect(page.locator(".booking-selected")).toContainText("Paket 1");
  const opener = page.getByRole("button", {
    name: "Lihat foto 1 kamar Kamar Besar",
    exact: true,
  });
  await opener.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Foto 1 dari 8");
  await dialog
    .getByRole("button", { name: "Foto berikutnya", exact: true })
    .click();
  await expect(dialog).toContainText("Foto 2 dari 8");
  await page.keyboard.press("ArrowLeft");
  await expect(dialog).toContainText("Foto 1 dari 8");
  await dialog
    .getByRole("button", { name: "Tampilkan foto 5", exact: true })
    .click();
  await expect(dialog).toContainText("Foto 5 dari 8");
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
  await page
    .getByRole("link", { name: "Kembali ke Paket 1", exact: true })
    .click();
  await expect(page.locator("h1")).toContainText("Paket 1");
});

test("filters by guests and size, sorts price, and resets empty results", async ({
  page,
}) => {
  await page.goto("/paket");
  await expect(page.locator(".packages-catalog .package-card")).toHaveCount(9);
  await page.getByRole("button", { name: "66–125 orang", exact: true }).click();
  await expect(page.locator(".packages-catalog .package-card")).toHaveCount(2);
  await page.getByLabel("Urutkan").selectOption("harga-turun");
  await expect(
    page.locator(".packages-catalog .package-card").first(),
  ).toContainText("Paket 9");
  await page.getByLabel("Jumlah tamu", { exact: true }).fill("10");
  await expect(
    page.getByRole("heading", { name: "Belum ada paket yang sesuai" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Tampilkan semua paket" }).click();
  await expect(page.locator(".packages-catalog .package-card")).toHaveCount(9);
  await page.getByLabel("Jumlah tamu", { exact: true }).fill("35");
  await expect(page.locator(".packages-catalog .package-card")).toHaveCount(4);
});

test("included aula opens its gallery, retains package context, and can be reserved separately", async ({
  page,
}) => {
  const checkin = new Date(Date.now() + 30 * 86400000)
    .toISOString()
    .slice(0, 10);
  const checkout = new Date(Date.now() + 31 * 86400000)
    .toISOString()
    .slice(0, 10);
  await page.goto(`/paket/2?check_in=${checkin}&check_out=${checkout}&tamu=35`);
  await page.locator(".included-room-grid .hall-card").click();
  await expect(page).toHaveURL(/\/aula\?paket=2/);
  await expect(
    page.getByRole("heading", { name: "Aula", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".package-context")).toContainText(
    "Aula termasuk dalam Paket 2",
  );
  await expect(page.locator(".room-unit-price")).toContainText("Rp500.000");
  await expect(page.locator(".booking-price")).toContainText("Rp1.250.000");
  await expect(page.locator(".booking-selected")).toContainText("Paket 2");
  await expect(page.locator(".booking-dates input").first()).toHaveValue(
    checkin,
  );
  await expect(page.locator(".room-photo-grid img")).toHaveCount(3);
  await page
    .getByRole("button", { name: "Lihat foto 1 Aula", exact: true })
    .click();
  const gallery = page.getByRole("dialog", { name: "Galeri foto Aula" });
  await expect(gallery).toBeVisible();
  await expect(gallery).toContainText("Foto 1 dari 3");
  await gallery
    .getByRole("button", { name: "Foto berikutnya", exact: true })
    .click();
  await expect(gallery).toContainText("Foto 2 dari 3");
  await expect(gallery.locator(".lightbox-stage img")).toHaveAttribute(
    "src",
    "/images/hall-02.webp",
  );
  await gallery
    .getByRole("button", { name: "Tampilkan foto 3", exact: true })
    .click();
  await expect(gallery).toContainText("Foto 3 dari 3");
  await page.keyboard.press("Escape");
  await expect(gallery).toHaveCount(0);
  await page
    .getByRole("link", { name: "Kembali ke Paket 2", exact: true })
    .click();
  await expect(page.locator("h1")).toContainText("Paket 2");
  await page.locator(".included-room-grid .hall-card").click();
  await page
    .getByRole("link", { name: "Reservasi aula satuan", exact: true })
    .click();
  await expect(page.locator(".package-context")).toHaveCount(0);
  await expect(page.locator(".booking-price")).toContainText("Rp500.000");
  await expect(page.locator(".booking-card")).toContainText(
    "Harga sewa aula satuan",
  );
  await expect(page.locator(".booking-dates input").first()).toHaveValue(
    checkin,
  );
  await page.evaluate(() => {
    window.__openedUrl = "";
    window.open = (url) => {
      window.__openedUrl = url;
      return null;
    };
  });
  await page
    .getByRole("button", { name: "Reservasi via WhatsApp", exact: true })
    .click();
  const destination = new URL(await page.evaluate(() => window.__openedUrl));
  expect(destination.origin + destination.pathname).toBe(
    "https://wa.me/6285808408835",
  );
  expect(destination.searchParams.get("text")).toContain("ketersediaan Aula");
  expect(destination.searchParams.get("text")).toContain("Rp500.000 per malam");
  expect(destination.searchParams.get("text")).toContain(
    `Check-in: ${checkin}`,
  );
  expect(destination.searchParams.get("text")).not.toContain("Paket 2");
  await page.goto("/aula?paket=1");
  await expect(page.locator(".package-context")).toHaveCount(0);
  await expect(page.locator(".booking-price")).toContainText("Rp500.000");
});

for (const facility of [
  {
    name: "Ruang Makan",
    subject: "dining room",
    card: ".dining-card",
    path: "/ruang-makan",
    secondPhoto: "/images/dining_room-01.webp",
  },
  {
    name: "Kolam Renang",
    subject: "swimming pool",
    card: ".pool-card",
    path: "/kolam-renang",
    secondPhoto: "/images/pool-02.webp",
  },
]) {
  test(`${facility.subject} card opens the photo gallery and keeps the reservation attached to its package`, async ({
    page,
  }) => {
    const checkin = new Date(Date.now() + 30 * 86400000)
      .toISOString()
      .slice(0, 10);
    await page.goto(`/paket/2?check_in=${checkin}&tamu=35`);
    await page.locator(`.included-room-grid ${facility.card}`).click();
    await expect(page).toHaveURL(new RegExp(`${facility.path}\\?paket=2`));
    await expect(
      page.getByRole("heading", { name: facility.name, exact: true }),
    ).toBeVisible();
    await expect(page.locator(".package-context")).toContainText(
      `${facility.name} termasuk dalam Paket 2`,
    );
    await expect(page.locator(".booking-price")).toContainText("Rp1.250.000");
    await expect(page.locator(".booking-dates input").first()).toHaveValue(
      checkin,
    );
    await expect(page.locator(".room-photo-grid img")).toHaveCount(3);
    await page
      .getByRole("button", {
        name: `Lihat foto 1 ${facility.name}`,
        exact: true,
      })
      .click();
    const gallery = page.getByRole("dialog", {
      name: `Galeri foto ${facility.name}`,
    });
    await expect(gallery).toBeVisible();
    await expect(gallery).toContainText("Foto 1 dari 3");
    await gallery
      .getByRole("button", { name: "Foto berikutnya", exact: true })
      .click();
    await expect(gallery).toContainText("Foto 2 dari 3");
    await expect(gallery.locator(".lightbox-stage img")).toHaveAttribute(
      "src",
      facility.secondPhoto,
    );
    await gallery
      .getByRole("button", { name: "Tampilkan foto 3", exact: true })
      .click();
    await expect(gallery).toContainText("Foto 3 dari 3");
    await page.keyboard.press("Escape");
    await expect(gallery).toHaveCount(0);
    await page.evaluate(() => {
      window.__openedUrl = "";
      window.open = (url) => {
        window.__openedUrl = url;
        return null;
      };
    });
    await page
      .getByRole("button", { name: "Reservasi via WhatsApp", exact: true })
      .click();
    const destination = new URL(await page.evaluate(() => window.__openedUrl));
    expect(destination.searchParams.get("text")).toContain("Paket 2");
    expect(destination.searchParams.get("text")).toContain(
      "Rp1.250.000 per malam",
    );
    expect(destination.searchParams.get("text")).toContain(
      `Check-in: ${checkin}`,
    );
    await page
      .getByRole("link", { name: "Kembali ke Paket 2", exact: true })
      .click();
    await expect(page.locator("h1")).toContainText("Paket 2");
    await expect(page.locator(".booking-dates input").first()).toHaveValue(
      checkin,
    );
    await page.goto("/");
    await page
      .getByRole("link", {
        name: `Lihat detail dan foto ${facility.name}`,
        exact: true,
      })
      .click();
    await expect(page).toHaveURL(facility.path);
    await expect(page.locator(".package-context")).toHaveCount(0);
    await expect(page.locator(".booking-price")).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: "Lihat pilihan paket", exact: true }),
    ).toBeVisible();
  });
}

test("search retains dates, applies budget, and prepares an accurate WhatsApp message", async ({
  page,
}) => {
  const checkin = new Date(Date.now() + 30 * 86400000)
    .toISOString()
    .slice(0, 10);
  const checkout = new Date(Date.now() + 31 * 86400000)
    .toISOString()
    .slice(0, 10);
  await page.goto("/");
  await page.getByLabel("Tanggal check-in", { exact: true }).fill(checkin);
  await page.getByLabel("Tanggal check-out", { exact: true }).fill(checkout);
  await page.getByLabel("Jumlah tamu", { exact: true }).fill("35");
  await page.getByRole("button", { name: "Filter", exact: true }).click();
  await page.getByLabel("Harga maksimal per malam").selectOption("1500000");
  await page.getByRole("button", { name: "Cari", exact: true }).click();
  await expect(page.locator(".packages-catalog .package-card")).toHaveCount(2);
  await page.locator(".packages-catalog .package-card").first().click();
  await expect(page.locator(".booking-dates input").first()).toHaveValue(
    checkin,
  );
  await expect(page.locator(".booking-dates input").last()).toHaveValue(
    checkout,
  );
  await page.evaluate(() => {
    window.__openedUrl = "";
    window.open = (url) => {
      window.__openedUrl = url;
      return null;
    };
  });
  await page
    .getByRole("button", { name: "Reservasi via WhatsApp", exact: true })
    .click();
  const destination = await page.evaluate(() => window.__openedUrl);
  const url = new URL(destination);
  expect(url.origin + url.pathname).toBe("https://wa.me/6285808408835");
  expect(url.searchParams.get("text")).toContain("Paket 2");
  expect(url.searchParams.get("text")).toContain(`Check-in: ${checkin}`);
  expect(url.searchParams.get("text")).toContain(`Check-out: ${checkout}`);
  expect(url.searchParams.get("text")).toContain("Jumlah tamu: 35 orang");
  expect(url.searchParams.get("text")).toContain("Rp1.250.000 per malam");
  // Exploring the included room must keep the reservation attached to the package.
  await page.locator(".included-room-grid .room-card").first().click();
  await expect(page.locator(".booking-selected")).toContainText("Paket 2");
  await expect(page.locator(".room-unit-price")).toContainText("Rp125.000");
  await expect(page.locator(".booking-dates input").first()).toHaveValue(
    checkin,
  );
  await page
    .getByRole("button", { name: "Reservasi via WhatsApp", exact: true })
    .click();
  const roomDestination = new URL(
    await page.evaluate(() => window.__openedUrl),
  );
  expect(roomDestination.searchParams.get("text")).toContain("Paket 2");
  expect(roomDestination.searchParams.get("text")).toContain(
    "Rp1.250.000 per malam",
  );
});

test("public pages load without script errors, missing images or horizontal overflow", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const path of [
    "/",
    "/kamar",
    "/paket",
    "/kamar/private",
    "/aula",
    "/ruang-makan",
    "/kolam-renang",
    "/tentang-kami",
  ]) {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    await page.evaluate(async () => {
      for (const image of document.images) image.loading = "eager";
      await Promise.all(
        Array.from(document.images).map((image) =>
          image.decode().catch(() => {}),
        ),
      );
      await document.fonts.ready;
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    expect(
      await page
        .locator("img")
        .evaluateAll((images) =>
          images
            .filter((image) => image.naturalWidth === 0)
            .map((image) => image.src),
        ),
    ).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test("navigation and mobile menu lead to the public pages", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  if (isMobile) {
    const toggle = page.getByRole("button", { name: "Buka menu", exact: true });
    await toggle.click();
    await expect(
      page.getByRole("navigation", { name: "Navigasi utama" }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("navigation", { name: "Navigasi utama" }),
    ).toBeHidden();
    await toggle.click();
  }
  await page
    .getByRole("navigation", { name: "Navigasi utama" })
    .getByRole("link", { name: "Tentang Kami", exact: true })
    .click();
  await expect(page).toHaveURL("/tentang-kami");
  await expect(page.locator("h1")).toContainText("Villa Bukit Bunga");
  if (isMobile)
    await expect(
      page.getByRole("navigation", { name: "Navigasi utama" }),
    ).toBeHidden();
  const pdf = await page.request.get("/villa-bukit-bunga-flyer.pdf");
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()["content-type"]).toContain("application/pdf");
});
