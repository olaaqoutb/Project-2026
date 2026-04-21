import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreigabeKorigierenListComponent } from './freigabe-korigieren-list.component';

describe('FreigabeKorigierenListComponent', () => {
  let component: FreigabeKorigierenListComponent;
  let fixture: ComponentFixture<FreigabeKorigierenListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreigabeKorigierenListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreigabeKorigierenListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
