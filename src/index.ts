import TelegramController from './controllers/TelegramController';

if (process.env.MODE === 'telegram') {
  // tslint:disable-next-line:no-unused-expression
  new TelegramController(String(process.env.TOKEN));
}
