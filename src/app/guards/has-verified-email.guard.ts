import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HasVerifiedEmailGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * If user has verified their email, returns an observable true.
   * Else, redirect
   * to register-confirm page and return an observable false to
   * forbid activation
   */
  canActivate(): Observable<boolean> {
    return this.checkUserHasVerifiedMail();
  }

  /**
   * Return an observable true if the user has verified their email,
   * otherwise, redirects to register-confirm page
   * and return an observable false
   * @param destination detination url to redirect to after
   */
  checkUserHasVerifiedMail(): Observable<boolean> {
    return this.authService.user$.pipe(
      map(user => {
        if (!!user && user.emailVerified) {
          return true;
        }
        this.router.navigateByUrl('/app/register-confirm');
        return false;
      })
    );
  }
}
