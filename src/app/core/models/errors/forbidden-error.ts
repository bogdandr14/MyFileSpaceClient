import { AppError } from './app-error';

export class ForbiddenError extends AppError {
  constructor(public override originalErr?: any) {
    super(originalErr);
  }
}
