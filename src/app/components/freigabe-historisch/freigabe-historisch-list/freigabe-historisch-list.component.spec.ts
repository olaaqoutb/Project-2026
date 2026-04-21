import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreigabeHistorischListComponent } from './freigabe-historisch-list.component';

describe('FreigabeHistorischListComponent', () => {
  let component: FreigabeHistorischListComponent;
  let fixture: ComponentFixture<FreigabeHistorischListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreigabeHistorischListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreigabeHistorischListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
