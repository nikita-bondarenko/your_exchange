import { test, expect, Locator } from '@playwright/test';
import { supportButtonChecking } from './utils/support-button-checking';
import { rateModalChecking } from './utils/rate-modal-checking';
import { navigationButtonChecking } from './utils/navigation-button-checking';
import { exchangeHeadingChecking } from './utils/exchange-heading-checking';

test.describe('Exhcange Input Page - Страница ввода данных обмена COIN - BANK', () => {
    test.setTimeout(2400000); // Устанавливаем таймаут 40 минут для всех тестов

    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/exchange/type');
        await page.waitForLoadState('networkidle');
        await rateModalChecking(page)
        await page.waitForTimeout(500);
        const buttonGiven = page.locator('#given-COIN')
        if (!(await buttonGiven.getAttribute('class'))?.includes('[&]:bg-[var(--background-exchange-type-selected)]')) {
            await buttonGiven.click()
        }
        await page.waitForTimeout(500)
        const buttonReceived = page.locator('#received-BANK')
        if (!(await buttonReceived.getAttribute('class'))?.includes('[&]:bg-[var(--background-exchange-type-selected)]')) {
            await buttonReceived.click()
        }
        await page.waitForTimeout(500)
        await navigationButtonChecking(page, 'Подтвердить выбор', '/exchange/input')
        await page.waitForTimeout(1000);
    });

    test('1. Отображение элементов', async ({ page }) => {
        await exchangeHeadingChecking(page)
        const givenInputCurrencyInput = page.locator('#given-crypto-input-currency-input')
        await expect(givenInputCurrencyInput).toBeVisible()
        const givenInputNetSelect = page.locator('#given-crypto-input-net-select')
        await expect(givenInputNetSelect).toBeVisible()
        const receivedInputCurrencyInput = page.locator('#received-card-input-currency-input')
        await expect(receivedInputCurrencyInput).toBeVisible()
        const receivedInputBankSelect = page.locator('#received-card-input-bank-select')
        await expect(receivedInputBankSelect).toBeVisible()
        const receivedInputBankSelectTriggerButton = page.locator('#received-card-input-bank-select-trigger-button')
        const receivedInputBankSelectDropdown = page.locator('#received-card-input-bank-select-dropdown')
        await expect(receivedInputBankSelectTriggerButton).toBeVisible()
        await receivedInputBankSelectTriggerButton.click()
        await page.waitForTimeout(1000)
        const tinkoffButton = receivedInputBankSelectDropdown.locator('button', { hasText: 'Тинькофф' })
        await tinkoffButton.scrollIntoViewIfNeeded()
        await expect(tinkoffButton).toBeVisible()
        await page.waitForTimeout(500)
        await tinkoffButton.click()
        await page.waitForTimeout(1000)
        const cardNumberInput = page.locator('#received-card-bank-input-card-number-input')
        await expect(cardNumberInput).toBeVisible()
        await receivedInputBankSelectTriggerButton.click()
        await page.waitForTimeout(1000)
        const sbpButton = receivedInputBankSelectDropdown.locator('button', { hasText: 'СБП' })
        await sbpButton.scrollIntoViewIfNeeded()
        await expect(sbpButton).toBeVisible()
        await page.waitForTimeout(500)
        await sbpButton.click()
        await page.waitForTimeout(1000)
        const phoneNumberInput = page.locator('#received-card-bank-input-phone-number-input')
        await expect(phoneNumberInput).toBeVisible()
    });



    test('2. Проверка вывода курса', async ({ page }) => {
        const randomBodyElement = page.locator('#given-input-heading h2')

        const rateSpan = page.locator('#received-input-heading #rate-span');

        const checkRateSpan = async () => {
            const rateText = await rateSpan.textContent();
            const rateHtml = await rateSpan.innerHTML();
            if (rateText && (rateText.includes('Infinity') || rateText.includes('infinity') || rateText.includes('∞'))) {
                throw new Error(`Обнаружен Infinity в rate-span. Rate: ${rateText}`);
            }
            if (rateHtml && (rateHtml.includes('Infinity') || rateHtml.includes('infinity') || rateHtml.includes('∞'))) {
                throw new Error(`Обнаружен Infinity в rate-span HTML. Rate HTML: ${rateHtml}`);
            }
        }

        const givenCurrencySelect = page.locator('#given-crypto-input-currency-input-currency-select');
        const givenCurrencySelectTrigger = givenCurrencySelect.locator('button');
        await givenCurrencySelectTrigger.click();
        await page.waitForTimeout(500);
        const givenCurrencyDropdown = page.locator('#given-crypto-input-currency-input-currency-select-dropdown');
        const givenCurrencyButtons = givenCurrencyDropdown.locator('button');
        const givenCurrencyCount = await givenCurrencyButtons.count();
        await randomBodyElement.click();
        await page.waitForTimeout(500);

        let totalCombinations = 0;
        let checkedCombinations = 0;

        // Цикл 1: Валюты продажи (given)
        for (let givenIdx = 0; givenIdx < givenCurrencyCount; givenIdx++) {
            await givenCurrencySelectTrigger.click();
            await page.waitForTimeout(500);
            const givenCurrencyDropdownCurrent = page.locator('#given-crypto-input-currency-input-currency-select-dropdown');
            const givenCurrencyButtonsCurrent = givenCurrencyDropdownCurrent.locator('button');
            const givenButton = givenCurrencyButtonsCurrent.nth(givenIdx);
            await givenButton.scrollIntoViewIfNeeded();
            const givenCurrencyText = await givenButton.textContent() || `Валюта продажи ${givenIdx + 1}`;
            await givenButton.click();
            await page.waitForTimeout(1000);
            await randomBodyElement.click();
            await page.waitForTimeout(500);

            console.log(`\n=== Валюта продажи [${givenIdx + 1}/${givenCurrencyCount}]: ${givenCurrencyText} ===`);

            // Переполучаем локаторы сетей после выбора валюты
            const netSelect = page.locator('#given-crypto-input-net-select');
            const netButtons = netSelect.locator('button');
            const netCount = await netButtons.count();
            console.log(`Найдено сетей: ${netCount}`);

            // Цикл 2: Сети для выбранной валюты продажи
            for (let netIdx = 0; netIdx < netCount; netIdx++) {
                await page.waitForTimeout(500);
                const netSelectCurrent = page.locator('#given-crypto-input-net-select');
                const netButtonsCurrent = netSelectCurrent.locator('button');
                const netButton = netButtonsCurrent.nth(netIdx);

                await netButton.scrollIntoViewIfNeeded();
                await netButton.waitFor({ state: 'visible' });
                const netText = await netButton.textContent() || `Сеть ${netIdx + 1}`;
                
                // Проверяем, disabled ли сеть (уже выбрана)
                const isNetDisabled = await netButton.evaluate((el) => {
                    return el.hasAttribute('disabled') || el.classList.contains('pointer-events-none');
                });

                if (isNetDisabled) {
                    console.log(`  Сеть [${netIdx + 1}/${netCount}] "${netText}" уже выбрана, пропускаем клик`);
                } else {
                    console.log(`  Сеть [${netIdx + 1}/${netCount}]: ${netText}`);
                    await netButton.click();
                    await page.waitForTimeout(1500);
                    await page.waitForLoadState('networkidle');
                }

                // Переполучаем валюты покупки после выбора сети
                const receivedCurrencySelect = page.locator('#received-card-input-currency-input-currency-select');
                const receivedCurrencySelectTrigger = receivedCurrencySelect.locator('button');
                await receivedCurrencySelectTrigger.click();
                await page.waitForTimeout(500);
                const receivedCurrencyDropdown = page.locator('#received-card-input-currency-input-currency-select-dropdown');
                const receivedCurrencyButtons = receivedCurrencyDropdown.locator('button');
                const receivedCurrencyCount = await receivedCurrencyButtons.count();
                await randomBodyElement.click();
                await page.waitForTimeout(500);

                console.log(`    Найдено валют покупки: ${receivedCurrencyCount}`);

                // Цикл 3: Валюты покупки (received) для выбранной сети
                for (let receivedIdx = 0; receivedIdx < receivedCurrencyCount; receivedIdx++) {
                    await receivedCurrencySelectTrigger.click();
                    await page.waitForTimeout(500);
                    const receivedCurrencyDropdownCurrent = page.locator('#received-card-input-currency-input-currency-select-dropdown');
                    const receivedCurrencyButtonsCurrent = receivedCurrencyDropdownCurrent.locator('button');
                    const receivedButton = receivedCurrencyButtonsCurrent.nth(receivedIdx);
                    await receivedButton.scrollIntoViewIfNeeded();
                    const receivedCurrencyText = await receivedButton.textContent() || `Валюта покупки ${receivedIdx + 1}`;
                    await receivedButton.click();
                    await page.waitForTimeout(1000);
                    await randomBodyElement.click();
                    await page.waitForTimeout(500);

                    console.log(`      Валюта покупки [${receivedIdx + 1}/${receivedCurrencyCount}]: ${receivedCurrencyText}`);

                    // Переполучаем банки после выбора валюты покупки
                    const bankSelectTrigger = page.locator('#received-card-input-bank-select-trigger-button');
                    await bankSelectTrigger.click();
                    await page.waitForTimeout(500);
                    const bankDropdown = page.locator('#received-card-input-bank-select-dropdown');
                    const bankButtons = bankDropdown.locator('button');
                    const bankCount = await bankButtons.count();
                    await randomBodyElement.click();
                    await page.waitForTimeout(500);

                    console.log(`Найдено банков: ${bankCount}`);

                    // Цикл 4: Банки для выбранной валюты покупки
                    for (let bankIdx = 0; bankIdx < bankCount; bankIdx++) {
                        totalCombinations++;
                        
                        await bankSelectTrigger.click();
                        await page.waitForTimeout(500);
                        const bankDropdownCurrent = page.locator('#received-card-input-bank-select-dropdown');
                        const bankButtonsCurrent = bankDropdownCurrent.locator('button');
                        const bankButton = bankButtonsCurrent.nth(bankIdx);
                        await bankButton.scrollIntoViewIfNeeded();
                        const bankText = await bankButton.textContent() || `Банк ${bankIdx + 1}`;
                        await bankButton.click();
                        await page.waitForTimeout(1500);
                        await randomBodyElement.click();
                        await page.waitForTimeout(500);

                        // Проверяем rate-span
                        const combination = `Given: ${givenCurrencyText}, Network: ${netText}, Received: ${receivedCurrencyText}, Bank: ${bankText}`;
                        try {
                            await checkRateSpan();
                            checkedCombinations++;
                            if (checkedCombinations % 10 === 0) {
                                console.log(`        ✓ Проверено ${checkedCombinations} комбинаций...`);
                            }
                        } catch (error) {
                            const errorMessage = error instanceof Error ? error.message : String(error);
                            throw new Error(`${errorMessage} Комбинация: ${combination}`);
                        }
                    }
                }
            }
        }

        console.log(`\nВсе ${checkedCombinations} комбинаций проверены успешно, Infinity не обнаружен`);
    });


});




