import PomodoroTimer from '../utils/PomodoroTimer';

export default class User {
  constructor(public timerSettings: any, public pomodoroTimer: PomodoroTimer) {}
}
