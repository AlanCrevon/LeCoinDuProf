import { TestBed } from '@angular/core/testing';

import { FirestorageService } from '../../../services/firestorage.service';

describe('FirestorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirestorageService = TestBed.get(FirestorageService);
    expect(service).toBeTruthy();
  });
});
