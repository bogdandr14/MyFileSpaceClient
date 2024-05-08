import { Guid } from 'guid-typescript';

export class AuthUserModel {
  public userId!: Guid;
  public email!: string;
  public role!: string;
  public tagName?: string;
}
