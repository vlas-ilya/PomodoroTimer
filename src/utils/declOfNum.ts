// Склонение числительных
// https://gist.github.com/realmyst/1262561
// use:
//   declOfNum(count, ['рубль', 'рубля', 'рублей']);

export default function declOfNum(num: number, titles: string[]): string {
  const cases: number[] = [2, 0, 1, 1, 1, 2];
  const index = num % 100 > 4 && num % 100 < 20 ? 2 : cases[num % 10 < 5 ? num % 10 : 5];
  return titles[index];
}
