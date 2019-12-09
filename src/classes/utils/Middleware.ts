// @ts-ignore
import { ContextMessageUpdate } from 'telegraf';

type Middleware = (ctx: ContextMessageUpdate) => void;

export default Middleware;
