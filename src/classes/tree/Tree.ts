export default abstract class Tree {
  protected constructor(public executing: boolean = false) {}

  public abstract toString(n: number): string;

  public abstract reset(): void;
}
