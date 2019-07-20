import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment';
import { RegisterPage } from './register.page';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;

  const modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);
  modalCtrlSpy.create.and.callFake(() => {
    return jasmine.createSpyObj('Modal', ['present']);
  });

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
    register() {
      return of(userMock);
    }
    login() {
      return of(userMock);
    }
  }

  class MockToastService {
    success() {}
    error() {}
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: ToastService, useClass: MockToastService },
        { provide: ModalController, useValue: modalCtrlSpy }
      ],
      declarations: [RegisterPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService::register when register method is called', () => {
    const authService = fixture.debugElement.injector.get(AuthService);
    spyOn(authService, 'register').and.returnValue(throwError({ code: 'errorCode' }));
    component.registerForm = component.buildRegisterForm();
    component.register(component.registerForm);
    expect(authService.register).toHaveBeenCalled();
  });

  it('should display an error toast if register fails', () => {
    const authService = fixture.debugElement.injector.get(AuthService);
    spyOn(authService, 'register').and.returnValue(throwError({ code: 'errorCode' }));
    const toastService = fixture.debugElement.injector.get(ToastService);
    spyOn(toastService, 'error');
    component.registerForm = component.buildRegisterForm();
    component.register(component.registerForm);
    expect(toastService.error).toHaveBeenCalledWith('errorCode');
  });

  it('should display a success toast and call login if registration succeeds', () => {
    const authService = fixture.debugElement.injector.get(AuthService);
    const toastService = fixture.debugElement.injector.get(ToastService);
    spyOn(toastService, 'success');
    spyOn(authService, 'register').and.returnValue(of(userMock));
    spyOn(component, 'login');
    component.registerForm = component.buildRegisterForm();
    component.register(component.registerForm);
    expect(toastService.success).toHaveBeenCalled();
    expect(component.login).toHaveBeenCalled();
  });

  it('should redirect user after login', () => {
    const authService = fixture.debugElement.injector.get(AuthService);
    const router = fixture.debugElement.injector.get(Router);
    spyOn(router, 'navigateByUrl');
    spyOn(authService, 'register').and.returnValue(of(userMock));
    component.registerForm = component.buildRegisterForm();
    component.login(component.registerForm);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/app/boxes');
  });

  it('should open a tos modal', () => {
    const modalController = fixture.debugElement.injector.get(ModalController);
    component.openTosModal();
    expect(modalController.create).toHaveBeenCalled();
  });
});
