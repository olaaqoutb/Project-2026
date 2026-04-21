import { TestBed } from '@angular/core/testing';

import { VertragService } from './vertrag.service';

describe('VertragService', () => {
  let service: VertragService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VertragService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
