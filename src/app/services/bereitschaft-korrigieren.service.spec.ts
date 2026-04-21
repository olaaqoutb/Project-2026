import { TestBed } from '@angular/core/testing';

import { BereitschaftKorrigierenService } from './bereitschaft-korrigieren.service';

describe('BereitschaftKorrigierenService', () => {
  let service: BereitschaftKorrigierenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BereitschaftKorrigierenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
