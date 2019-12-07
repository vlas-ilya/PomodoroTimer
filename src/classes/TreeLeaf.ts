import Tree from './Tree';

export default class TreeLeaf extends Tree {
  constructor(public timer: number, public startTickLabel: string, public stopTickLabel: string) {
    super();
  }

  public toString(n: number): string {
    const offset = new Array(n).fill('      ').join('');
    return (
      offset +
      '- TreeLeaf:\n' +
      offset +
      `    + timer: ${this.timer}\n` +
      offset +
      `    + startTickLabel: ${this.startTickLabel}\n` +
      offset +
      `    + stopTickLabel: ${this.stopTickLabel}\n` +
      offset +
      `    + executing: ${this.executing}\n`
    );
  }

  public reset(): void {
    return undefined;
  }
}
