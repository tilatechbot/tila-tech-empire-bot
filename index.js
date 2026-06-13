import './lib/logger.js';
import { makeWASocket, useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import express from 'express';
import { config } from './config.js';
import { loadCommands, handleCommand } from './lib/commandHandler.js';
import { logger } from './lib/logger.js';
import { initTelegramBot, sendTelegramMessage } from './telegram/index.js';
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WhatsApp Connection
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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
        // Send QR to Telegram if available
        if (bot && config.telegram.chatId) {
          sendTelegramMessage(config.telegram.chatId,
            '📱 *WhatsApp QR Code Available*\n\n' +
            'Scan with your WhatsApp device to connect.'
          ).catch(() => {});
        }
      }
      
      if (connection === 'open') {
        logger.success('✅ WhatsApp Connected Successfully!');
        if (bot && config.telegram.chatId) {
          sendTelegramMessage(config.telegram.chatId,
            '✅ *WhatsApp Connected!*\n\n' +
            '🟢 Status: ONLINE'
          ).catch(() => {});
        }
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
            const senderName = msg.pushName || 'Unknown';
            
            logger.info(`📩 [${isGroup ? 'GROUP' : 'DM'}] ${senderName}: ${messageText}`);
            
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
    logger.success(`✅ Loaded ${Object.keys(commands).length} WhatsApp commands`);
    
  } catch (err) {
    logger.error(`Connection Error: ${err.message}`);
    setTimeout(connectWhatsApp, 5000);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Telegram Bot Initialization
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function initTelegram() {
  try {
    bot = await initTelegramBot(sock);
    if (bot) {
      logger.success('✅ Telegram Bot Initialized');
    }
  } catch (err) {
    logger.error(`Telegram Error: ${err.message}`);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REST API Endpoints
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * GET /status - System status
 */
app.get('/status', (req, res) => {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  
  res.json({
    status: 'online',
    bot: config.botName,
    version: config.botVersion,
    whatsapp: {
      connected: sock?.user ? 'connected' : 'disconnected',
      user: sock?.user?.name || 'Not connected',
    },
    telegram: {
      enabled: config.telegram.enabled,
      connected: bot ? 'connected' : 'disconnected',
    },
    commands: Object.keys(commands).length,
    uptime: `${hours}h ${minutes}m`,
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /health - Health check
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/commands - List all commands
 */
app.get('/api/commands', (req, res) => {
  const cmdList = Object.entries(commands).map(([name, cmd]) => ({
    name,
    category: cmd.category,
    description: cmd.description,
    usage: cmd.usage,
    ownerOnly: cmd.ownerOnly,
    groupOnly: cmd.groupOnly,
  }));
  
  res.json({
    total: cmdList.length,
    commands: cmdList,
  });
});

/**
 * POST /telegram/webhook - Telegram webhook (optional)
 */
app.post('/telegram/webhook', (req, res) => {
  const msg = req.body.message;
  logger.info(`[TELEGRAM WEBHOOK] ${msg?.text}`);
  res.json({ ok: true });
});

/**
 * GET /api/whatsapp/info - WhatsApp connection info
 */
app.get('/api/whatsapp/info', (req, res) => {
  if (!sock?.user) {
    return res.status(400).json({ error: 'WhatsApp not connected' });
  }
  
  res.json({
    connected: true,
    name: sock.user.name,
    jid: sock.user.id,
    status: 'online',
  });
});

/**
 * GET /metrics - System metrics
 */
app.get('/metrics', (req, res) => {
  const memory = process.memoryUsage();
  
  res.json({
    uptime: process.uptime(),
    memory: {
      heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memory.heapTotal / 1024 / 1024),
      external: Math.round(memory.external / 1024 / 1024),
    },
    cpuUsage: process.cpuUsage(),
    nodeVersion: process.version,
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Error Handling
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.use((err, req, res, next) => {
  logger.error(`API Error: ${err.message}`);
  res.status(500).json({ error: err.message });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Server Startup
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📍 Base URL: http://localhost:${PORT}`);
  logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Connect WhatsApp
  logger.info('📱 Connecting WhatsApp...');
  connectWhatsApp();
  
  // Initialize Telegram (wait 2 seconds for WhatsApp to start)
  setTimeout(() => {
    logger.info('🤖 Initializing Telegram Bridge...');
    initTelegram();
  }, 2000);
  
  logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Graceful Shutdown
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

process.on('SIGINT', () => {
  logger.warn('\n⏹️ Shutting down gracefully...');
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  logger.error(`💥 Uncaught Exception: ${err.message}`);
  logger.error(err.stack);
});

process.on('unhandledRejection', (err) => {
  logger.error(`⚠️ Unhandled Rejection: ${err}`);
});
