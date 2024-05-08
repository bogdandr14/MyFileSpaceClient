import { AppError } from './app-error';

export class BadRequestError extends AppError {
  constructor(public override originalErr?: any) {
    super(originalErr);
  }
}
