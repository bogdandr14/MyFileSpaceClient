import { UserModel } from "./user.model";

export class FoundUsersModel {
  constructor() {
    this.items = [];
    this.skipped = 0;
    this.taken = 0;
    this.areLast = true;
  }
  items: UserModel[];
  skipped: number;
  taken: number;
  areLast: boolean;
}
