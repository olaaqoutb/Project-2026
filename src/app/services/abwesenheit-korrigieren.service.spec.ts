import { TestBed } from '@angular/core/testing';

import { AbwesenheitKorrigierenService } from './abwesenheit-korrigieren.service';

describe('AbwesenheitKorrigierenService', () => {
  let service: AbwesenheitKorrigierenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbwesenheitKorrigierenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
