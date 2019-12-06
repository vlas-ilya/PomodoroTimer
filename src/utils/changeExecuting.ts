import Tree from '../classes/Tree';
import TreeNode from '../classes/TreeNode';
import setExecuting from './setExecuting';

export default function changeExecuting(tree: Tree): Tree {
  if (!(tree.executing && tree instanceof TreeNode)) {
    return null;
  }

  const executingItem = tree.items.find(item => item.executing);

  if (!executingItem) {
    return null;
  }

  const next = changeExecuting(executingItem);
  if (next) {
    return next;
  }

  executingItem.executing = false;

  const indexExecutingItem = tree.items.indexOf(executingItem);

  if (indexExecutingItem < tree.items.length - 1) {
    return setExecuting(tree.items[indexExecutingItem + 1]);
  }

  if (tree.count.next()) {
    return setExecuting(tree.items[0]);
  }

  return null;
}
