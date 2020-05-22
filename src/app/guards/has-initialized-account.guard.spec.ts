import { TestBed, async, inject } from '@angular/core/testing';

import { HasInitializedAccountGuard } from './has-initialized-account.guard';
import { AngularFireAuth } from '@angular/fire/auth';
import { of, BehaviorSubject } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';

describe('HasInitializedAccountGuard', () => {
  const AngularFireMocks = {
    auth: of({ uid: 'ABC123' })
  };

  const FirestoreStub = {
    collection: (name: string) => ({
      // tslint:disable-next-line: variable-name
      doc: (_id: string) => ({
        valueChanges: () => new BehaviorSubject({ foo: 'bar' }),
        // tslint:disable-next-line: variable-name
        set: (_d: any) => new Promise((resolve, _reject) => resolve())
      })
    })
  };

  const AuthServiceStub = {
    user$: of({
      uid: 'test'
    })
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HasInitializedAccountGuard,
        { provide: AngularFireAuth, useValue: AngularFireMocks },
        { provide: AngularFirestore, useValue: FirestoreStub },
        { provide: AuthService, useValue: AuthServiceStub }
      ],
      imports: [RouterTestingModule]
    });
  });

  it('should compile', inject([HasInitializedAccountGuard], (guard: HasInitializedAccountGuard) => {
    expect(guard).toBeTruthy();
  }));
});
