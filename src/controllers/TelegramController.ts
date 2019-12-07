// @ts-ignore
import Telegraf, { ContextMessageUpdate } from 'telegraf';
import User from '../classes/User';
import configurePomodoroTimer from '../config/configurePomodoroTimer';
import settings from '../config/defaultPomodoroTimerSettings';
import UserService from '../services/UserService';
import BaseController from './BaseController';

export default class TelegramController extends BaseController {
  private userService: UserService;
  private ctx?: ContextMessageUpdate = null;

  constructor(token: string) {
    super();
    this.sendMessage = this.sendMessage.bind(this);
    this.getUser = this.getUser.bind(this);

    this.userService = new UserService();
    this.configureTelegramBot(token);
  }

  protected getUser(): User {
    const user = this.userService.get(this.ctx.message.from.id);

    if (user) {
      return user;
    }

    return this.userService.create(
      this.ctx.message.from.id,
      configurePomodoroTimer(settings.get('default'), this.sendMessage),
    );
  }

  protected sendMessage(message?: string): void {
    this.ctx.reply(message).catch(this.onStop);
  }

  private configureTelegramBot(token: string) {
    const bot = new Telegraf(token);

    bot.start(this.saveContextAndRun(super.onStart.bind(this)));
    bot.command('run', this.saveContextAndRun(super.onRun.bind(this)));
    bot.command('stop', this.saveContextAndRun(super.onStop.bind(this)));
    bot.command('status', this.saveContextAndRun(super.onGetStatus.bind(this)));
    bot.command('set_timer', this.saveContextAndRun(this._onSetTimerSettings.bind(this)));
    bot.command('next', this.saveContextAndRun(super.onNext.bind(this)));
    bot.command('automatic', this.saveContextAndRun(super.onSetAutomaticTick.bind(this)));

    bot.launch().catch(this.onStop.bind(this));
  }

  private saveContextAndRun(method: () => void): (ctx: ContextMessageUpdate) => void {
    return (ctx: ContextMessageUpdate) => {
      this.ctx = ctx;
      method();
    };
  }

  private _onSetTimerSettings() {
    const timer = this.ctx.message.text.slice(11);
    super.onSetTimerSettings(timer);
  }
}
