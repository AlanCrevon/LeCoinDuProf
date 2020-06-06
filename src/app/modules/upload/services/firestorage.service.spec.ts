import { TestBed } from '@angular/core/testing';
import { FirestorageService } from './firestorage.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { ModalController } from '@ionic/angular';

describe('FirestorageService', () => {
  const AngularFireStorageStub = {};
  const ModalControllerStub = {};

  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFireStorage, useValue: AngularFireStorageStub },
        { provide: ModalController, useValue: ModalControllerStub }
      ]
    })
  );

  it('should be created', () => {
    const service: FirestorageService = TestBed.inject(FirestorageService);
    expect(service).toBeTruthy();
  });
});
