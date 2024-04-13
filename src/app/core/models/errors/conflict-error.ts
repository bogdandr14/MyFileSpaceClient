import { AppError } from './app-error';

export class ConflictError extends AppError {
  constructor(public override originalErr?: any) {
    super(originalErr);
  }
}
