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
          label: 'Рабочая сессия',
          startTickLabel: 'Начинаем работу (48 минут)',
          stopTickLabel: 'Рабочая сессия завершена',
        },
        {
          type: 'leaf',
          timer: '16',
          label: 'Перерыв',
          startTickLabel: 'Маленький перерыв (16 минут)',
          stopTickLabel: 'Перерыв завершен',
        },
      ],
    },
    {
      type: 'leaf',
      timer: '48',
      label: 'Рабочая сессия',
      startTickLabel: 'Начинаем работу (48 минут)',
      stopTickLabel: 'Рабочая сессия завершена',
    },
    {
      type: 'leaf',
      timer: '60',
      label: 'Большой перерыв',
      startTickLabel: 'Большой перерыв (60 минут)',
      stopTickLabel: 'Перерыв завершен',
    },
    {
      type: 'node',
      count: '3',
      items: [
        {
          type: 'leaf',
          timer: '48',
          label: 'Рабочая сессия',
          startTickLabel: 'Начинаем работу (48 минут)',
          stopTickLabel: 'Рабочая сессия завершена',
        },
        {
          type: 'leaf',
          timer: '16',
          label: 'Перерыв',
          startTickLabel: 'Маленький перерыв (16 минут)',
          stopTickLabel: 'Перерыв завершен',
        },
        {
          type: 'leaf',
          timer: '48',
          label: 'Рабочая сессия',
          startTickLabel: 'Начинаем работу (48 минут)',
          stopTickLabel: 'Рабочая сессия завершена',
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
          label: 'Рабочая сессия',
          startTickLabel: 'Начинаем работу (25 минут)',
          stopTickLabel: 'Рабочая сессия завершена',
        },
        {
          type: 'leaf',
          timer: '5',
          label: 'Перерыв',
          startTickLabel: 'Маленький перерыв (5 минут)',
          stopTickLabel: 'Перерыв завершен',
        },
      ],
    },
    {
      type: 'leaf',
      timer: '25',
      label: 'Рабочая сессия',
      startTickLabel: 'Начинаем работу (25 минут)',
      stopTickLabel: 'Рабочая сессия завершена',
    },
    {
      type: 'leaf',
      timer: '30',
      label: 'Большой перерыв',
      startTickLabel: 'Большой перерыв (30 минут)',
      stopTickLabel: 'Перерыв завершен',
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
      label: 'Рабочая сессия',
      startTickLabel: 'Начинаем работу (2 минуты)',
      stopTickLabel: 'Рабочая сессия завершена',
    },
    {
      type: 'leaf',
      timer: '1',
      label: 'Перерыв',
      startTickLabel: 'Маленький перерыв (1 минута)',
      stopTickLabel: 'Перерыв завершен',
    },
  ],
});

export default settings;
