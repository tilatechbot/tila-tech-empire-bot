import chalk from 'chalk';

export const logger = {
  info: (msg) => console.log(`${chalk.blue('ℹ')} ${msg}`),
  success: (msg) => console.log(`${chalk.green('✓')} ${msg}`),
  warn: (msg) => console.log(`${chalk.yellow('⚠')} ${msg}`),
  error: (msg) => console.log(`${chalk.red('✗')} ${msg}`),
  debug: (msg) => console.log(`${chalk.cyan('🐛')} ${msg}`),
};
