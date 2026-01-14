import { Page,expect } from "@playwright/test"

export const exchangeHeadingChecking = async (page: Page) => {
    const givenInputHeading = page.locator('#given-input-heading')
    await expect(givenInputHeading).toBeVisible()
    const minValueButton = givenInputHeading.locator('#min-value-button')
    await expect(minValueButton).toBeVisible()
    const minValueNote = givenInputHeading.locator('#min-value-note')
    await expect(minValueNote).toHaveClass(/opacity-0/)
    await minValueButton.click()
    await page.waitForTimeout(500);
    await expect(minValueNote).toHaveClass(/opacity-100/)
    await page.waitForTimeout(3000);
    await expect(minValueNote).toHaveClass(/opacity-0/)


    const receivedInputHeading = page.locator('#received-input-heading')
    await expect(receivedInputHeading).toBeVisible()
    const rateSpan = receivedInputHeading.locator('#rate-span')
    await expect(rateSpan).toBeVisible()

}