import { inject, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { IsLoggedInGuard } from './is-logged-in.guard';

describe('IsLoggedInGuard', () => {
  let authService: AuthService;
  let router: Router;
  let activatedRouteSnapshot;

  const mockAuthService = {
    user$: of(true)
  };

  class MockActivatedRouteSnapshot {
    private foo: 'coucou';
    get data() {
      return this.foo;
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IsLoggedInGuard,
        {
          provide: AuthService,
          useValue: mockAuthService
        },
        {
          provide: ActivatedRouteSnapshot,
          useClass: MockActivatedRouteSnapshot
        }
      ],
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        RouterTestingModule.withRoutes([])
      ]
    });

    authService = TestBed.get(AuthService);
    router = TestBed.get(Router);
    activatedRouteSnapshot = TestBed.get(ActivatedRouteSnapshot);
  });

  it('should create', inject([IsLoggedInGuard], (guard: IsLoggedInGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should return true if user is logged in', inject([IsLoggedInGuard], (guard: IsLoggedInGuard) => {
    guard.checkUserIsLoggedIn('url').subscribe(userIsLoggedIn => {
      expect(userIsLoggedIn).toEqual(true);
    });
  }));

  it('should return false if user is not logged in', inject([IsLoggedInGuard], (guard: IsLoggedInGuard) => {
    authService.user$ = of(undefined);
    guard.checkUserIsLoggedIn('url').subscribe(userIsLoggedIn => {
      expect(userIsLoggedIn).toEqual(false);
    });
  }));

  it(`should store user's destination to redirect after login if user is not logged in`, inject(
    [IsLoggedInGuard],
    (guard: IsLoggedInGuard) => {
      authService.user$ = of(undefined);
      guard.checkUserIsLoggedIn('url').subscribe(userIsLoggedIn => {
        expect(authService.loggedInUrl).toEqual('url');
      });
    }
  ));

  it(`should redirect user to login if user is not logged in`, inject([IsLoggedInGuard], (guard: IsLoggedInGuard) => {
    authService.user$ = of(undefined);
    spyOn(router, 'navigateByUrl');
    guard.checkUserIsLoggedIn('url').subscribe(userIsLoggedIn => {
      expect(router.navigateByUrl).toHaveBeenCalledWith('/app/login');
    });
  }));

  it(`should check if user is logged in to allow activation`, inject([IsLoggedInGuard], (guard: IsLoggedInGuard) => {
    authService.user$ = of(undefined);
    spyOn(guard, 'checkUserIsLoggedIn').and.callThrough();
    guard.canActivate(activatedRouteSnapshot, activatedRouteSnapshot).subscribe(userIsLoggedIn => {
      expect(guard.checkUserIsLoggedIn).toHaveBeenCalledWith(undefined);
    });
  }));
});
