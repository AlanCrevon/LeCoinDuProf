import { Component } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { HasVerifiedEmailGuard } from './has-verified-email.guard';

@Component({
  template: ''
})
export class DummyComponent {}

describe('HasVerifiedEmailGuard', () => {
  let authService: AuthService;
  let router: Router;

  const mockAuthService = {
    user$: of({ emailVerified: true })
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HasVerifiedEmailGuard,
        {
          provide: AuthService,
          useValue: mockAuthService
        }
      ],
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        RouterTestingModule.withRoutes([
          {
            path: 'app/register-confirm',
            component: DummyComponent
          }
        ])
      ],
      declarations: [DummyComponent]
    });

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should create', inject([HasVerifiedEmailGuard], (guard: HasVerifiedEmailGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should return true if user has a verified email', inject(
    [HasVerifiedEmailGuard],
    (guard: HasVerifiedEmailGuard) => {
      guard.checkUserHasVerifiedMail().subscribe(userHasVerifiedEmail => {
        expect(userHasVerifiedEmail).toEqual(true);
      });
    }
  ));

  it('should return false if user has no verified email', inject(
    [HasVerifiedEmailGuard],
    (guard: HasVerifiedEmailGuard) => {
      authService.user$ = of(undefined);
      guard.checkUserHasVerifiedMail().subscribe(userHasVerifiedEmail => {
        expect(userHasVerifiedEmail).toEqual(false);
      });
    }
  ));

  it(`should redirect user if they don't have verified email`, inject(
    [HasVerifiedEmailGuard],
    (guard: HasVerifiedEmailGuard) => {
      authService.user$ = of(undefined);
      spyOn(router, 'navigateByUrl');
      guard.checkUserHasVerifiedMail().subscribe(userIsLoggedIn => {
        expect(router.navigateByUrl).toHaveBeenCalledWith('/app/register-confirm');
      });
    }
  ));

  it(`should check if user has verified email in to allow activation`, inject(
    [HasVerifiedEmailGuard],
    (guard: HasVerifiedEmailGuard) => {
      authService.user$ = of(undefined);
      spyOn(guard, 'checkUserHasVerifiedMail').and.callThrough();
      guard.canActivate().subscribe(userIsLoggedIn => {
        expect(guard.checkUserHasVerifiedMail).toHaveBeenCalled();
      });
    }
  ));
});
