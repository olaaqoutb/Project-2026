import { TestBed } from '@angular/core/testing';

import { TimeCalculationService } from './time-calculation.service';

describe('TimeCalculationService', () => {
  let service: TimeCalculationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeCalculationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
