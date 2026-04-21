import { TestBed } from '@angular/core/testing';

import { AuswertungenService } from './auswertungen.service';

describe('AuswertungenService', () => {
  let service: AuswertungenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuswertungenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
