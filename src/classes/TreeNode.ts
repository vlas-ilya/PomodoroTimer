import Count from './Count';
import RealCount from './RealCount';
import Tree from './Tree';

export default class TreeNode extends Tree {
  private readonly realCount: number;

  constructor(public count: Count, public items: Tree[]) {
    super();
    if (count instanceof RealCount) {
      this.realCount = count.count;
    }
  }

  public reset() {
    if (this.count instanceof RealCount) {
      this.count.count = this.realCount;
    }
  }

  public toString(n: number): string {
    const offset = new Array(n).fill('      ').join('');
    return (
      offset +
      '- TreeLeaf:\n' +
      offset +
      `    + count: ${this.count}\n` +
      offset +
      `    + executing: ${this.executing}\n` +
      offset +
      `    + items: \n${this.items.map(item => item.toString(n + 1)).join('')}`
    );
  }
}
