// @ts-ignore
import Telegraf, { ContextMessageUpdate } from 'telegraf';

import AppContext from './AppContext';
import applyMiddleware from '../utils/applyMiddleware';
import loggingErrorMiddleware from '../utils/loggingErrorMiddleware';
import loggingMessagesMiddleware from '../utils/loggingMessagesMiddleware';

const help = `
Команды:
  /start - запуск бота
  /set_timer <timer> - установка настроек таймера. timer: default | test | tease
  /automatic - включение/выключение автоматического перехода к следующему таймеру
  /run - запуск таймера
  /next - перейти к следующему шагу
  /status - показать текущий статус таймера
  /stop - остановка таймера
`;

export default function runTelegramBot(token: string) {
  const bot = new Telegraf(String(token));

  const middleware = applyMiddleware([loggingMessagesMiddleware, loggingErrorMiddleware]);

  bot.start(
    middleware((ctx: ContextMessageUpdate) => {
      const controller = AppContext.getContext().getTelegramController(ctx);
      controller.onStart();
    }),
  );

  bot.help(
    middleware((ctx: ContextMessageUpdate) => {
      ctx.reply(help).catch();
    }),
  );

  bot.command(
    'run',
    middleware((ctx: ContextMessageUpdate) => {
      const controller = AppContext.getContext().getTelegramController(ctx);
      controller.onRun();
    }),
  );

  bot.command(
    'stop',
    middleware((ctx: ContextMessageUpdate) => {
      const controller = AppContext.getContext().getTelegramController(ctx);
      controller.onStop();
      AppContext.getContext().removeTelegramController(ctx);
    }),
  );

  bot.command(
    'status',
    middleware((ctx: ContextMessageUpdate) => {
      const controller = AppContext.getContext().getTelegramController(ctx);
      controller.onGetStatus();
    }),
  );

  bot.command(
    'set_timer',
    middleware((ctx: ContextMessageUpdate) => {
      const controller = AppContext.getContext().getTelegramController(ctx);
      controller.onSetTimerSettings(ctx.message.text);
    }),
  );

  bot.command(
    'next',
    middleware((ctx: ContextMessageUpdate) => {
      const controller = AppContext.getContext().getTelegramController(ctx);
      controller.onNext();
    }),
  );

  bot.command(
    'automatic',
    middleware((ctx: ContextMessageUpdate) => {
      const controller = AppContext.getContext().getTelegramController(ctx);
      controller.onSetAutomaticTick();
    }),
  );

  bot.launch().catch((error: any) => {
    // tslint:disable-next-line:no-console
    console.log(error);

    AppContext.getContext().clearTelegramController();

    // tslint:disable-next-line:no-console
    console.log('The end:(');
  });
}
