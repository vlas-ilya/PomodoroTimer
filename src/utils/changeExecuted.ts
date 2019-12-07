import Tree from '../classes/Tree';
import TreeNode from '../classes/TreeNode';
import setExecuted from './setExecuted';

export default function changeExecuted(tree: Tree): Tree | null {
  if (!(tree.executing && tree instanceof TreeNode)) {
    return null;
  }

  const executingItem = tree.items.find(item => item.executing);

  if (!executingItem) {
    return null;
  }

  const next = changeExecuted(executingItem);
  if (next) {
    return next;
  }

  executingItem.executing = false;

  const indexExecutingItem = tree.items.indexOf(executingItem);

  if (indexExecutingItem < tree.items.length - 1) {
    return setExecuted(tree.items[indexExecutingItem + 1]);
  }

  if (tree.count.next()) {
    return setExecuted(tree.items[0]);
  }

  return null;
}
