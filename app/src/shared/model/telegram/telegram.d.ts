interface TelegramWebApp {
    ready: () => void;
    expand: () => void;
    close: () => void;
    initData: string;
    initDataUnsafe: Record<string, any>;
    version: string;
    platform: string;
       
  }
  
  interface Telegram {
    WebApp: TelegramWebApp;
  }
  
  declare global {
    interface Window {
      Telegram?: Telegram;
    }
  }
  
  export {};