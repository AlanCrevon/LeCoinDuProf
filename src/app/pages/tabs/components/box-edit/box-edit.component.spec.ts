import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BoxEditComponent } from './box-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';
import { AngularFirestore } from '@angular/fire/firestore';
import { RouterTestingModule } from '@angular/router/testing';

describe('BoxEditComponent', () => {
  let component: BoxEditComponent;
  let fixture: ComponentFixture<BoxEditComponent>;
  const AngularFirestoreStub = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BoxEditComponent],
      imports: [
        IonicModule.forRoot(),
        ReactiveFormsModule,
        AgmCoreModule.forRoot({
          apiKey: environment.googleMapApiKey,
          libraries: ['places']
        }),
        RouterTestingModule
      ],
      providers: [{ provide: AngularFirestore, use: AngularFirestoreStub }]
    }).compileComponents();

    fixture = TestBed.createComponent(BoxEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
