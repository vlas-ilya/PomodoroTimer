import User from '../classes/User';
import PomodoroTimer from '../utils/PomodoroTimer';

export default class UserService {
  private users: Map<string, User> = new Map<string, User>();

  public get(id: string): User | null {
    const user = this.users.get(id);

    if (user) {
      return user;
    }

    return null;
  }

  public create(id: string, timer: PomodoroTimer): User {
    const user = new User(id, timer);
    this.users.set(id, user);
    return user;
  }
}
