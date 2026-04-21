import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VertragList2Component } from './vertrag-list-2.component';

describe('VertragList2Component', () => {
  let component: VertragList2Component;
  let fixture: ComponentFixture<VertragList2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VertragList2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VertragList2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
