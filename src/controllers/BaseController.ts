import User from '../classes/User';
import configureTimer from '../config/configureTimer';
import settings from '../config/timers';

export default abstract class BaseController {
  private defaultTimerSettings: any = settings.get('default');

  protected constructor() {
    this.onStart = this.onStart.bind(this);
    this.onRun = this.onRun.bind(this);
    this.onStop = this.onStop.bind(this);
    this.onGetStatus = this.onGetStatus.bind(this);
    this.onSetTimerSettings = this.onSetTimerSettings.bind(this);
    this.onNext = this.onNext.bind(this);
    this.onSetAutomaticTick = this.onSetAutomaticTick.bind(this);
  }

  public onStart() {
    this.sendMessage('Добро пожаловать!');
    const user = this.getUser();
    user.timerSettings = this.defaultTimerSettings;
  }

  public onRun() {
    const user = this.getUser();

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

  public onSetTimerSettings(message: string) {
    const timer = message.slice(11);
    if (!settings.has(timer.trim())) {
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

    if (user.pomodoroTimer.automaticTick) {
      this.sendMessage('Автоматический переход включен');
    } else {
      this.sendMessage('Автоматический переход выключен');
    }
  }

  protected abstract getUser(): User;
  protected abstract sendMessage(message?: string): void;
}
