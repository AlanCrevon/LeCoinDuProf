import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let location: Location;

  const credentialsMock = {
    email: 'abc@123.com',
    password: 'password'
  };

  const userMock = {
    uid: 'ABC123',
    email: credentialsMock.email
  };

  class MockAuthService {
    user$ = of(userMock);
    loggedInUrl = '/';
    login() {
      return of(undefined);
    }
    loginWithProvider() {
      return of(userMock);
    }
  }

  class MockToastService {
    success() {}
    error() {}
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule,
        IonicModule,
        BrowserModule
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: ToastService, useClass: MockToastService }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(LoginPage);
        component = fixture.componentInstance;
      });

    location = TestBed.get(Location);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login method when login button is clicked', () => {
    fixture.detectChanges();
    const login = spyOn(component, 'login');
    const loginButton = fixture.debugElement.query(By.css('#LoginPageLogin')).nativeElement;
    loginButton.click();
    expect(login).toHaveBeenCalledTimes(1);
  });

  it('should call authService::login when login method is called', () => {
    const authService = fixture.debugElement.injector.get(AuthService);
    spyOn(authService, 'login').and.callThrough();
    component.loginForm = component.buildLoginForm();
    component.login(component.loginForm);
    expect(authService.login).toHaveBeenCalled();
  });

  it('should call redirection when user is logged in', () => {
    const authService = fixture.debugElement.injector.get(AuthService);
    spyOn(authService, 'login').and.callThrough();
    spyOn(component, 'redirectAfterLogin');
    component.login(component.buildLoginForm());
    expect(component.redirectAfterLogin).toHaveBeenCalled();
  });

  it('should display an error toast if authService::login returns an error', () => {
    const authService = fixture.debugElement.injector.get(AuthService);
    spyOn(authService, 'login').and.returnValue(throwError({ status: 404 }));
    const toastService = fixture.debugElement.injector.get(ToastService);
    spyOn(toastService, 'error');
    component.login(component.buildLoginForm());
    expect(toastService.error).toHaveBeenCalled();
  });

  it('should call loginWithProvider method when loginWithProvider button is clicked', () => {
    fixture.detectChanges();
    const loginWithProvider = spyOn(component, 'loginWithProvider');
    const loginButton = fixture.debugElement.query(By.css('#LoginPageLoginWithProvider')).nativeElement;
    loginButton.click();
    expect(loginWithProvider).toHaveBeenCalledTimes(1);
  });

  it('should call authService::loginWithProvider when loginWithProvider method is called', () => {
    const authService = fixture.debugElement.injector.get(AuthService);
    const loginWithProviderSpy = spyOn(authService, 'loginWithProvider').and.callThrough();
    fixture.detectChanges();
    component.loginWithProvider('google');
    expect(authService.loginWithProvider).toHaveBeenCalled();
    expect(loginWithProviderSpy).toHaveBeenCalled();
    expect(loginWithProviderSpy.calls.any()).toBeTruthy();
  });

  it('should call redirection when user is logged in with provider', () => {
    const authService = fixture.debugElement.injector.get(AuthService);
    spyOn(authService, 'loginWithProvider').and.callThrough();
    spyOn(component, 'redirectAfterLogin');
    component.loginWithProvider('google');
    expect(component.redirectAfterLogin).toHaveBeenCalled();
  });

  it('should display an error toast if authService::loginWithProvider returns an error', () => {
    const authService = fixture.debugElement.injector.get(AuthService);
    spyOn(authService, 'loginWithProvider').and.returnValue(throwError({ status: 404 }));
    const toastService = fixture.debugElement.injector.get(ToastService);
    spyOn(toastService, 'error');
    component.loginWithProvider('google');
    expect(toastService.error).toHaveBeenCalled();
  });
});
