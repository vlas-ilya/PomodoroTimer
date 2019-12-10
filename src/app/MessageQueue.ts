// @ts-ignore
import { ContextMessageUpdate } from 'telegraf';

export default class MessageQueue {
  private messages: string[] = [];
  private timer?: NodeJS.Timeout | null;
  private readonly timeout: number = 200;

  constructor(private ctx: ContextMessageUpdate) {
    this.push = this.push.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  public push(message: string | undefined) {
    if (message === undefined) {
      return;
    }
    this.messages.push(message);
    if (!this.timer) {
      this.timer = setTimeout(this.sendMessage, this.timeout);
    }
  }

  private sendMessage() {
    if (this.messages.length === 0) {
      this.timer = null;
      return;
    }

    const message = this.messages.shift();

    this.ctx.replyWithMarkdown(message).catch();
    this.timer = this.messages.length !== 0 ? setTimeout(this.sendMessage, this.timeout) : null;
  }
}
