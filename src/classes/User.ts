import PomodoroTimer from '../services/PomodoroTimer';

export default class User {
  constructor(public ctx: any, public timerSettings?: any, public pomodoroTimer?: PomodoroTimer) {}
}
