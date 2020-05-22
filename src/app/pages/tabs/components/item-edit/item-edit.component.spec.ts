import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ItemEditComponent } from './item-edit.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from 'src/app/services/auth.service';
import { CameraModule } from 'src/app/modules/camera/camera.module';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';

describe('ItemEditComponent', () => {
  let component: ItemEditComponent;
  let fixture: ComponentFixture<ItemEditComponent>;

  const AngularFirestoreStub = {};
  const AngularFireAuthStub = {};
  const AuthServiceStub = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemEditComponent],
      imports: [
        IonicModule.forRoot(),
        ReactiveFormsModule,
        RouterTestingModule,
        CameraModule,
        AngularFireStorageModule,
        AngularFireModule.initializeApp(environment.firebase)
      ],
      providers: [
        {
          provide: AngularFirestore,
          use: AngularFirestoreStub
        },
        {
          provide: AngularFireAuth,
          use: AngularFireAuthStub
        },
        { provide: AuthService, use: AuthServiceStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
