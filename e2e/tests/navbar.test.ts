import { test, expect } from "@playwright/test";

test.describe("Navbar", () => {
  test("renders logo with correct text", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("header").getByText("GOD")).toBeVisible();
    await expect(page.locator("header").getByText("RIVE")).toBeVisible();
  });

  test("displays login and register buttons when user is not logged in", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Register" })).toBeVisible();
  });

  test("clicking login button navigates to login page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Login" }).click();

    await page.waitForURL("**/login");
    expect(page.url()).toContain("/login");
  });

  test("clicking register button navigates to register page", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Register" }).click();
    await page.waitForURL("**/register");
    expect(page.url()).toContain("/register");
  });

  test("clicking search trips button navigates to search page", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Search Trips" }).click();
    await page.waitForURL("**/trips/search");
    expect(page.url()).toContain("/trips/search");
  });
});
