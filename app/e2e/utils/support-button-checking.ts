import { Locator, Page } from "@playwright/test";
import { test, expect } from '@playwright/test';


export const supportButtonChecking = async (page: Page, button: Locator) => {
    const consoleMessagesBefore: string[] = [];
    const consoleErrorsBefore: string[] = [];
    
    const messageHandler = (msg: any) => {
      const text = msg.text();
      consoleMessagesBefore.push(text);
      if (msg.type() === 'error') {
        consoleErrorsBefore.push(text);
      }
    };

    page.on('console', messageHandler);
    // Находим кнопку "Поддержка"

    await expect(button).toBeVisible();
    button.click()
    await page.waitForTimeout(800);

    expect(consoleMessagesBefore.some(msg => msg === '[Telegram.WebView] > postEvent web_app_close {}')).toBe(true)

    expect(consoleErrorsBefore.length).toBe(0)
}