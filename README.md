# TILA TECH EMPIRE BOT

> A powerful WhatsApp & Telegram automation bot with 2000+ commands, featuring group management, AI integration, media downloaders, and more.

## Features

✨ **2000+ Commands** across 15+ categories
🤖 **AI Integration** - GPT, Image Generation, Translation
🎮 **Gaming System** - Math, Guess, Trivia, TicTacToe
💰 **Economy System** - Balance, Daily Rewards, Work
📥 **Media Downloads** - YouTube, TikTok, Instagram
🔒 **Security** - Anti-spam, Anti-link, Anti-raid
💬 **Telegram Integration** - Bridge WhatsApp and Telegram
👥 **Group Management** - Kick, Add, Promote, Demote

## Installation

```bash
# Clone repository
git clone https://github.com/tilatechbot/tila-tech-empire-bot.git
cd tila-tech-empire-bot

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start bot
npm start
```

## Configuration

Edit `.env` file:

```env
OWNER_NUMBER=your_number@s.whatsapp.net
OPENAI_API_KEY=your_api_key
TELEGRAM_BOT_TOKEN=your_telegram_token
MONGODB_URI=your_mongodb_uri
```

## Usage

Command prefix: `.`

```
.ping          - Check bot response
.menu          - Show all commands
.chat <msg>    - Chat with AI
.kick @user    - Kick group member
.play <query>  - Download music
.joke          - Get a joke
```

## Directory Structure

```
.
├── index.js                 # Main bot engine
├── config.js               # Configuration
├── package.json            # Dependencies
├── lib/
│   ├── commandHandler.js   # Command loader
│   ├── database.js         # MongoDB setup
│   ├── logger.js           # Logging
│   └── utils.js            # Utilities
└── commands/
    ├── system/             # Core commands
    ├── ai/                 # AI features
    ├── group/              # Group management
    ├── download/           # Media downloaders
    ├── fun/                # Fun commands
    ├── games/              # Games
    ├── economy/            # Economy system
    ├── media/              # Media tools
    ├── utility/            # Utilities
    ├── owner/              # Owner commands
    └── banned/             # Ban system
```

## Technology Stack

- **Baileys** - WhatsApp Web API
- **Telegram Bot API** - Telegram Integration
- **Express.js** - Web Server
- **MongoDB** - Database
- **Node.js** - Runtime

## Commands

### System
- `.ping` - Response time
- `.alive` - Bot status
- `.uptime` - Bot uptime
- `.menu` - Commands list

### AI
- `.chat <msg>` - Chat AI
- `.gpt <msg>` - GPT-4
- `.imagine <prompt>` - Image generation
- `.translate <lang> <text>` - Translation

### Group
- `.kick @user` - Remove member
- `.add +number` - Add member
- `.promote @user` - Make admin
- `.demote @user` - Remove admin
- `.tagall` - Mention everyone

### More features coming soon...

## Support

For issues, create a GitHub issue or contact the developer.

## License

MIT License - See LICENSE file

## Author

**tilatechbot** - TILA TECH
