import { Directive } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
} from 'rxjs/operators';
import { UserService } from '../user.service';

@Directive({
  selector: '[emailCheck]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: EmailCheckDirective,
      multi: true,
    },
  ],
})
export class EmailCheckDirective implements AsyncValidator {
  private readonly pattern: string = '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$';

  constructor(private userService: UserService) { }

  validate(
    control: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }
    const regex = new RegExp(this.pattern);
    const valid = regex.test(control.value);
    if (!valid) {
      return of(<ValidationErrors>{ invalidEmail: true });
    }
    const obs = this.userService.checkEmailTaken(control.value).pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      map((isAvailable) => (isAvailable ? null : { emailTaken: true })),
      catchError(() => of(null))
    );
    return obs;
  }
}
