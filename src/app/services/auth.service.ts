import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { auth, User } from 'firebase/app';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** Url user should be redirected to after when logged in */
  loggedInUrl = '/';

  /** Observable firebase user */
  user$: Observable<firebase.User>;

  /**
   * Constructor
   * @param angularFireAuth required to log in/out the user with firebase
   * @param router required to redirect user
   */
  constructor(public angularFireAuth: AngularFireAuth, private router: Router) {
    this.user$ = angularFireAuth.authState;
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
    return from(this.angularFireAuth.auth.signInWithPopup(authProvider));
  }

  /**
   * Log a user in with email/password
   * @param email email is user's identifyer
   * @param password user's password
   */
  login(email: string, password: string): Observable<auth.UserCredential> {
    return from(this.angularFireAuth.auth.signInWithEmailAndPassword(email, password));
  }

  /**
   * Log the user out
   */
  logout(): Observable<void> {
    return from(this.angularFireAuth.auth.signOut());
  }

  /**
   * Register a user account
   */
  register(email, password): Observable<auth.UserCredential> {
    return from(this.angularFireAuth.auth.createUserWithEmailAndPassword(email, password));
  }

  /**
   * Send the user a confirmation mail
   */
  sendEmailVerification(user: User): Observable<void> {
    return from(user.sendEmailVerification());
  }
}
