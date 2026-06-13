# 🚀 INSTALLATION & SETUP GUIDE

## Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Telegram Bot Token** (from @BotFather)
- **WhatsApp Account** (on your phone)

---

## 📥 Installation Steps

### 1. Clone Repository

```bash
git clone https://github.com/tilatechbot/tila-tech-empire-bot.git
cd tila-tech-empire-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# WhatsApp Bot Configuration
OWNER_NUMBER=1234567890@s.whatsapp.net
OWNER_NAME=TILA TECH

# API Keys
OPENAI_API_KEY=sk-your-openai-key
RAPIDAPI_KEY=your-rapidapi-key
YOUTUBE_API_KEY=your-youtube-key

# Database
MONGODB_URI=mongodb://localhost:27017/tilatech

# Telegram Integration (IMPORTANT)
TELEGRAM_BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN_HERE
TELEGRAM_CHAT_ID=YOUR_CHAT_ID_HERE

# Server
PORT=3000
NODE_ENV=production
```

### 4. Get Telegram Bot Token

1. Open Telegram and search for **@BotFather**
2. Send `/newbot`
3. Follow the prompts
4. Copy the **API Token**
5. Paste in `.env` as `TELEGRAM_BOT_TOKEN`

### 5. Start the Bot

```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

---

## 🔗 Telegram Bot Connection

Once the bot starts, you'll see:

```
🚀 Server running on port 3000
📱 Connecting WhatsApp...
🤖 Initializing Telegram Bridge...
✅ Telegram Bot Bridge System Ready
```

### Connect via Telegram:

1. Open Telegram
2. Search for your bot (the one you created with BotFather)
3. Send `/start`
4. Choose connection method:
   - **🔗 Connect WhatsApp** - QR code method (fastest)
   - **📲 Pair Phone** - Phone number method
5. Follow the prompts

---

## ⚙️ Configuration Options

### Bot Settings (config.js)

```javascript
config = {
  // Bot Settings
  prefix: '.',              // Command prefix
  owner: process.env.OWNER_NUMBER,
  ownerName: 'TILA TECH',
  botName: 'TILA TECH EMPIRE BOT',
  botVersion: '2.0.0',
  
  // Telegram
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
```

---

## 📱 WhatsApp Connection Methods

### Method 1: QR Code (Recommended)

```
User → /connect
    ↓
Bot generates QR code
    ↓
User scans with WhatsApp
    ↓
✅ Connected!
```

**Pros:**
- Fastest method
- No phone number needed
- More secure

**Cons:**
- QR expires in 2 minutes
- Requires WhatsApp Linked Devices

### Method 2: Phone Number

```
User → /pair
    ↓
User enters: +1234567890
    ↓
Bot sends OTP to WhatsApp
    ↓
User enters 6-digit OTP
    ↓
✅ Connected!
```

**Pros:**
- No QR code needed
- More time to verify
- Works on any device

**Cons:**
- Slightly slower
- OTP expires in 5 minutes

---

## 🔍 Verify Installation

### Check Status

```bash
curl http://localhost:3000/status
```

**Response:**
```json
{
  "status": "online",
  "bot": "TILA TECH EMPIRE BOT",
  "version": "2.0.0",
  "whatsapp": {
    "connected": "connected",
    "user": "John Doe"
  },
  "telegram": {
    "enabled": true,
    "connected": "connected"
  },
  "commands": 50,
  "uptime": "0h 5m"
}
```

### Health Check

```bash
curl http://localhost:3000/health
```

### List Commands

```bash
curl http://localhost:3000/api/commands
```

---

## 🐛 Troubleshooting

### Telegram Bot Not Responding

**Problem:** Bot doesn't respond to `/start`

**Solution:**
1. Check `TELEGRAM_BOT_TOKEN` in `.env`
2. Verify token with @BotFather
3. Restart bot: `npm start`
4. Check console for errors

### WhatsApp Not Connecting

**Problem:** WhatsApp QR code not appearing

**Solution:**
1. Check Baileys is installed: `npm install @whiskeysockets/baileys`
2. Ensure sessions folder exists
3. Check internet connection
4. Try phone number pairing instead

### Port Already in Use

**Problem:** "Port 3000 already in use"

**Solution:**
```bash
# Use different port
PORT=3001 npm start

# Or kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### MongoDB Connection Failed

**Problem:** Database won't connect

**Solution:**
1. Ensure MongoDB is running
2. Check `MONGODB_URI` in `.env`
3. Verify connection string format
4. Check network access

---

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/status` | GET | System status |
| `/health` | GET | Health check |
| `/api/commands` | GET | List all commands |
| `/api/whatsapp/info` | GET | WhatsApp info |
| `/metrics` | GET | System metrics |
| `/telegram/webhook` | POST | Telegram webhook |

---

## 🚀 Deployment

### Heroku

```bash
# 1. Install Heroku CLI
# 2. Login
heroku login

# 3. Create app
heroku create your-app-name

# 4. Set environment variables
heroku config:set TELEGRAM_BOT_TOKEN=your_token
heroku config:set MONGODB_URI=your_uri

# 5. Deploy
git push heroku main
```

### Railway

1. Push to GitHub
2. Connect GitHub repo to Railway
3. Add environment variables
4. Deploy

### Docker

```bash
# Build image
docker build -t tila-bot .

# Run container
docker run -e TELEGRAM_BOT_TOKEN=your_token -p 3000:3000 tila-bot
```

---

## 📝 Commands Usage

### WhatsApp Commands

```
.ping           - Check response time
.alive          - Bot status
.menu           - Show commands
.kick @user     - Remove user from group
.chat <msg>     - Chat with AI
```

### Telegram Commands

```
/start          - Welcome menu
/connect        - QR code linking
/pair           - Phone linking
/status         - System status
/help           - Help menu
/settings       - Settings
/menu           - Main menu
```

---

## 🔒 Security Tips

1. **Never share your tokens** in code or public repos
2. **Use `.env` file** for sensitive data
3. **Add `.env` to `.gitignore`** (already done)
4. **Regenerate tokens** if compromised
5. **Use strong passwords** for database
6. **Enable 2FA** on Telegram account
7. **Monitor API usage** regularly

---

## 📞 Support

- **GitHub Issues:** [Create issue](https://github.com/tilatechbot/tila-tech-empire-bot/issues)
- **Telegram:** [@tilatechbot](https://t.me/tilatechbot)
- **Email:** support@tilatech.com

---

## 📚 Documentation

- [Telegram Bridge Guide](./TELEGRAM_BRIDGE.md)
- [API Documentation](./API.md)
- [Contributing Guide](./CONTRIBUTING.md)

---

**Happy Coding! 🎉**
