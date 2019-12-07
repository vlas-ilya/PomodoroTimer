import Tree from '../classes/Tree';
import TreeLeaf from '../classes/TreeLeaf';
import changeExecuted from './changeExecuted';
import clearExecuted from './clearExecuted';
import createTree from './createTree';
import declOfNum from './declOfNum';
import getExecuted from './getExecuted';
import setExecuted from './setExecuted';

export default class PomodoroTimer {
  public automaticTick: boolean = false;
  private readonly tree: Tree;
  private timeout?: NodeJS.Timeout;
  private lastTick?: Date;
  private nextTick?: Date;

  constructor(
    json: any,
    public onTick?: (treeItem: TreeLeaf) => void,
    public onEndTick?: (treeItem: TreeLeaf) => void,
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

    if (executed && executed.stopTickLabel) {
      sendMessage(executed.stopTickLabel);
    }

    this.stop();
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
    if (!(this.lastTick && this.nextTick)) {
      return 'Таймер не запущен';
    }

    const working = Math.round((currentDate.getTime() - this.lastTick.getTime()) / 1000 / 60);
    const leftTime = Math.round((this.nextTick.getTime() - currentDate.getTime()) / 1000 / 60);
    const minutes = ['минута', 'минуты', 'минут'];

    return (
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
        this.onEndTick(treeItem);
      }
      if (this.automaticTick) {
        this.startTimeout(changeExecuted(this.tree));
      }
    }, treeItem.timer * 1000 * 60);

    this.lastTick = new Date();
    this.nextTick = new Date(this.lastTick.getTime() + treeItem.timer * 1000 * 60);
  }
}
