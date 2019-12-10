// @ts-ignore
import Telegraf, { ContextMessageUpdate } from 'telegraf';

import AppContext from './AppContext';
import TelegramController from './TelegramController';
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

  constructor(private token: string) {
    TelegramBotRunner.getController = TelegramBotRunner.getController.bind(this);
    this.run = this.run.bind(this);

    this.bot = new Telegraf(String(token));
  }

  public run() {
    const middleware = applyMiddleware([loggingMessagesMiddleware, loggingErrorMiddleware]);

    this.bot.start(middleware(this.onStart));
    this.bot.help(middleware(this.onHelp));
    this.bot.command('run', middleware(this.onRun));
    this.bot.command('stop', middleware(this.onStop));
    this.bot.command('status', middleware(this.onStatus));
    this.bot.command('set_timer', middleware(this.onSetTimerSettings));
    this.bot.command('next', middleware(this.onNext));
    this.bot.command('automatic', middleware(this.onAutomatic));
    this.bot.launch().catch(this.onError);
  }

  private onStart = (ctx: ContextMessageUpdate) => {
    const controller = TelegramBotRunner.getController(ctx);
    controller.onStart();
  };

  private onHelp = (ctx: ContextMessageUpdate) => {
    ctx.reply(help).catch();
  };

  private onRun = (ctx: ContextMessageUpdate) => {
    const controller = TelegramBotRunner.getController(ctx);
    controller.onRun();
  };

  private onStop = (ctx: ContextMessageUpdate) => {
    const controller = TelegramBotRunner.getController(ctx);
    controller.onStop();
    AppContext.getContext().removeTelegramController(ctx);
  };

  private onStatus = (ctx: ContextMessageUpdate) => {
    const controller = TelegramBotRunner.getController(ctx);
    controller.onGetStatus();
  };

  private onSetTimerSettings = (ctx: ContextMessageUpdate) => {
    const controller = TelegramBotRunner.getController(ctx);
    controller.onSetTimerSettings(ctx.message.text);
  };

  private onNext = (ctx: ContextMessageUpdate) => {
    const controller = TelegramBotRunner.getController(ctx);
    controller.onNext();
  };

  private onAutomatic = (ctx: ContextMessageUpdate) => {
    const controller = TelegramBotRunner.getController(ctx);
    controller.onSetAutomaticTick();
  };

  private onError = (error: any) => {
    // tslint:disable-next-line:no-console
    console.log(error);

    AppContext.getContext().clearTelegramController();

    // tslint:disable-next-line:no-console
    console.log('The end:(');
  };
}
