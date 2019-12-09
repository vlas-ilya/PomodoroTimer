import PomodoroTimer from '../../app/PomodoroTimer';

export default class User {
  constructor(public timerSettings: any, public pomodoroTimer: PomodoroTimer) {}
}
