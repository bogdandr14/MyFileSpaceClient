import { AppError } from './app-error';

export class UnauthorizedError extends AppError {
  constructor(public override originalErr?: any) {
    super(originalErr.Unauthorized.errors[0].errorMessage);
  }
}
