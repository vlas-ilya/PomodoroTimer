import InfinityCount from '../classes/InfinityCount';
import RealCount from '../classes/RealCount';
import Tree from '../classes/Tree';
import TreeLeaf from '../classes/TreeLeaf';
import TreeNode from '../classes/TreeNode';

const createCount = (count: string) => {
  if (count === 'infinity') {
    return new InfinityCount();
  }
  return new RealCount(Number(count));
};

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
      return new TreeLeaf(timer, label);
    }
    default: {
      throw Error('Unknown TreeServiceItem.type');
    }
  }
}
