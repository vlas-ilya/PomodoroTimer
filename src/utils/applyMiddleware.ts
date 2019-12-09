import Middleware from '../classes/utils/Middleware';

export default function applyMiddleware(list: Middleware[]): Middleware {
  return list.reduce((previous, current) => ctx => previous(current(ctx)));
}
