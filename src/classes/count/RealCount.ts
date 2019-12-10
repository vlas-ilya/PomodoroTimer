import Count from './Count';

export default class RealCount extends Count {
  constructor(public count: number) {
    super();
  }

  public next(): boolean {
    if (this.count - 1 <= 0) {
      this.count = 0;
      return false;
    }

    this.count -= 1;
    return true;
  }

  public toString(): string {
    return String(this.count);
  }
}
