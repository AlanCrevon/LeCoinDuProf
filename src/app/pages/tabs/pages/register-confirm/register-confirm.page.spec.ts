import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { RegisterConfirmPage } from './register-confirm.page';

describe('RegisterConfirmPage', () => {
  let component: RegisterConfirmPage;
  let fixture: ComponentFixture<RegisterConfirmPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterConfirmPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [AngularFireModule.initializeApp(environment.firebase), AngularFireAuthModule, RouterTestingModule],
      providers: [AuthService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterConfirmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
