import Tree from '../classes/Tree';
import TreeNode from '../classes/TreeNode';

export default function clearExecuted(tree: Tree): void {
  tree.executing = false;
  if (tree instanceof TreeNode) {
    tree.items.map(clearExecuted);
  }
}
