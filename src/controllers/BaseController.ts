import User from '../classes/User';
import configurePomodoroTimer from '../config/configurePomodoroTimer';
import settings from '../config/defaultPomodoroTimerSettings';

export default abstract class BaseController {
  private defaultTimerSettings: any = settings.get('default');

  constructor() {
    this.onStart = this.onStart.bind(this);
    this.onRun = this.onRun.bind(this);
    this.onStop = this.onStop.bind(this);
    this.onGetStatus = this.onGetStatus.bind(this);
    this.onSetTimerSettings = this.onSetTimerSettings.bind(this);
    this.onNext = this.onNext.bind(this);
    this.onSetAutomaticTick = this.onSetAutomaticTick.bind(this);
  }

  protected abstract getUser(): User;
  protected abstract sendMessage(message?: string): void;

  protected onStart() {
    this.sendMessage('Добро пожаловать!');
    const user = this.getUser();
    user.timerSettings = this.defaultTimerSettings;
  }

  protected onRun() {
    const user = this.getUser();

    user.pomodoroTimer.stop();
    user.pomodoroTimer = configurePomodoroTimer(user.timerSettings, this.sendMessage);
    user.pomodoroTimer.start();
  }

  protected onGetStatus() {
    const user = this.getUser();

    if (!user.pomodoroTimer.isRunning()) {
      this.sendMessage('Таймер не запущен');
      return;
    }

    this.sendMessage(user.pomodoroTimer.getStatus());
  }

  protected onSetTimerSettings(timer: string) {
    if (settings.has(timer)) {
      this.sendMessage('Настройки не найдены. Выполните команду /run');
      return;
    }

    const user = this.getUser();
    user.timerSettings = settings.get(timer);
    this.sendMessage('Настройки изменены. Выполните команду /run');
  }

  protected onStop() {
    const user = this.getUser();
    user.pomodoroTimer.stop();
    this.sendMessage('Done!');
  }

  protected onNext() {
    const user = this.getUser();

    if (!user.pomodoroTimer.isRunning()) {
      this.sendMessage('Таймер не запущен');
      return;
    }

    user.pomodoroTimer.next(this.sendMessage);
  }

  protected onSetAutomaticTick() {
    const user = this.getUser();

    user.pomodoroTimer.automaticTick = !user.pomodoroTimer.automaticTick;

    if (user.pomodoroTimer.automaticTick) {
      this.sendMessage('Автоматический переход включен');
    } else {
      this.sendMessage('Автоматический переход выключен');
    }
  }
}
