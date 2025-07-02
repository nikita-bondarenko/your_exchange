'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void
        expand: () => void
        close: () => void
        showPopup: (params: { title: string; message: string; buttons?: Array<{ id: string; type: string; text: string }> }) => void
        showAlert: (message: string, callback?: () => void) => void
        showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void
        MainButton: {
          text: string
          color: string
          textColor: string
          isVisible: boolean
          isActive: boolean
          isProgressVisible: boolean
          setText: (text: string) => void
          onClick: (callback: () => void) => void
          offClick: (callback: () => void) => void
          show: () => void
          hide: () => void
          enable: () => void
          disable: () => void
          showProgress: (leaveActive: boolean) => void
          hideProgress: () => void
        }
        BackButton: {
          isVisible: boolean
          onClick: (callback: () => void) => void
          offClick: (callback: () => void) => void
          show: () => void
          hide: () => void
        }
        initData: string
        initDataUnsafe: {
          query_id?: string
          user?: {
            id: number
            first_name: string
            last_name?: string
            username?: string
            language_code?: string
          }
          receiver?: {
            id: number
            first_name: string
            last_name?: string
            username?: string
            language_code?: string
          }
          chat?: {
            id: number
            type: string
            title?: string
            username?: string
            first_name?: string
            last_name?: string
          }
          start_param?: string
          auth_date: number
          hash: string
        }
        colorScheme: 'light' | 'dark'
        themeParams: {
          bg_color?: string
          text_color?: string
          hint_color?: string
          link_color?: string
          button_color?: string
          button_text_color?: string
        }
        platform: string
        version: string
        isExpanded: boolean
        viewportHeight: number
        viewportStableHeight: number
        headerColor: string
        backgroundColor: string
        isClosingConfirmationEnabled: boolean
        enableClosingConfirmation: () => void
        disableClosingConfirmation: () => void
        onEvent: (eventType: string, eventHandler: () => void) => void
        offEvent: (eventType: string, eventHandler: () => void) => void
        sendData: (data: any) => void
        openLink: (url: string, options?: { try_instant_view?: boolean }) => void
        openTelegramLink: (url: string) => void
        openInvoice: (url: string, callback?: (status: string) => void) => void
        setHeaderColor: (color: string) => void
        setBackgroundColor: (color: string) => void
      }
    }
  }
}

export function useTelegramWebApp() {
  const [webApp, setWebApp] = useState<typeof window.Telegram.WebApp | null>(null)
  const [isReady, setIsReady] = useState(false)

  // useEffect(() => {
  //   if (typeof window === 'undefined') return

  //   const initWebApp = () => {
  //     if (window.Telegram?.WebApp) {
  //       const tg = window.Telegram.WebApp
  //       tg.ready()
  //       tg.expand()
  //       setWebApp(tg)
  //       setIsReady(true)
  //     }
  //   }

  //   // Если скрипт уже загружен
  //   if (window.Telegram?.WebApp) {
  //     initWebApp()
  //   } else {
  //     // Если скрипт еще не загружен, ждем его загрузки
  //     const script = document.createElement('script')
  //     script.src = 'https://telegram.org/js/telegram-web-app.js'
  //     script.async = true
  //     script.onload = initWebApp
  //     document.body.appendChild(script)

  //     return () => {
  //       document.body.removeChild(script)
  //     }
  //   }
  // }, [])

  return { webApp, isReady }
}
