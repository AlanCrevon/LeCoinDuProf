import { TestBed } from '@angular/core/testing';

import { MessagingService } from './messaging.service';

describe('MessagingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MessagingService = TestBed.inject(MessagingService);
    expect(service).toBeTruthy();
  });
});
