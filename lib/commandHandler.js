import fs from 'fs/promises';
import path from 'path';
import { logger } from './logger.js';

export async function loadCommands(commandsDir) {
  const commands = {};
  
  try {
    const categories = await fs.readdir(commandsDir);
    
    for (const category of categories) {
      const categoryPath = path.join(commandsDir, category);
      const stat = await fs.stat(categoryPath);
      
      if (stat.isDirectory()) {
        const files = await fs.readdir(categoryPath);
        
        for (const file of files) {
          if (file.endsWith('.js')) {
            try {
              const filePath = path.join(categoryPath, file);
              const { default: command } = await import(`file://${filePath}`);
              const cmdName = file.replace('.js', '');
              
              commands[cmdName] = {
                ...command,
                category,
              };
              
              logger.debug(`Loaded: ${category}/${cmdName}`);
            } catch (err) {
              logger.error(`Failed to load ${file}: ${err.message}`);
            }
          }
        }
      }
    }
  } catch (err) {
    logger.error(`Error loading commands: ${err.message}`);
  }
  
  return commands;
}

export async function handleCommand(sock, msg, cmdName, args, commands) {
  const command = commands[cmdName];
  
  if (!command) {
    logger.warn(`Command not found: ${cmdName}`);
    return;
  }
  
  try {
    if (command.ownerOnly && msg.key.remoteJid !== process.env.OWNER_NUMBER) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ This command is for owner only!',
      });
      return;
    }
    
    if (command.groupOnly && !msg.key.remoteJid.endsWith('@g.us')) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ This command can only be used in groups!',
      });
      return;
    }
    
    if (command.dmOnly && msg.key.remoteJid.endsWith('@g.us')) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ This command can only be used in DMs!',
      });
      return;
    }
    
    await command.execute(sock, msg, args);
    logger.success(`Command executed: ${cmdName}`);
    
  } catch (err) {
    logger.error(`Command error (${cmdName}): ${err.message}`);
    await sock.sendMessage(msg.key.remoteJid, {
      text: `❌ Error: ${err.message}`,
    }).catch(() => {});
  }
}
