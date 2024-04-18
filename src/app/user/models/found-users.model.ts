import { UserModel } from "./user.model";

export class FoundUsersModel {
  constructor() {
    this.users = [];
    this.skippedUsers = 0;
    this.takenUsers = 0;
    this.totalUsers = 0;
    this.areLast = true;
  }
  users: UserModel[];
  skippedUsers: number;
  takenUsers: number;
  totalUsers: number;
  areLast: boolean;
}
