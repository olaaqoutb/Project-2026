import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugConfigComponent } from './debug-config.component';

describe('DebugConfigComponent', () => {
  let component: DebugConfigComponent;
  let fixture: ComponentFixture<DebugConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebugConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebugConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
