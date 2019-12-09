import Count from '../classes/Count';
import InfinityCount from '../classes/InfinityCount';
import RealCount from '../classes/RealCount';

export function countUtils(count: string): Count {
  return count === 'infinity' ? new InfinityCount() : new RealCount(Number(count));
}
