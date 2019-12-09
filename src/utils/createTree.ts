import Tree from '../classes/Tree';
import TreeLeaf from '../classes/TreeLeaf';
import TreeNode from '../classes/TreeNode';
import createCount from './createCount';

export default function createTree(json: any): Tree {
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
