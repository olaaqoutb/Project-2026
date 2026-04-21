import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StempelzeitList2Component } from './stempelzeit-list-2.component';

describe('StempelzeitList2Component', () => {
  let component: StempelzeitList2Component;
  let fixture: ComponentFixture<StempelzeitList2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StempelzeitList2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StempelzeitList2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
