// @ts-ignore
import { ContextMessageUpdate } from 'telegraf';
import MessageQueue from './MessageQueue';
import PomodoroTimer from './PomodoroTimer';
import TelegramController from './TelegramController';
import UserService from './UserService';

export default class AppContext {
  public static getContext = (): AppContext => AppContext.context;

  public static getMessageQueue(ctx: ContextMessageUpdate) {
    return new MessageQueue(ctx);
  }

  private static context = new AppContext();
  private userService = new UserService();
  private controllers = new Map<string, TelegramController>();

  private constructor() {}

  public getUserService() {
    return this.userService;
  }

  public getTelegramController(ctx: ContextMessageUpdate) {
    if (!this.controllers.has(ctx.message.from.id)) {
      const newController = new TelegramController(
        ctx,
        this.getUserService(),
        AppContext.getMessageQueue(ctx),
      );
      this.controllers.set(ctx.message.from.id, newController);
    }
    const controller = this.controllers.get(ctx.message.from.id);
    if (!controller) {
      throw new Error('Some error!');
    }
    return controller;
  }

  public removeTelegramController(ctx: ContextMessageUpdate) {
    this.controllers.delete(ctx.message.from.id);
  }

  public clearTelegramController() {
    this.controllers.forEach(controller => {
      controller.onStop();
    });
    this.controllers.clear();
  }

  public getTimer(json: any, sendMessage: (message: string) => void): PomodoroTimer {
    const pomodoroTimer = new PomodoroTimer(json);

    pomodoroTimer.onStart = () => {
      sendMessage('Таймер запущен');
    };

    pomodoroTimer.onTick = treeItem => {
      sendMessage(`${treeItem.startTickLabel}`);
    };

    pomodoroTimer.onEndTick = (treeItem, automaticTick) => {
      if (!automaticTick) {
        sendMessage(`${treeItem.stopTickLabel}. Нажмите /next для продолжения`);
      }
    };

    pomodoroTimer.onDone = () => {
      sendMessage('Таймер остановлен');
    };

    return pomodoroTimer;
  }
}
