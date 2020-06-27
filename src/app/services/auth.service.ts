import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User } from 'firebase/app';
import { from, Observable } from 'rxjs';
import { AppUser } from '../types/app-user';
import { switchMap, map } from 'rxjs/operators';
import { DbService } from './db.service';
import { Settings } from 'src/app/types/settings';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** Url user should be redirected to after when logged in */
  loggedInUrl = '/';

  /** Observable firebase user */
  user$: Observable<firebase.User>;

  /** Observable application user */
  appUser$: Observable<AppUser>;

  /** Observable user's settings */
  userSettings$: Observable<Settings>;

  /**
   * Constructor
   * @param angularFireAuth required to log in/out the user with firebase
   * @param router required to redirect user
   */
  constructor(public angularFireAuth: AngularFireAuth, private dbService: DbService) {
    this.user$ = angularFireAuth.authState;
    this.appUser$ = this.user$.pipe(switchMap(user => this.dbService.getDocument<AppUser>(`/users/${user.uid}`)));
    this.userSettings$ = this.user$.pipe(
      switchMap(user => this.dbService.getDocument<Settings>(`/settings/${user.uid}`))
    );
  }

  /**
   * Log the user in using external identity provider
   * @param provider identity provider to user
   */
  loginWithProvider(provider: string): Observable<auth.UserCredential> {
    let authProvider;
    switch (provider) {
      case 'google':
        authProvider = new auth.GoogleAuthProvider();
        break;

      default:
        throw new Error(`AuthProvider ${provider} is not authorized`);
    }
    return from(this.angularFireAuth.signInWithPopup(authProvider));
  }

  /**
   * Log a user in with email/password
   * @param email email is user's identifyer
   * @param password user's password
   */
  login(email: string, password: string): Observable<auth.UserCredential> {
    return from(this.angularFireAuth.signInWithEmailAndPassword(email, password));
  }

  /**
   * Log the user out
   */
  logout(): Observable<void> {
    return from(this.angularFireAuth.signOut());
  }

  /**
   * Register a user account
   */
  register(email, password): Observable<auth.UserCredential> {
    return from(this.angularFireAuth.createUserWithEmailAndPassword(email, password));
  }

  /**
   * Send the user a confirmation mail
   */
  sendEmailVerification(user: User): Observable<void> {
    return from(user.sendEmailVerification());
  }
}
