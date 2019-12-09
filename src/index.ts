import runTelegramBot from './app/runTelegramBot';

if (process.env.MODE === 'telegram') {
  runTelegramBot(String(process.env.TOKEN));
}
