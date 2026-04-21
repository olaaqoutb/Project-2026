import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusPanelListComponent } from './status-panel-list.component';

describe('StatusPanelListComponent', () => {
  let component: StatusPanelListComponent;
  let fixture: ComponentFixture<StatusPanelListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusPanelListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusPanelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
