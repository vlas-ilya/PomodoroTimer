import User from '../classes/User';

export default class UserService {
  private users: any = {};

  public get(ctx: any): User {
    if (this.users[ctx.message.from.id]) {
      const user = this.users[ctx.message.from.id];
      user.ctx = user.ctx || ctx;
      return user;
    }

    const newUser = new User(ctx);
    this.users[ctx.message.from.id] = newUser;
    return newUser;
  }
}
