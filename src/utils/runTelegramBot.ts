// @ts-ignore
import Telegraf, {ContextMessageUpdate, Markup} from 'telegraf';
import TelegramController from '../controllers/TelegramController';
import UserService from '../services/UserService';

const help = `
Команды:
  /start - запуск бота
  /settings - настройки таймера 
  /run - запуск таймера
  /next - перейти к следующему шагу
  /status - показать текущий статус таймера
  /stop - остановка таймера
`;

export default function runTelegramBot(token: string) {
  const bot = new Telegraf(String(token));
  const userService = new UserService();
  const controllers: Map<string, TelegramController> = new Map<string, TelegramController>();

  const getController = (ctx: ContextMessageUpdate): TelegramController => {
    const id = ctx.message ? ctx.message.from.id : ctx.update.callback_query.from.id;

    if (!controllers.has(id)) {
      controllers.set(id, new TelegramController(ctx, userService));
    }
    const controller = controllers.get(id);
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
      if (ctx.message) {
        // tslint:disable-next-line:no-console
        console.log(`User [id=${ctx.message.from.id}] send message ${ctx.message.text}`);
      }
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
      controller.onStart(ctx.from.first_name);
      ctx.reply(help).catch();
    }),
  );

  bot.help(
    middleware(ctx => {
      ctx.reply(help).catch();
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
    'settings',
    middleware((ctx: ContextMessageUpdate) => {
      const controller = getController(ctx);
      const automatic = controller.getUser().pomodoroTimer.automaticTick;

      const settings = Telegraf.Extra
        .markup((m: Markup) => m.inlineKeyboard([
          m.callbackButton(`Auto next session (${automatic ? 'ON' : 'OFF'})`, 'automatic'),
          m.callbackButton(`Timer settings`, 'timer')
        ]));

      ctx.reply('Settings', settings).catch();
    }),
  );

  bot.on(
    'callback_query',
    middleware(ctx => {
      const controller = getController(ctx);

      switch (ctx.update.callback_query.data) {
        case 'automatic': {
          controller.onSetAutomaticTick();
          const automatic = controller.getUser().pomodoroTimer.automaticTick;
          const settings = Telegraf.Extra
            .markdown()
            .markup((m: Markup) => m.inlineKeyboard([
              m.callbackButton(`Auto next session (${automatic ? 'ON' : 'OFF'})`, 'automatic'),
              m.callbackButton(`Timer settings`, 'timer')
            ]));
          ctx.editMessageText('Settings', settings).catch();
          return;
        }
        case 'timer': {
          const timerSettings = Telegraf.Extra
            .markdown()
            .markup((m: Markup) => m.inlineKeyboard([
              m.callbackButton(`default`, 'timer default'),
              m.callbackButton(`test`, 'timer test'),
              m.callbackButton(`tease`, 'timer tease'),
            ]));

          ctx.editMessageText('Settings', timerSettings).catch();
          return;
        }
        case 'timer default': {
          controller.onSetTimerSettings('default');
          const automatic = controller.getUser().pomodoroTimer.automaticTick;
          const settings = Telegraf.Extra
            .markdown()
            .markup((m: Markup) => m.inlineKeyboard([
              m.callbackButton(`Auto next session (${automatic ? 'ON' : 'OFF'})`, 'automatic'),
              m.callbackButton(`Timer settings`, 'timer')
            ]));
          ctx.editMessageText('Settings', settings).catch();
          return;
        }
        case 'timer test': {
          controller.onSetTimerSettings('test');
          const automatic = controller.getUser().pomodoroTimer.automaticTick;
          const settings = Telegraf.Extra
            .markdown()
            .markup((m: Markup) => m.inlineKeyboard([
              m.callbackButton(`Auto next session (${automatic ? 'ON' : 'OFF'})`, 'automatic'),
              m.callbackButton(`Timer settings`, 'timer')
            ]));
          ctx.editMessageText('Settings', settings).catch();
          return;
        }
        case 'timer tease': {
          controller.onSetTimerSettings('tease');
          const automatic = controller.getUser().pomodoroTimer.automaticTick;
          const settings = Telegraf.Extra
            .markdown()
            .markup((m: Markup) => m.inlineKeyboard([
              m.callbackButton(`Auto next session (${automatic ? 'ON' : 'OFF'})`, 'automatic'),
              m.callbackButton(`Timer settings`, 'timer')
            ]));
          ctx.editMessageText('Settings', settings).catch();
          return;
        }
      }
    }),
  );

  bot.command(
    'next',
    middleware((ctx: ContextMessageUpdate) => {
      const controller = getController(ctx);
      controller.onNext();
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
