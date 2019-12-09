import {
  changeExecuted,
  clearExecuted,
  createTree,
  getExecuted,
  setExecuted,
} from '../utils/tree.utils';

import Tree from '../classes/Tree';
import TreeLeaf from '../classes/TreeLeaf';
import declOfNum from '../utils/declOfNum';

export default class PomodoroTimer {
  public automaticTick: boolean = false;
  private readonly tree: Tree;
  private timeout?: NodeJS.Timeout;
  private lastTick?: Date;
  private nextTick?: Date;

  constructor(
    json: any,
    public onTick?: (treeItem: TreeLeaf) => void,
    public onEndTick?: (treeItem: TreeLeaf, automaticTick: boolean) => void,
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
    clearExecuted(this.tree);
    this.startTimeout(setExecuted(this.tree));
  }

  public isRunning(): boolean {
    return Boolean(this.lastTick && this.nextTick);
  }

  public next(sendMessage: (message?: string) => void): void {
    const executed = getExecuted(this.tree);

    if (this.isRunning()) {
      this.stop();
    }

    this.startTimeout(changeExecuted(this.tree));
  }

  public stop(): void {
    this.nextTick = undefined;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  public getStatus(): string {
    const currentDate = new Date();
    const executed = getExecuted(this.tree);

    if (!(executed && this.lastTick && this.nextTick)) {
      return 'Таймер не запущен';
    }

    const working = Math.round((currentDate.getTime() - this.lastTick.getTime()) / 1000 / 60);
    const leftTime = Math.round((this.nextTick.getTime() - currentDate.getTime()) / 1000 / 60);
    const minutes = ['минута', 'минуты', 'минут'];

    return (
      `${executed.label} (${executed.timer} ${declOfNum(executed.timer, minutes)})\n` +
      `Прошло ${working} ${declOfNum(working, minutes)}\n` +
      `Осталось ${leftTime} ${declOfNum(leftTime, minutes)}`
    );
  }

  private startTimeout(treeItem: Tree | null) {
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
      if (this.onEndTick) {
        this.onEndTick(treeItem, this.automaticTick);
      }
      if (this.automaticTick) {
        this.startTimeout(changeExecuted(this.tree));
      }
    }, treeItem.timer * 1000 * 60);

    this.lastTick = new Date();
    this.nextTick = new Date(this.lastTick.getTime() + treeItem.timer * 1000 * 60);
  }
}
