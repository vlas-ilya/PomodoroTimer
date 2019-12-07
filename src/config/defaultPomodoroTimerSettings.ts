// tslint:disable:object-literal-sort-keys
const settings: Map<string, any> = new Map();

settings.set('tease', {
  type: 'node',
  count: '1',
  items: [
    {
      type: 'node',
      count: '3',
      items: [
        {
          type: 'leaf',
          timer: '48',
          startTickLabel: 'Начинаем работу (48 минут)',
          stopTickLabel: 'Заканчиваем работу',
        },
        {
          type: 'leaf',
          timer: '16',
          startTickLabel: 'Маленький перерыв (16 минут)',
          stopTickLabel: 'Перерыв закончен',
        },
      ],
    },
    {
      type: 'leaf',
      timer: '48',
      startTickLabel: 'Начинаем работу (48 минут)',
      stopTickLabel: 'Заканчиваем работу',
    },
    {
      type: 'leaf',
      timer: '60',
      startTickLabel: 'Большой перерыв (60 минут)',
      stopTickLabel: 'Перерыв закончен',
    },
    {
      type: 'node',
      count: '3',
      items: [
        {
          type: 'leaf',
          timer: '48',
          startTickLabel: 'Начинаем работу (48 минут)',
          stopTickLabel: 'Заканчиваем работу',
        },
        {
          type: 'leaf',
          timer: '16',
          startTickLabel: 'Маленький перерыв (16 минут)',
          stopTickLabel: 'Перерыв закончен',
        },
      ],
    },
  ],
});

settings.set('default', {
  type: 'node',
  count: '1',
  items: [
    {
      type: 'node',
      count: '4',
      items: [
        {
          type: 'leaf',
          timer: '25',
          startTickLabel: 'Начинаем работу (25 минут)',
          stopTickLabel: 'Заканчиваем работу',
        },
        {
          type: 'leaf',
          timer: '5',
          startTickLabel: 'Маленький перерыв (5 минут)',
          stopTickLabel: 'Перерыв закончен',
        },
      ],
    },
    {
      type: 'leaf',
      timer: '25',
      startTickLabel: 'Начинаем работу (25 минут)',
      stopTickLabel: 'Заканчиваем работу',
    },
    {
      type: 'leaf',
      timer: '60',
      startTickLabel: 'Большой перерыв (60 минут)',
      stopTickLabel: 'Перерыв закончен',
    },
  ],
});

settings.set('test', {
  type: 'node',
  count: '4',
  items: [
    {
      type: 'leaf',
      timer: '2',
      startTickLabel: 'Начинаем работу (2 минуты)',
      stopTickLabel: 'Заканчиваем работу',
    },
    {
      type: 'leaf',
      timer: '1',
      startTickLabel: 'Маленький перерыв (1 минута)',
      stopTickLabel: 'Перерыв закончен',
    },
  ],
});

export default settings;
