// @ts-ignore
import { ContextMessageUpdate } from 'telegraf';
import User from '../classes/User';
import configureTimer from '../config/configureTimer';
import settings from '../config/timers';
import UserService from '../services/UserService';
import BaseController from './BaseController';

export default class TelegramController extends BaseController {
  constructor(private ctx: ContextMessageUpdate, private userService: UserService) {
    super();
    this.sendMessage = this.sendMessage.bind(this);
    this.getUser = this.getUser.bind(this);
  }

  protected getUser(): User {
    const user = this.userService.get(this.ctx.message.from.id);

    if (user) {
      return user;
    }

    return this.userService.create(
      this.ctx.message.from.id,
      configureTimer(settings.get('default'), this.sendMessage),
    );
  }

  protected sendMessage(message?: string): void {
    this.ctx.reply(message).catch();
  }
}
