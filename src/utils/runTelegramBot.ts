// @ts-ignore
import Telegraf, { ContextMessageUpdate } from 'telegraf';
import TelegramController from '../controllers/TelegramController';
import UserService from '../services/UserService';

export default function runTelegramBot(token: string) {
  const bot = new Telegraf(String(token));
  const userService = new UserService();
  const controllers: Map<string, TelegramController> = new Map<string, TelegramController>();

  const getController = (ctx: ContextMessageUpdate): TelegramController => {
    if (!controllers.has(ctx.message.from.id)) {
      controllers.set(ctx.message.from.id, new TelegramController(ctx, userService));
    }
    const controller = controllers.get(ctx.message.from.id);
    if (!controller) {
      throw new Error('Some error!');
    }
    return controller;
  };

  function tryNotifyUser(ctx: ContextMessageUpdate) {
    ctx.reply('Что-то пошло не так!').catch();
  }

  function loggingErrorMiddleware(
    method: (ctx: ContextMessageUpdate) => void,
  ): (ctx: ContextMessageUpdate) => void {
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

  function loggingMessagesMiddleware(
    method: (ctx: ContextMessageUpdate) => void,
  ): (ctx: ContextMessageUpdate) => void {
    return ctx => {
      method(ctx);
      // tslint:disable-next-line:no-console
      console.log(`User [id=${ctx.message.from.id}] send message ${ctx.message.text}`);
    };
  }

  function middleware(
    method: (ctx: ContextMessageUpdate) => void,
  ): (ctx: ContextMessageUpdate) => void {
    return loggingErrorMiddleware(loggingMessagesMiddleware(method));
  }

  bot.start(
    middleware((ctx: ContextMessageUpdate) => {
      const controller = getController(ctx);
      controller.onStart();
    }),
  );

  bot.command(
    'run',
    middleware((ctx: ContextMessageUpdate) => {
      const controller = getController(ctx);
      controller.onRun();
    }),
  );

  bot.command(
    'stop',
    middleware((ctx: ContextMessageUpdate) => {
      const controller = getController(ctx);
      controller.onStop();
      controllers.delete(ctx.message.from.id);
    }),
  );

  bot.command(
    'status',
    middleware((ctx: ContextMessageUpdate) => {
      const controller = getController(ctx);
      controller.onGetStatus();
    }),
  );

  bot.command(
    'set_timer',
    middleware((ctx: ContextMessageUpdate) => {
      const controller = getController(ctx);
      controller.onSetTimerSettings(ctx.message.text);
    }),
  );

  bot.command(
    'next',
    middleware((ctx: ContextMessageUpdate) => {
      const controller = getController(ctx);
      controller.onNext();
    }),
  );

  bot.command(
    'automatic',
    middleware((ctx: ContextMessageUpdate) => {
      const controller = getController(ctx);
      controller.onSetAutomaticTick();
    }),
  );

  bot.launch().catch((error: any) => {
    // tslint:disable-next-line:no-console
    console.log(error);

    controllers.forEach(controller => {
      controller.onStop();
    });
    controllers.clear();

    // tslint:disable-next-line:no-console
    console.log('The end:(');
  });
}
