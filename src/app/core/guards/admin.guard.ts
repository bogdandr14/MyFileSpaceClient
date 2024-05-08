import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { Observable, of, switchMap, take, tap } from 'rxjs';
import { DataService } from '../services/data.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanLoad {
  constructor(private dataService: DataService) {}
  canLoad(): Observable<boolean> {
    return this.dataService.user$.pipe(
      take(1),
      switchMap((user) => {
        console.log(user.role);
        debugger;
        return of(true);
      })
    );
  }
}
