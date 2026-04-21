import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StempelzeitDetails2Component } from './stempelzeit-details-2.component';

describe('StempelzeitDetails2Component', () => {
  let component: StempelzeitDetails2Component;
  let fixture: ComponentFixture<StempelzeitDetails2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StempelzeitDetails2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StempelzeitDetails2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
