import { TestBed, async, inject } from '@angular/core/testing';

import { HasInitializedAccountGuard } from './has-initialized-account.guard';

describe('HasInitializedAccountGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HasInitializedAccountGuard]
    });
  });

  it('should ...', inject([HasInitializedAccountGuard], (guard: HasInitializedAccountGuard) => {
    expect(guard).toBeTruthy();
  }));
});
