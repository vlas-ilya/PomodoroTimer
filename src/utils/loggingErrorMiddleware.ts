// @ts-ignore
import { ContextMessageUpdate } from 'telegraf';
import Middleware from '../classes/utils/Middleware';

function tryNotifyUser(ctx: ContextMessageUpdate) {
  ctx.reply('Что-то пошло не так!').catch();
}

export default function loggingErrorMiddleware(method: Middleware): Middleware {
  return ctx => {
    try {
      method(ctx);
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(e);
      tryNotifyUser(ctx);
    }
  };
}
