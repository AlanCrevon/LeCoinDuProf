import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class IsLoggedInGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * If user is authentified, returns an observable true.
   * Else, store url to redirect to after login, redirect
   * to login page and return an observable false to
   * forbid activation
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const destination = state.url;
    return this.checkUserIsLoggedIn(destination);
  }

  /**
   * Return an observable true if the user is logged in,
   * otherwise, store destination url in authService, redirects to login page
   * and return an observable false
   * @param destination detination url to redirect to after login
   */
  checkUserIsLoggedIn(destination: string): Observable<boolean> {
    return this.authService.user$.pipe(
      map(user => {
        if (!!user) {
          return true;
        }

        this.authService.loggedInUrl = destination;
        this.router.navigateByUrl('/app/login');
        return false;
      })
    );
  }
}
