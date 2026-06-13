export default {
  name: 'kick',
  description: 'Kick member from group',
  usage: '.kick @user',
  groupOnly: true,
  
  execute: async (sock, msg, args) => {
    if (!msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ Please mention a user to kick',
      });
    }
    
    const target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    
    await sock.groupParticipantsUpdate(msg.key.remoteJid, [target], 'remove');
    await sock.sendMessage(msg.key.remoteJid, {
      text: `✅ User removed from group`,
    });
  },
};
