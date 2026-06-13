export const config = {
  // Bot Settings
  prefix: '.',
  owner: process.env.OWNER_NUMBER || '1234567890@s.whatsapp.net',
  ownerName: 'TILA TECH',
  botName: 'TILA TECH EMPIRE BOT',
  botVersion: '2.0.0',
  
  // Modes
  autoRead: true,
  autoDownload: true,
  commandMode: 'prefix', // 'prefix' or 'mention'
  
  // API Keys
  apiKeys: {
    openai: process.env.OPENAI_API_KEY,
    rapidapi: process.env.RAPIDAPI_KEY,
    youtube: process.env.YOUTUBE_API_KEY,
  },
  
  // Database
  mongodb: process.env.MONGODB_URI || 'mongodb://localhost:27017/tilatech',
  
  // Telegram Integration
  telegram: {
    enabled: true,
    token: process.env.TELEGRAM_BOT_TOKEN,
    chatId: process.env.TELEGRAM_CHAT_ID,
  },
  
  // Features
  features: {
    antilink: true,
    antibot: true,
    antispam: true,
    autoreply: true,
    economy: true,
  },
  
  // Rate Limiting
  rateLimit: {
    enabled: true,
    commandsPerMinute: 10,
    messagesPerMinute: 30,
  },
};
