// tslint:disable:object-literal-sort-keys
export const tease = {
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
          label: 'Начинаем работу (48 минут)',
        },
        {
          type: 'leaf',
          timer: '16',
          label: 'Маленький перерыв (16 минут)',
        },
      ],
    },
    {
      type: 'leaf',
      timer: '48',
      label: 'Начинаем работу (48 минут)',
    },
    {
      type: 'leaf',
      timer: '60',
      label: 'Большой перерыв (60 минут)',
    },
    {
      type: 'node',
      count: '3',
      items: [
        {
          type: 'leaf',
          timer: '48',
          label: 'Начинаем работу (48 минут)',
        },
        {
          type: 'leaf',
          timer: '16',
          label: 'Маленький перерыв (16 минут)',
        },
      ],
    },
  ],
};
