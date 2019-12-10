import Count from '../classes/count/Count';
import InfinityCount from '../classes/count/InfinityCount';
import RealCount from '../classes/count/RealCount';

export function createCount(count: string): Count {
  return count === 'infinity' ? new InfinityCount() : new RealCount(Number(count));
}
