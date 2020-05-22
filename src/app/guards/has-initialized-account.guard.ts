import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { DbService } from '../services/db.service';
import { switchMap, map, catchError } from 'rxjs/operators';
import { AppUser } from '../types/app-user';

@Injectable({
  providedIn: 'root'
})
export class HasInitializedAccountGuard implements CanActivate {
  constructor(private authService: AuthService, private dbService: DbService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.checkUserHasInitilizedAccount();
  }

  checkUserHasInitilizedAccount(): Observable<boolean> {
    return this.authService.user$.pipe(
      switchMap(user => this.dbService.getDocument<AppUser>(`/users/${user.uid}`)),
      map(appUser => {
        return appUser;
      }),
      map(appUser => {
        if (!!!appUser || !!!appUser.createdAt) {
          this.router.navigateByUrl('/app/welcome');
          return false;
        } else {
          return !!appUser;
        }
      }),
      catchError(error => {
        this.router.navigateByUrl('/app/welcome');
        return of(false);
      })
    );
  }
}
