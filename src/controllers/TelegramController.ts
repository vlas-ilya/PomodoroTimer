import User from '../classes/User';
import configureTimer from '../config/configureTimer';
import settings from '../config/timers';
import {ContextMessageUpdate} from "telegraf";
import UserService from "../services/UserService";

export default class TelegramController {
  private defaultTimerSettings: any = settings.get('default');

  constructor(private ctx: ContextMessageUpdate, private userService: UserService) {
    this.onStart = this.onStart.bind(this);
    this.onRun = this.onRun.bind(this);
    this.onStop = this.onStop.bind(this);
    this.onGetStatus = this.onGetStatus.bind(this);
    this.onSetTimerSettings = this.onSetTimerSettings.bind(this);
    this.onNext = this.onNext.bind(this);
    this.onSetAutomaticTick = this.onSetAutomaticTick.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.getUser = this.getUser.bind(this);
  }

  public onStart(name: string) {
    this.sendMessage(`Добро пожаловать, ${name}!`);
    const user = this.getUser();
    user.timerSettings = this.defaultTimerSettings;
  }

  public onRun() {
    const user = this.getUser();

    if (!user.timerSettings) {
      user.timerSettings = this.defaultTimerSettings;
    }

    user.pomodoroTimer.stop();
    user.pomodoroTimer = configureTimer(user.timerSettings, this.sendMessage);
    user.pomodoroTimer.start();
  }

  public onGetStatus() {
    const user = this.getUser();

    if (!user.pomodoroTimer.isRunning()) {
      this.sendMessage('Таймер не запущен');
      return;
    }

    this.sendMessage(user.pomodoroTimer.getStatus());
  }

  public onSetTimerSettings(timer: string) {
    if (!settings.has(timer)) {
      this.sendMessage('Настройки не найдены. Выполните команду /run');
      return;
    }

    const user = this.getUser();
    user.timerSettings = settings.get(timer);
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

    user.pomodoroTimer.next(this.sendMessage);
  }

  public onSetAutomaticTick() {
    const user = this.getUser();
    user.pomodoroTimer.automaticTick = !user.pomodoroTimer.automaticTick;
  }

  public getUser(): User {
    const user = this.userService.get(this.ctx.message.from.id);

    if (user) {
      return user;
    }

    return this.userService.create(
      this.ctx.message.from.id,
      configureTimer(settings.get('default'), this.sendMessage),
    );
  }

  public sendMessage(message?: string): void {
    this.ctx.reply(message).catch();
  }
}
