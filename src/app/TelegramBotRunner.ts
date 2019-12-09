// @ts-ignore
import Telegraf, { ContextMessageUpdate } from 'telegraf';

import AppContext from './AppContext';
import Middleware from '../classes/utils/Middleware';
import TelegramController from '../controllers/TelegramController';
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

export default class TelegramBotRunner {
  private static getController(ctx: ContextMessageUpdate): TelegramController {
    return AppContext.getContext().getTelegramController(ctx);
  }

  private readonly bot: Telegraf<ContextMessageUpdate>;
  private readonly middleware: Middleware;

  constructor(private token: string) {
    TelegramBotRunner.getController = TelegramBotRunner.getController.bind(this);
    this.run = this.run.bind(this);

    this.bot = new Telegraf(String(token));
    this.middleware = applyMiddleware([loggingMessagesMiddleware, loggingErrorMiddleware]);
  }

  public run() {
    this.bot.start(
      this.middleware((ctx: ContextMessageUpdate) => {
        const controller = TelegramBotRunner.getController(ctx);
        controller.onStart();
      }),
    );

    this.bot.help(
      this.middleware((ctx: ContextMessageUpdate) => {
        ctx.reply(help).catch();
      }),
    );

    this.bot.command(
      'run',
      this.middleware((ctx: ContextMessageUpdate) => {
        const controller = TelegramBotRunner.getController(ctx);
        controller.onRun();
      }),
    );

    this.bot.command(
      'stop',
      this.middleware((ctx: ContextMessageUpdate) => {
        const controller = TelegramBotRunner.getController(ctx);
        controller.onStop();
        AppContext.getContext().removeTelegramController(ctx);
      }),
    );

    this.bot.command(
      'status',
      this.middleware((ctx: ContextMessageUpdate) => {
        const controller = TelegramBotRunner.getController(ctx);
        controller.onGetStatus();
      }),
    );

    this.bot.command(
      'set_timer',
      this.middleware((ctx: ContextMessageUpdate) => {
        const controller = TelegramBotRunner.getController(ctx);
        controller.onSetTimerSettings(ctx.message.text);
      }),
    );

    this.bot.command(
      'next',
      this.middleware((ctx: ContextMessageUpdate) => {
        const controller = TelegramBotRunner.getController(ctx);
        controller.onNext();
      }),
    );

    this.bot.command(
      'automatic',
      this.middleware((ctx: ContextMessageUpdate) => {
        const controller = TelegramBotRunner.getController(ctx);
        controller.onSetAutomaticTick();
      }),
    );

    this.bot.launch().catch((error: any) => {
      // tslint:disable-next-line:no-console
      console.log(error);

      AppContext.getContext().clearTelegramController();

      // tslint:disable-next-line:no-console
      console.log('The end:(');
    });
  }
}
