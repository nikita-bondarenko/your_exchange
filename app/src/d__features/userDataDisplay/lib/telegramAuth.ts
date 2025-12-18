'use server';

import { validateAndGetUserId } from '@/shared/lib/telegram/validateTelegramWebApp';

/**
 * Аутентификация через Telegram WebApp
 * Эта функция должна вызываться в начале каждого API действия
 */
export async function authenticateUser(initData: string): Promise<number> {
    // Валидируем initData и получаем userId
    const result = await validateAndGetUserId(initData);

    if (!result.isValid || !result.userId) {
        throw new Error(`Authentication failed: ${result.error}`);
    }

    return result.userId;
}

/**
 * Безопасный wrapper для API действий
 * Используйте эту функцию для защиты всех критичных операций
 */
export async function withTelegramAuth<T>(
    initData: string,
    action: (userId: number) => Promise<T>
): Promise<T> {
    const userId = await authenticateUser(initData);
    return await action(userId);
}

/**
 * Обновленная версия createTrackingSessionAction с Telegram верификацией
 */
// legacy wrappers оставлены для совместимости, но не используются
