import Tree from '../classes/tree/Tree';
import TreeLeaf from '../classes/tree/TreeLeaf';
import TreeNode from '../classes/tree/TreeNode';
import { createCount } from './count.utils';

export function changeExecuted(tree: Tree): Tree | null {
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

export function clearExecuted(tree: Tree): void {
  tree.executing = false;
  if (tree instanceof TreeNode) {
    tree.items.map(clearExecuted);
  }
}

export function createTree(json: any): Tree {
  switch (json.type) {
    case 'node': {
      const count = createCount(json.count);
      const items = json.items ? json.items.map(createTree) : [];
      return new TreeNode(count, items);
    }
    case 'leaf': {
      const timer = Number(json.timer);
      const label = String(json.label);
      const startTickLabel = String(json.startTickLabel);
      const stopTickLabel = String(json.stopTickLabel);
      return new TreeLeaf(timer, label, startTickLabel, stopTickLabel);
    }
    default: {
      throw Error('Unknown TreeServiceItem.type');
    }
  }
}

export function getExecuted(tree: Tree): TreeLeaf | null {
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

export function setExecuted(tree: Tree): Tree {
  tree.reset();
  tree.executing = true;
  if (tree instanceof TreeNode && tree.items.length > 0) {
    return setExecuted(tree.items[0]);
  }
  return tree;
}
