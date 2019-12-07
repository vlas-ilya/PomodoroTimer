import Tree from '../classes/Tree';
import TreeLeaf from '../classes/TreeLeaf';
import TreeNode from '../classes/TreeNode';

export default function getExecuted(tree: Tree): TreeLeaf | null {
  if (!tree.executing) {
    return null;
  }

  if (tree instanceof TreeLeaf) {
    return tree;
  }

  if (tree instanceof TreeNode) {
    const executedItem = tree.items.find(item => item.executing);

    if (!executedItem) {
      return null;
    }

    return getExecuted(executedItem);
  }

  return null;
}
