// @ts-ignore
import { ContextMessageUpdate } from 'telegraf';
import PomodoroTimer from '../services/PomodoroTimer';

export default class User {
  constructor(
    public ctx: ContextMessageUpdate,
    public pomodoroTimer: PomodoroTimer,
    public timerSettings?: any,
  ) {}
}
