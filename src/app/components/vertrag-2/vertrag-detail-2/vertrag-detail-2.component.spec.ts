import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VertragDetail2Component } from './vertrag-detail-2.component';

describe('VertragDetail2Component', () => {
  let component: VertragDetail2Component;
  let fixture: ComponentFixture<VertragDetail2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VertragDetail2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VertragDetail2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
