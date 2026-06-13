import './lib/logger.js';
import { makeWASocket, useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import { config } from './config.js';
import { loadCommands, handleCommand } from './lib/commandHandler.js';
import { logger } from './lib/logger.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let sock;
let commands = {};
let bot;

// Initialize Express Server
const app = express();
app.use(express.json());

// Telegram Bot Initialization
if (config.telegram.enabled && config.telegram.token) {
  bot = new TelegramBot(config.telegram.token, { polling: true });
  
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    
    logger.info(`[TELEGRAM] ${msg.from.first_name}: ${text}`);
    
    if (text?.startsWith('/start')) {
      bot.sendMessage(chatId, 
        `👋 Welcome to TILA TECH EMPIRE BOT!\n\n` +
        `This bot bridges WhatsApp and Telegram.\n` +
        `Type /help for available commands.`
      );
    }
  });
  
  logger.info('✅ Telegram Bot Connected');
}

// WhatsApp Connection
async function connectWhatsApp() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState('sessions');
    
    sock = makeWASocket({
      auth: state,
      printQRInTerminal: true,
      logger: logger,
      browser: ['Ubuntu', 'Chrome', '120.0'],
    });
    
    // Event: Update Credentials
    sock.ev.on('creds.update', saveCreds);
    
    // Event: Connection Update
    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;
      
      if (qr) {
        logger.info('📱 Scan QR Code with WhatsApp to login');
      }
      
      if (connection === 'open') {
        logger.success('✅ WhatsApp Connected Successfully!');
      }
      
      if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        logger.error(`❌ WhatsApp Disconnected. Reconnecting: ${shouldReconnect}`);
        if (shouldReconnect) {
          setTimeout(connectWhatsApp, 5000);
        }
      }
    });
    
    // Event: Messages
    sock.ev.on('messages.upsert', async (m) => {
      if (m.type === 'notify') {
        for (const msg of m.messages) {
          try {
            const messageText = msg.message?.conversation || 
                               msg.message?.extendedTextMessage?.text || 
                               '';
            
            const senderId = msg.key.remoteJid;
            const isGroup = senderId.endsWith('@g.us');
            
            logger.info(`📩 ${senderId}: ${messageText}`);
            
            if (!messageText.startsWith(config.prefix)) return;
            
            const args = messageText.slice(config.prefix.length).trim().split(' ');
            const cmdName = args[0].toLowerCase();
            
            await handleCommand(sock, msg, cmdName, args, commands);
            
          } catch (err) {
            logger.error(`Command Error: ${err.message}`);
          }
        }
      }
    });
    
    // Load all commands
    commands = await loadCommands(path.join(__dirname, 'commands'));
    logger.success(`✅ Loaded ${Object.keys(commands).length} commands`);
    
  } catch (err) {
    logger.error(`Connection Error: ${err.message}`);
    setTimeout(connectWhatsApp, 5000);
  }
}

// API Endpoints
app.get('/status', (req, res) => {
  res.json({
    status: sock?.user ? 'connected' : 'disconnected',
    bot: config.botName,
    version: config.botVersion,
    commands: Object.keys(commands).length,
  });
});

app.post('/telegram/webhook', (req, res) => {
  const msg = req.body.message;
  logger.info(`[TELEGRAM WEBHOOK] ${msg?.text}`);
  res.json({ ok: true });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
});

// Connect WhatsApp
connectWhatsApp();

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
});
