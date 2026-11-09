import { test, expect } from "@playwright/test";

test("homepage yard photos can be selected without playing the video and pause playback when opened", async ({
  page,
}) => {
  const videoRequests = [];
  page.on("request", (request) => {
    if (request.url().endsWith("halaman-villa.mp4"))
      videoRequests.push(request.url());
  });
  await page.goto("/");
  const video = page.locator("#halaman-villa video");
  const photos = page.locator("#halaman-villa .yard-photo-thumbnail");
  await expect(photos).toHaveCount(13);
  await page
    .getByRole("button", { name: "Lihat foto halaman 5", exact: true })
    .click();
  const gallery = page.getByRole("dialog", {
    name: "Galeri foto Halaman Villa",
  });
  await expect(gallery).toBeVisible();
  await expect(gallery).toContainText("Foto 5 dari 13");
  await expect(gallery.locator(".lightbox-stage img")).toHaveAttribute(
    "src",
    "/images/villa_yard-05.webp",
  );
  expect(videoRequests).toEqual([]);
  expect(await video.evaluate((element) => element.paused)).toBe(true);
  await page.keyboard.press("Escape");
  await expect(gallery).toHaveCount(0);
  await video.evaluate((element) => element.play());
  await expect
    .poll(() => video.evaluate((element) => element.currentTime), {
      timeout: 15000,
    })
    .toBeGreaterThan(0.15);
  await page
    .getByRole("button", { name: "Lihat foto halaman 3", exact: true })
    .click();
  await expect(gallery).toContainText("Foto 3 dari 13");
  expect(await video.evaluate((element) => element.paused)).toBe(true);
  await page.keyboard.press("Escape");
  expect(await video.evaluate((element) => element.paused)).toBe(true);
});

for (const clip of [
  {
    title: "Kamar Private",
    path: "/kamar",
    file: "private-tour.mp4",
    duration: 49.1,
  },
]) {
  test(`${clip.title} video plays from its card and closes without navigating`, async ({
    page,
  }) => {
    const errors = [];
    const requests = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => {
      if (request.url().includes("/videos/") && request.url().endsWith(".mp4"))
        requests.push(request.url());
    });
    await page.goto(clip.path, { waitUntil: "networkidle" });
    const opener = page.getByRole("button", {
      name: `Lihat video ${clip.title}`,
      exact: true,
    });
    await expect(opener).toBeVisible();
    expect(requests).toEqual([]);
    await expect(page.locator("a .card-video-button")).toHaveCount(0);
    await opener.click();
    const dialog = page.getByRole("dialog", {
      name: `Video ${clip.title}`,
      exact: true,
    });
    await expect(dialog).toBeVisible();
    const video = dialog.locator("video");
    await expect(video).toHaveAttribute("controls", "");
    await expect(video).toHaveAttribute("playsinline", "");
    await expect(video.locator("source")).toHaveAttribute(
      "src",
      `/videos/${clip.file}`,
    );
    await expect
      .poll(() => video.evaluate((element) => element.currentTime), {
        timeout: 15000,
      })
      .toBeGreaterThan(0.15);
    const metadata = await video.evaluate((element) => ({
      duration: element.duration,
      width: element.videoWidth,
      height: element.videoHeight,
      error: element.error?.message,
    }));
    expect(Math.abs(metadata.duration - clip.duration)).toBeLessThan(0.3);
    expect(metadata.width).toBe(1280);
    expect(metadata.height).toBe(720);
    expect(metadata.error).toBeUndefined();
    await video.evaluate((element) => {
      window.__lastVideo = element;
    });
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(opener).toBeFocused();
    await expect(page).toHaveURL(clip.path);
    expect(await page.evaluate(() => window.__lastVideo.paused)).toBe(true);
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
    expect(errors).toEqual([]);

    const range = await page.request.get(`/videos/${clip.file}`, {
      headers: { Range: "bytes=0-127" },
    });
    expect(range.status()).toBe(206);
    expect(range.headers()["content-type"]).toContain("video/mp4");
    expect(range.headers()["content-range"]).toMatch(/^bytes 0-127\//);
    expect((await range.body()).byteLength).toBe(128);
  });
}

for (const clip of [
  {
    title: "Private detail",
    path: "/kamar/private",
    selector: ".room-video-section video",
    file: "private-tour.mp4",
  },
  {
    title: "Homepage Halaman Villa",
    path: "/",
    selector: "#halaman-villa video",
    file: "halaman-villa.mp4",
  },
]) {
  test(`${clip.title} has an inline video player that waits for the visitor to play it`, async ({
    page,
  }) => {
    await page.goto(clip.path);
    const video = page.locator(clip.selector);
    await expect(video).toBeVisible();
    await expect(video).toHaveAttribute("preload", "none");
    expect(await video.evaluate((element) => element.autoplay)).toBe(false);
    await expect(video.locator("source")).toHaveAttribute(
      "src",
      `/videos/${clip.file}`,
    );
    await video.evaluate((element) => element.play());
    await expect
      .poll(() => video.evaluate((element) => element.currentTime), {
        timeout: 15000,
      })
      .toBeGreaterThan(0.15);
    await video.evaluate((element) => element.pause());
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  });
}
