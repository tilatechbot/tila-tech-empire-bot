import { config } from '../../config.js';

export default {
  name: 'menu',
  description: 'Show all commands',
  usage: '.menu [category]',
  
  execute: async (sock, msg, args) => {
    const menu = `
╭━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${config.botName}
┃  v${config.botVersion}
╰━━━━━━━━━━━━━━━━━━━━━━╯

📚 *COMMAND CATEGORIES*

1️⃣  System (.ping, .alive, .status)
2️⃣  AI (.chat, .gpt, .imagine)
3️⃣  Group (.kick, .add, .promote)
4️⃣  Download (.play, .ytmp3, .tiktok)
5️⃣  Fun (.joke, .meme, .truth)
6️⃣  Games (.math, .guess, .quiz)
7️⃣  Economy (.balance, .daily, .work)
8️⃣  Media (.sticker, .toimg, .tts)
9️⃣  Utility (.qr, .calc, .weather)
🔟 Owner (.ban, .broadcast, .restart)

🔗 Type: .menu <category>
    `;
    
    await sock.sendMessage(msg.key.remoteJid, { text: menu });
  },
};
