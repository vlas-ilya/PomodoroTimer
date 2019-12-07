import PomodoroTimer from '../services/PomodoroTimer';

export default function configurePomodoroTimer(
  json: any,
  sendMessage: (message: string) => void,
): PomodoroTimer {
  const pomodoroTimer = new PomodoroTimer(json);

  pomodoroTimer.onStart = () => {
    sendMessage('Таймер запущен');
  };

  pomodoroTimer.onTick = treeItem => {
    sendMessage(`${treeItem.startTickLabel}`);
  };

  pomodoroTimer.onEndTick = treeItem => {
    sendMessage(`${treeItem.stopTickLabel}`);
  };

  pomodoroTimer.onDone = () => {
    sendMessage('Таймер остановлен');
  };

  return pomodoroTimer;
}
