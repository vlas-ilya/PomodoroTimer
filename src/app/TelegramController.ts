import AppContext from './AppContext';
// @ts-ignore
import { ContextMessageUpdate } from 'telegraf';
import MessageQueue from './MessageQueue';
import User from '../classes/utils/User';
import UserService from './UserService';
import presets from '../utils/presets';

export default class TelegramController {
  private defaultTimerSettings: any = presets.get('default');

  public constructor(
    private ctx: ContextMessageUpdate,
    private userService: UserService,
    private messageQueue: MessageQueue,
  ) {
    this.getUser = this.getUser.bind(this);
    this.onGetStatus = this.onGetStatus.bind(this);
    this.onNext = this.onNext.bind(this);
    this.onRun = this.onRun.bind(this);
    this.onSetAutomaticTick = this.onSetAutomaticTick.bind(this);
    this.onSetTimerSettings = this.onSetTimerSettings.bind(this);
    this.onStart = this.onStart.bind(this);
    this.onStop = this.onStop.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  public onStart() {
    this.sendMessage('Добро пожаловать!');
    const user = this.getUser();
    user.timerSettings = this.defaultTimerSettings;
  }

  public onRun() {
    const user = this.getUser();

    user.timerSettings = user.timerSettings || this.defaultTimerSettings;

    user.pomodoroTimer.stop();
    user.pomodoroTimer = AppContext.getContext().getTimer(user.timerSettings, this.sendMessage);
    user.pomodoroTimer.start();
  }

  public onGetInfo() {
    const user = this.getUser();
    this.sendMessage(user.pomodoroTimer.getInfo());
  }

  public onGetStatus() {
    const user = this.getUser();

    if (!user.pomodoroTimer.isRunning()) {
      this.sendMessage('Таймер не запущен');
      return;
    }

    this.sendMessage(user.pomodoroTimer.getStatus());
  }

  public onSetTimerSettings(message: string) {
    const timer = message.slice(11);
    if (!presets.has(timer.trim())) {
      this.sendMessage('Настройки не найдены. Выполните команду /run');
      return;
    }

    const user = this.getUser();
    user.timerSettings = presets.get(timer);
    user.pomodoroTimer.stop();
    user.pomodoroTimer = AppContext.getContext().getTimer(user.timerSettings, this.sendMessage);
    this.sendMessage('Настройки изменены. Выполните команду /run');
  }

  public onStop() {
    const user = this.getUser();
    user.pomodoroTimer.stop();
    this.sendMessage('Таймер остановлен');
  }

  public onNext() {
    const user = this.getUser();

    if (!user.pomodoroTimer.isRunning()) {
      this.sendMessage('Таймер не запущен');
      return;
    }

    user.pomodoroTimer.next();
  }

  public onSetAutomaticTick() {
    const user = this.getUser();

    user.pomodoroTimer.automaticTick = !user.pomodoroTimer.automaticTick;

    if (user.pomodoroTimer.automaticTick) {
      this.sendMessage('Автоматический переход включен');
    } else {
      this.sendMessage('Автоматический переход выключен');
    }
  }

  private getUser(): User {
    const user = this.userService.get(this.ctx.message.from.id);

    if (user) {
      return user;
    }

    return this.userService.create(
      this.ctx.message.from.id,
      presets.get('default'),
      AppContext.getContext().getTimer(presets.get('default'), this.sendMessage),
    );
  }

  private sendMessage(message?: string): void {
    this.messageQueue.push(message);
  }
}
