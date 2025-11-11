import { expect, test } from "@playwright/test";

test("homepage displays Whiteloop value proposition", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /find perfectly-matched/i })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /for researchers/i })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /for participants/i })).toBeVisible();
});



