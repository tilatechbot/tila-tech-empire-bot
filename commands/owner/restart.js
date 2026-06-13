export default {
  name: 'restart',
  description: 'Restart the bot',
  usage: '.restart',
  ownerOnly: true,
  
  execute: async (sock, msg, args) => {
    await sock.sendMessage(msg.key.remoteJid, {
      text: '⏳ Restarting bot...',
    });
    
    setTimeout(() => {
      process.exit(0);
    }, 2000);
  },
};
