import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment';
import { MePage } from './me.page';

describe('MePage', () => {
  let component: MePage;
  let fixture: ComponentFixture<MePage>;

  class MockAuthService {
    user$ = of({
      uid: 'abc',
      displayName: 'test'
    });
    logout() {
      return of(undefined);
    }
  }

  class MockToastService {
    success() {}
    error() {}
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        IonicModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        RouterTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: ToastService, useClass: MockToastService },
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call MePage::logout on click on logout button', () => {
    fixture.detectChanges();
    const logout = spyOn(component, 'logout');
    const logoutButton = fixture.debugElement.query(By.css('#MePageLogout')).nativeElement;
    logoutButton.click();
    expect(logout).toHaveBeenCalled();
  });

  it('should call AuthService::logout when MePage::logout is called', () => {
    const authService = fixture.debugElement.injector.get(AuthService);
    spyOn(authService, 'logout').and.callThrough();
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should display a success toast after logout', () => {
    const toastService = fixture.debugElement.injector.get(ToastService);
    spyOn(toastService, 'success').and.returnValues();
    component.logout();
    expect(toastService.success).toHaveBeenCalled();
  });
});
