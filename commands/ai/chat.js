export default {
  name: 'chat',
  description: 'Chat with AI',
  usage: '.chat <message>',
  
  execute: async (sock, msg, args) => {
    if (!args.length) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ Please provide a message',
      });
    }
    
    const message = args.join(' ');
    
    await sock.sendMessage(msg.key.remoteJid, {
      text: `🤖 AI Response:\n\n${message} (Echo - Replace with real AI)`,
    });
  },
};
