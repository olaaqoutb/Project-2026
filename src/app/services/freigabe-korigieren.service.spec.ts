import { TestBed } from '@angular/core/testing';

import { FreigabeKorigierenService } from './freigabe-korigieren.service';

describe('FreigabeKorigierenService', () => {
  let service: FreigabeKorigierenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FreigabeKorigierenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
