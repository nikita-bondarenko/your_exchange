'use server';

import type { TelegramUser, TelegramWebAppData, TelegramWebAppValidationResult } from './types';

/**
 * Парсинг initData из строки Telegram WebApp
 */
export async function parseInitData(initDataString: string): Promise<TelegramWebAppData> {
    const params = new URLSearchParams(initDataString);
    const result: any = {};

    for (const [key, value] of params) {
        if (key === 'user' || key === 'receiver') {
            try {
                result[key] = JSON.parse(decodeURIComponent(value));
            } catch {
                result[key] = null;
            }
        } else {
            result[key] = decodeURIComponent(value);
        }
    }

    return result;
}

/**
 * Создание строки данных для проверки подписи (как требует Telegram)
 */
export async function createDataCheckString(data: TelegramWebAppData): Promise<string> {
    // Сортируем ключи и создаем строку
    const sortedKeys = Object.keys(data)
        .filter(key => key !== 'hash')
        .sort();

    return sortedKeys
        .map(key => `${key}=${data[key as keyof TelegramWebAppData]}`)
        .join('\n');
}

/**
 * Простая реализация HMAC SHA-256 для браузера и Node.js
 */
export async function hmacSHA256(key: string, message: string): Promise<string> {
    if (typeof window !== 'undefined' && window.crypto) {
        // Браузер
        const encoder = new TextEncoder();
        const keyData = encoder.encode(key);
        const messageData = encoder.encode(message);

        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );

        const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);

        return Array.from(new Uint8Array(signature))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    } else {
        // Node.js (для server actions)
        const crypto = require('crypto');
        return crypto.createHmac('sha256', key).update(message).digest('hex');
    }
}

/**
 * Валидация Telegram WebApp данных с проверкой подписи
 */
export async function validateTelegramWebAppData(
    initDataString: string,
    botToken: string
): Promise<TelegramWebAppValidationResult> {
    try {
        // Парсим initData
        const data = await parseInitData(initDataString);

        // Проверяем наличие обязательных полей
        if (!data.auth_date || !data.hash) {
            return { isValid: false, error: 'Missing required fields (auth_date or hash)' };
        }

        // Проверяем время (не более 24 часов)
        const currentTime = Math.floor(Date.now() / 1000);
        const authAge = currentTime - Number(data.auth_date);
        const maxAge = 24 * 60 * 60; // 24 часа в секундах

        if (authAge > maxAge) {
            return { isValid: false, error: 'Auth data too old', user: data.user };
        }


        // Создаем секретный ключ из токена бота
        const secretKey = await hmacSHA256('WebAppData', botToken);



        // Создаем строку для проверки
        const dataCheckString = await createDataCheckString(data);

        // Вычисляем хеш
        const expectedHash = await hmacSHA256(secretKey, dataCheckString);

        console.log('data', data)
        console.log('botToken', botToken)
        console.log('secretKey', secretKey)

        console.log('dataCheckString', dataCheckString)

        console.log('expectedHash', expectedHash)




        // Сравниваем хеши (чувствительно к регистру)
        if (expectedHash !== data.hash) {
            return { isValid: false, error: 'Invalid hash signature', user: data.user };
        }

        // Проверяем пользователя
        if (!data.user) {
            return { isValid: false, error: 'No user data in initData' };
        }

        return {
            isValid: true,
            user: data.user,
            queryId: data.query_id
        };

    } catch (error) {
        return { isValid: false, error: `Validation error: ${error}` };
    }
}

/**
 * Главная функция валидации для Server Actions
 * Нужно передать initData из клиента
 */
export async function verifyTelegramWebApp(
    initData: string,
    botToken?: string
): Promise<TelegramWebAppValidationResult> {
    // Получаем токен из переменных окружения или параметра
    const token = botToken || process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
        return { isValid: false, error: 'Bot token not configured. Set TELEGRAM_BOT_TOKEN env variable.' };
    }

    return validateTelegramWebAppData(initData, token);
}

/**
 * Валидация с автоматическим получением userId
 */
export async function validateAndGetUserId(
    initData: string,
    botToken?: string
): Promise<{ isValid: boolean; userId?: number; error?: string }> {
    const result = await verifyTelegramWebApp(initData, botToken);

    if (!result.isValid || !result.user) {
        return { isValid: false, error: result.error };
    }

    return {
        isValid: true,
        userId: result.user.id
    };
}

/**
 * Middleware-функция для использования в API actions
 * Защищает от прямых вызовов без Telegram WebApp
 */
export async function requireTelegramAuth(
    initData?: string
): Promise<TelegramUser> {
    if (!initData) {
        throw new Error('Telegram WebApp initData required');
    }

    const result = await verifyTelegramWebApp(initData);

    if (!result.isValid || !result.user) {
        throw new Error(`Unauthorized: ${result.error}`);
    }

    return result.user;
}

