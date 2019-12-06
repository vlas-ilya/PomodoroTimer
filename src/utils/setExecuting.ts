import Tree from '../classes/Tree';
import TreeNode from '../classes/TreeNode';

export default function setExecuting(tree: Tree): Tree {
  tree.reset();
  tree.executing = true;
  if (tree instanceof TreeNode && tree.items.length > 0) {
    return setExecuting(tree.items[0]);
  }
  return tree;
}
