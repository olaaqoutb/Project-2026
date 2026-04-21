import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreigabeListComponent } from './freigabe-list.component';

describe('FreigabeListComponent', () => {
  let component: FreigabeListComponent;
  let fixture: ComponentFixture<FreigabeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreigabeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreigabeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
