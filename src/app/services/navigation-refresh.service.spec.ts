import { TestBed } from '@angular/core/testing';

import { NavigationRefreshService } from './navigation-refresh.service';

describe('NavigationRefreshService', () => {
  let service: NavigationRefreshService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavigationRefreshService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
