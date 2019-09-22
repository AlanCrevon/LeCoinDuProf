import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { DbService } from '../services/db.service';
import { switchMap, map } from 'rxjs/operators';
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
        if (!!appUser) {
          return true;
        }
        this.router.navigateByUrl('/app/welcome');
        return false;
      })
    );
  }
}
