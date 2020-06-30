import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { RouterTestingModule } from '@angular/router/testing';
import { auth } from 'firebase/app';
import { BehaviorSubject, isObservable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

const credentialsMock = {
  email: 'abc@123.com',
  password: 'password'
};

const userMock = {
  uid: 'ABC123',
  email: credentialsMock.email,
  displayName: 'test',
  sendEmailVerification: () => of({})
};

const fakeAuthState = new BehaviorSubject(null);

const fakeSignInHandler = (email, password): Promise<any> => {
  fakeAuthState.next(userMock);
  return Promise.resolve(userMock);
};

const fakeSignOutHandler = (): Promise<any> => {
  fakeAuthState.next(null);
  return Promise.resolve();
};

const StubAngularFireAuth = {
  authState: fakeAuthState,
  auth: {
    createUserWithEmailAndPassword: jasmine.createSpy('createUserWithEmailAndPassword').and.callFake(fakeSignInHandler),
    signInWithEmailAndPassword: jasmine.createSpy('signInWithEmailAndPassword').and.callFake(fakeSignInHandler),
    signInWithPopup: jasmine.createSpy('signInWithPopup').and.callFake(fakeSignInHandler),
    signOut: jasmine.createSpy('signOut').and.callFake(fakeSignOutHandler)
  }
};

describe('AuthService', () => {
  let authService: AuthService;
  let angularFireAuth: AngularFireAuth;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AngularFireModule.initializeApp(environment.firebase), AngularFireAuthModule, RouterTestingModule],
      providers: [
        {
          provide: AngularFireAuth,
          useValue: StubAngularFireAuth
        }
      ]
    });
    authService = TestBed.inject(AuthService);
    angularFireAuth = TestBed.inject(AngularFireAuth);

    authService.logout();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should use AngularFireAuth', () => {
    expect(angularFireAuth).toBeDefined();
  });

  it('should have a default loggedInUrl', () => {
    expect(authService.loggedInUrl).toBe('/');
  });

  it('should have an observable user$', () => {
    expect(isObservable(authService.user$)).toBeTruthy();
  });

  it('should login using google provider', () => {
    authService.loginWithProvider('google');
    const googleAuthProvider = new auth.GoogleAuthProvider();
    expect(angularFireAuth.auth.signInWithPopup).toHaveBeenCalledWith(googleAuthProvider);
  });

  it('should login using email and password', () => {
    authService.login('test@test.com', 'password');
    expect(angularFireAuth.auth.signInWithEmailAndPassword).toHaveBeenCalledWith('test@test.com', 'password');
  });

  it('should throw an error if an unknown provider name has been used', () => {
    expect(() => {
      authService.loginWithProvider('bla');
    }).toThrow(new Error('AuthProvider bla is not authorized'));
  });

  it('should log out', () => {
    authService.logout();
    expect(angularFireAuth.auth.signOut).toHaveBeenCalled();
  });

  it('should register a user', () => {
    authService.register('test@test.com', 'test');
    expect(angularFireAuth.auth.createUserWithEmailAndPassword).toHaveBeenCalledWith('test@test.com', 'test');
  });
});
