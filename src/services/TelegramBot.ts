// @ts-ignore
import Telegraf, { ContextMessageUpdate } from 'telegraf';
import configurePomodoroTimer from '../config/configurePomodoroTimer';
import { tease } from '../config/defaultPomodoroTimerSettings';
import UserService from './UserService';

export default class TelegramBot {
  private userService: UserService;
  private defaultTimerSettings: any = tease;

  constructor(token: string) {
    this.userService = new UserService();
    const bot = new Telegraf(token);

    bot.start(this.onStart);
    bot.hears('run', this.onRun);
    bot.hears('stop', this.onStop);
    bot.launch().catch(this.onStop);
  }

  private onStart(ctx: ContextMessageUpdate) {
    ctx.reply('Start!');
    const user = this.userService.get(ctx);
    user.timerSettings = this.defaultTimerSettings;
  }

  private onRun(ctx: ContextMessageUpdate) {
    const user = this.userService.get(ctx);

    this.onStop(ctx);

    user.pomodoroTimer = configurePomodoroTimer(user.timerSettings, this.sendMessage(user.ctx));
    user.pomodoroTimer.start();
  }

  private onStop(ctx: ContextMessageUpdate) {
    const user = this.userService.get(ctx);

    if (user.pomodoroTimer && user.pomodoroTimer.stop) {
      user.pomodoroTimer.stop();
    }
  }

  private sendMessage(ctx: ContextMessageUpdate): (message: string) => void {
    return (message: string): void => {
      ctx.reply(message).catch(this.onStop);
    };
  }
}
