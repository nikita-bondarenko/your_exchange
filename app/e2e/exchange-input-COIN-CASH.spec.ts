import { test, expect, Locator } from '@playwright/test';
import { supportButtonChecking } from './utils/support-button-checking';
import { rateModalChecking } from './utils/rate-modal-checking';
import { navigationButtonChecking } from './utils/navigation-button-checking';
import { exchangeHeadingChecking } from './utils/exchange-heading-checking';
import { valueMask } from '@/shared/lib/string/valueMask';

test.describe('Exhcange Input Page - Страница ввода данных обмена COIN - CASH', () => {
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
        const buttonReceived = page.locator('#received-CASH')
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
        const receivedInputCurrencyInput = page.locator('#received-cash-input-currency-input')
        await expect(receivedInputCurrencyInput).toBeVisible()
        const receivedInputCitySelect = page.locator('#received-cash-input-city-select')
        await expect(receivedInputCitySelect).toBeVisible()
        const receivedInputCitySelectTriggerButton = page.locator('#received-cash-input-city-select-trigger-button')
        await expect(receivedInputCitySelectTriggerButton).toBeVisible()
        await receivedInputCitySelectTriggerButton.click()

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

        const checkPlaceholderValueCalculation = async () => {
            await page.waitForTimeout(1000);

            const rate = Number(await page.locator('#rate-value').textContent())
            const minValue = Number((await page.locator('#min-value-button-amount').textContent())?.split(' ').join(''))
            const givenAmountInput = page.locator('#given-crypto-input-currency-input input');
            givenAmountInput.fill('')
            await page.waitForTimeout(1000);

            const givenAmountInputPlaceholder = await page.locator('#given-crypto-input-currency-input input').getAttribute('placeholder');
            expect(givenAmountInputPlaceholder).toBe(valueMask(minValue));

            const receivedAmountInput = page.locator('#received-cash-input-currency-input input');

            const receivedAmountInputPlaceholder = await receivedAmountInput.getAttribute('placeholder');
            expect(receivedAmountInputPlaceholder).toBe(valueMask(Number((minValue * rate).toFixed(2))));
            console.log("placeholder calculation is correct")
        }

        const checkReceivedAmountInputCalculation = async () => {
            await page.waitForTimeout(1000);

            const rate = Number(await page.locator('#rate-value').textContent())
            const givenAmountInput = page.locator('#given-crypto-input-currency-input input');
            givenAmountInput.fill('1000')
            await page.waitForTimeout(1000);

            const receivedAmountInputValue = await page.locator('#received-cash-input-currency-input input').inputValue();
            expect(receivedAmountInputValue).toBe(valueMask(Number((1000 * rate).toFixed(2))));
            console.log("received amount input calculation is correct")
        }

        const checkGivenAmountInputCalculation = async () => {
            await page.waitForTimeout(1000);

            const rate = Number(await page.locator('#rate-value').textContent())
            const receivedAmountInput = page.locator('#received-cash-input-currency-input input');
            receivedAmountInput.fill('10000')
            await page.waitForTimeout(1000);

            const givenAmountInputValue = await page.locator('#given-crypto-input-currency-input input').inputValue();
            expect(givenAmountInputValue).toBe(valueMask(Number((10000 / rate).toFixed(8))));
            console.log("given amount input calculation is correct")
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
                const receivedCurrencySelect = page.locator('#received-cash-input-currency-input-currency-select');
                const receivedCurrencySelectTrigger = receivedCurrencySelect.locator('button');
                await receivedCurrencySelectTrigger.click();
                await page.waitForTimeout(500);
                const receivedCurrencyDropdown = page.locator('#received-cash-input-currency-input-currency-select-dropdown');
                const receivedCurrencyButtons = receivedCurrencyDropdown.locator('button');
                const receivedCurrencyCount = await receivedCurrencyButtons.count();
                await randomBodyElement.click();
                await page.waitForTimeout(500);

                console.log(`    Найдено валют покупки: ${receivedCurrencyCount}`);

                // Цикл 3: Валюты покупки (received) для выбранной сети
                for (let receivedIdx = 0; receivedIdx < receivedCurrencyCount; receivedIdx++) {
                    await receivedCurrencySelectTrigger.click();
                    await page.waitForTimeout(500);
                    const receivedCurrencyDropdownCurrent = page.locator('#received-cash-input-currency-input-currency-select-dropdown');
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
                    const citySelectTrigger = await page.locator('#received-cash-input-city-select-trigger-button');
                    await citySelectTrigger.click();
                    await page.waitForTimeout(500);
                    const cityDropdown = page.locator('#received-cash-input-city-select-dropdown');

                    const cityButtons = cityDropdown.locator('button');

                    const cityCount = await cityButtons.count();
                    await randomBodyElement.click();
                    await page.waitForTimeout(500);

                    console.log(`Найдено городов: ${cityCount}`);

                    // Цикл 4: Банки для выбранной валюты покупки
                    for (let cityIdx = 0; cityIdx < cityCount; cityIdx++) {
                        totalCombinations++;

                        await citySelectTrigger.click();
                        await page.waitForTimeout(500);
                        const cityDropdownCurrent = page.locator('#received-cash-input-city-select-dropdown');
                        const cityButtonsCurrent = cityDropdownCurrent.locator('button');
                        const cityButton = cityButtonsCurrent.nth(cityIdx);
                        await cityButton.scrollIntoViewIfNeeded();
                        const cityText = await cityButton.textContent() || `Город ${cityIdx + 1}`;
                        await cityButton.click();
                        await page.waitForTimeout(1500);
                        await randomBodyElement.click();
                        await page.waitForTimeout(500);

                        // Проверяем rate-span
                        const combination = `Given: ${givenCurrencyText}, Network: ${netText}, Received: ${receivedCurrencyText}, City: ${cityText}`;
                        try {
                            await checkRateSpan();
                            await checkPlaceholderValueCalculation();
                            await checkReceivedAmountInputCalculation();
                            await checkGivenAmountInputCalculation();
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

    test("3. Валидация полей ввода", async ({ page }) => {


        // Получаем локаторы полей
        const givenAmountInput = page.locator('#given-crypto-input-currency-input input');
        const submitButton = page.getByRole('button', { name: 'Далее' });
        const givenInputHeading = page.locator('#given-input-heading');

        await givenAmountInput.fill('');


        // Тест 1: Проверка валидации пустых полей
        // Сохраняем текущий URL перед кликом
        const initialUrl = page.url();
        await submitButton.click();
        await page.waitForTimeout(1000);

        // Проверяем, что страница не изменилась (валидация заблокировала переход)
        expect(page.url()).toBe(initialUrl);

        // Проверяем визуальный индикатор ошибки для суммы (иконка AlertIcon должна быть видима)
        const minValueButton = givenInputHeading.locator('#min-value-button');
        const minValueButtonText = minValueButton.locator('#min-value-button-text');
        const alertIcon = minValueButton.locator('#alert-icon');

        expect(await minValueButtonText.getAttribute('class')).toContain('[&]:text-[var(--text-error-light)] [&_span]:text-[var(--text-error-bright)]');
        expect(await alertIcon.getAttribute('class')).toContain('[&]:opacity-100');
        // Проверяем, что кнопка с минимальной суммой существует (она показывает ошибку визуально)

        // Проверяем ошибку для номера карты
        const citySelectError = page.locator('#received-cash-input-city-select p')
        expect(await citySelectError.getAttribute('class')).toContain('text-[var(--text-error-light)]');
        const citySelectErrorText = await citySelectError.textContent();
        expect(citySelectErrorText).toContain('Выберите город');


        // Тест 6: Проверка валидных данных (должны пройти валидацию)
        await givenAmountInput.fill('999999999999');
        await page.waitForTimeout(500);

        const citySelectTrigger = await page.locator('#received-cash-input-city-select-trigger-button');
        citySelectTrigger.click()
        await page.waitForTimeout(500)
        const cityDropdown = page.locator('#received-cash-input-city-select-dropdown');
        const button = cityDropdown.getByRole("button", { name: "Москва" })
        button.click()
        await page.waitForTimeout(1000)

        const citySelectErrorUpdated = page.locator('#received-cash-input-city-select p')
       const isErrorVisible = citySelectErrorUpdated.isVisible().catch(() => false);
       expect(isErrorVisible).toBeFalsy();

       const minValueButtonUpdated = givenInputHeading.locator('#min-value-button');
       const minValueButtonTextUpdated = minValueButtonUpdated.locator('#min-value-button-text');
       const alertIconUpdated = minValueButtonUpdated.locator('#alert-icon');

       expect(await minValueButtonTextUpdated.getAttribute('class')).not.toContain('[&]:text-[var(--text-error-light)] [&_span]:text-[var(--text-error-bright)]');
       expect(await alertIconUpdated.getAttribute('class')).not.toContain('[&]:opacity-100');
    })

    test("4. Проверка кнопки Далее", async ({ page }) => {
        const givenAmountInput = page.locator('#given-crypto-input-currency-input input');
        const minValue = Number((await page.locator('#min-value-button-amount').textContent())?.split(' ').join(''))

        givenAmountInput.fill(minValue.toString())
        await page.waitForTimeout(1000)

        const citySelectTrigger =  page.locator('#received-cash-input-city-select-trigger-button');
        citySelectTrigger.click()
        await page.waitForTimeout(500)
        const cityDropdown = page.locator('#received-cash-input-city-select-dropdown');
        const button = cityDropdown.getByRole("button", { name: "Москва" })
        button.click()
        await page.waitForTimeout(1000)

        await page.waitForTimeout(1000)

        const submitButton = page.locator('#submit-button')

        submitButton.click()
        // Проверяем, что произошел переход на страницу выбора типа обмена
        await page.waitForURL(/\/exchange\/details/, { timeout: 5000 });
        expect(page.url()).toContain('/exchange/details');
  
    })
});




