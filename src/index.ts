import TelegramBotRunner from './app/TelegramBotRunner';

if (process.env.MODE === 'telegram') {
  new TelegramBotRunner(String(process.env.TOKEN)).run();
}
