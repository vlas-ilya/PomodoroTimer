// @ts-ignore
import { ContextMessageUpdate } from 'telegraf';
import PomodoroTimer from '../services/PomodoroTimer';

export default class User {
  constructor(
    public ctx: ContextMessageUpdate,
    public timerSettings?: any,
    public pomodoroTimer?: PomodoroTimer,
  ) {}
}
