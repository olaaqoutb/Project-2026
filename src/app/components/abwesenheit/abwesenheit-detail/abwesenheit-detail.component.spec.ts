import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbwesenheitDetailComponent } from './abwesenheit-detail.component';

describe('AbwesenheitDetailComponent', () => {
  let component: AbwesenheitDetailComponent;
  let fixture: ComponentFixture<AbwesenheitDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbwesenheitDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbwesenheitDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
