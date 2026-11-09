import { test, expect } from "@playwright/test";

test("rapid next clicks do not select or tint gallery photos", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Lihat foto halaman 1", exact: true })
    .click();
  const gallery = page.getByRole("dialog", {
    name: "Galeri foto Halaman Villa",
  });
  const next = gallery.getByRole("button", {
    name: "Foto berikutnya",
    exact: true,
  });
  const previous = gallery.getByRole("button", {
    name: "Foto sebelumnya",
    exact: true,
  });
  const photo = gallery.locator(".lightbox-stage > img");
  await photo.evaluate((image) => image.decode());
  const initialNextPosition = await next.boundingBox();
  await next.click({ clickCount: 4, delay: 35 });
  await expect(gallery).toContainText("Foto 5 dari 13");
  await photo.evaluate((image) => image.decode());
  await expect
    .poll(() => page.evaluate(() => window.getSelection().isCollapsed))
    .toBe(true);
  await photo.click({ clickCount: 3, delay: 35 });
  expect(await page.evaluate(() => window.getSelection().isCollapsed)).toBe(
    true,
  );
  const nextPosition = await next.boundingBox();
  expect(Math.abs(nextPosition.x - initialNextPosition.x)).toBeLessThan(1);
  expect(Math.abs(nextPosition.y - initialNextPosition.y)).toBeLessThan(1);
  await previous.click({ clickCount: 3, delay: 35 });
  await expect(gallery).toContainText("Foto 2 dari 13");
  expect(await page.evaluate(() => window.getSelection().isCollapsed)).toBe(
    true,
  );

  // Recover a selection left over from an already-open gallery before the fix.
  await photo.evaluate((image) => {
    const range = document.createRange();
    range.selectNode(image);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  });
  await page.keyboard.press("ArrowRight");
  await expect(gallery).toContainText("Foto 3 dari 13");
  expect(await page.evaluate(() => window.getSelection().isCollapsed)).toBe(
    true,
  );
  await gallery
    .getByRole("button", { name: "Tampilkan foto 8", exact: true })
    .click();
  await expect(gallery).toContainText("Foto 8 dari 13");
  await page.keyboard.press("Escape");
  await expect(gallery).toHaveCount(0);
});
