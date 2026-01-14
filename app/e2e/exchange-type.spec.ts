import { test } from '@playwright/test';
import { supportButtonChecking } from './utils/support-button-checking';
import { rateModalChecking } from './utils/rate-modal-checking';
import { navigationButtonChecking } from './utils/navigation-button-checking';

test.describe('Exhcange Type Page - Страница выбора направления обмена', () => {
    test.setTimeout(240000); // Устанавливаем таймаут 2 минуты для всех тестов

    test.beforeEach(async ({ page }) => {

        await page.goto('http://localhost:3000/exchange/type');
        // Ждем полной загрузки страницы
        await page.waitForLoadState('networkidle');
    });

    test('1. Проверка селектора направления', async ({ page }) => {


        await rateModalChecking(page)

        await page.waitForTimeout(1000);

        const buttonsIdArr: string[] = ['given-COIN', 'given-BANK', 'given-CASH', 'received-COIN', 'received-BANK', 'received-CASH']

        buttonsIdArr.forEach(async id => {
            const button = page.locator(`#${id}`)

            if (id.includes('given')) {
                button.isVisible()

                if (id.includes('BANK') || id.includes('CASH')) {
                    button.click()
                    await page.waitForTimeout(1000)

                    buttonsIdArr.forEach(id => {
                        if (id.includes('received')) {
                            if (id.includes('COIN')) {
                                const receivedButton = page.locator(`#${id}`)

                                receivedButton.isVisible()
                            }
                        }
                    })
                } else if (id.includes('COIN')) {
                    console.log(id)

                    button.click()
                    await page.waitForTimeout(1000)
                    buttonsIdArr.forEach(id => {
                        if (id.includes('received')) {
                            if (id.includes('BANK') || id.includes('CASH')) {
                                console.log(id)
                                const receivedButton = page.locator(`#${id}`)
                                receivedButton.isVisible()
                            }
                        }
                    })
                }
            }

        })
        await page.waitForTimeout(5000);

    });

    test('2. Проверка вызова оператора на странице', async ({ page }) => {
        await rateModalChecking(page)

        // Даем время для обновления Redux store и рендеринга компонентов
        await page.waitForTimeout(1000);

        const supportButton = page.locator(`#exchange-type-page-support`)
        await supportButtonChecking(page, supportButton)

    });

    test('3. Проверка вызова оператора в модальном окне', async ({ page }) => {
        await rateModalChecking(page, async () => {
            const rateModalSupportButton = page.locator('#rate-modal-support-link')
            await supportButtonChecking(page, rateModalSupportButton)
        })

    });

    test('4. Проверка кнопки "Подтвердить выбор"', async ({ page }) => {
        await rateModalChecking(page)
        await navigationButtonChecking(page, 'Подтвердить выбор', '/exchange/input')
    });

});




