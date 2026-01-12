import { Page } from "@playwright/test";
import { supportButtonChecking } from "./support-button-checking";

export const rateModalChecking = async (page: Page,  cb?: () => Promise<void>) => {
    await page.waitForTimeout(1000);
    const rateModalContainer = page.locator('#rate-modal-container')
    const rateModalCloseButton = page.locator('#rate-modal-close-button')
    const rateModalSupportButton = page.locator('#rate-modal-support-link')

    rateModalContainer.isVisible()
    rateModalCloseButton.isVisible()
    rateModalSupportButton.isVisible()

    if (cb)
    await cb()

    await page.waitForTimeout(1000);
    rateModalCloseButton.click()
    await page.waitForTimeout(1000);

    rateModalContainer.isHidden()
}