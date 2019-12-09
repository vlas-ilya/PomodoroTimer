import Middleware from '../classes/utils/Middleware';

export default function loggingMessagesMiddleware(method: Middleware): Middleware {
  return ctx => {
    method(ctx);
    // tslint:disable-next-line:no-console
    console.log(`User [id=${ctx.message.from.id}] send message ${ctx.message.text}`);
  };
}
