import runTelegramBot from './utils/runTelegramBot';

if (process.env.MODE === 'telegram') {
  runTelegramBot(String(process.env.TOKEN));
}
