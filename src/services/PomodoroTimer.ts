import Tree from '../classes/Tree';
import TreeLeaf from '../classes/TreeLeaf';
import changeExecuting from '../utils/changeExecuting';
import clearExecuting from '../utils/clearExecuting';
import createTree from '../utils/createTree';
import setExecuting from '../utils/setExecuting';

export default class PomodoroTimer {
  private readonly tree: Tree;
  private timeout: NodeJS.Timeout;

  constructor(
    json: any,
    public onTick?: (treeItem: TreeLeaf) => void,
    public onStart?: () => void,
    public onDone?: () => void,
  ) {
    this.tree = createTree(json);
  }

  public start(): void {
    this.stop();
    if (this.onStart) {
      this.onStart();
    }
    clearExecuting(this.tree);
    this.startTimeout(setExecuting(this.tree));
  }

  public stop(): void {
    clearTimeout(this.timeout);
  }

  private startTimeout(treeItem: Tree) {
    if (!(treeItem && treeItem instanceof TreeLeaf)) {
      if (this.onDone) {
        this.onDone();
      }
      return;
    }

    if (this.onTick) {
      this.onTick(treeItem);
    }

    this.timeout = setTimeout(() => {
      this.startTimeout(changeExecuting(this.tree));
    }, treeItem.timer * 1000 * 60);
  }
}
