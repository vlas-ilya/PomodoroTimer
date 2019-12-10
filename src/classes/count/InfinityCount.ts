import Count from './Count';

export default class InfinityCount extends Count {
  constructor() {
    super();
  }

  public next(): boolean {
    return true;
  }

  public toString(): string {
    return 'Infinity';
  }
}
