import { Page, expect } from "@playwright/test";

export async function navigationButtonChecking(page: Page, buttonName: string, url: string) {
    const button = page.getByRole('button', { name: buttonName });
    await expect(button).toBeVisible();
    await button.click();
    await page.waitForURL(url, { timeout: 3000 });
    expect(page.url()).toContain(url);
}
