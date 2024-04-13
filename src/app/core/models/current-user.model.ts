import { Guid } from 'guid-typescript';

export class CurrentUserModel {
  public userId!: Guid;
  public email!: string;
  public role!: string;
  public tagName?: string;
}
