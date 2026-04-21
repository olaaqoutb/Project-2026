import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZivildienerDetailComponent } from './zivildiener-detail.component';

describe('ZivildienerDetailComponent', () => {
  let component: ZivildienerDetailComponent;
  let fixture: ComponentFixture<ZivildienerDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZivildienerDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZivildienerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
