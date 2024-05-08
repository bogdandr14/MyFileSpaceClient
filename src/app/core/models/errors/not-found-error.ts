import { AppError } from './app-error';

export class NotFoundError extends AppError {
  constructor(public override originalErr?: any) {
    super(originalErr);
  }
}
