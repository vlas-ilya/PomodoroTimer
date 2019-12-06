import PomodoroTimer from '../services/PomodoroTimer';

export default function configurePomodoroTimer(
  json: any,
  sendMessage: (message: string) => void,
): PomodoroTimer {
  const pomodoroTimer = new PomodoroTimer(json);

  pomodoroTimer.onStart = () => {
    sendMessage('Start!');
  };

  pomodoroTimer.onTick = treeItem => {
    sendMessage(`${treeItem.label}`);
  };

  pomodoroTimer.onDone = () => {
    sendMessage('Done!');
  };

  return pomodoroTimer;
}
