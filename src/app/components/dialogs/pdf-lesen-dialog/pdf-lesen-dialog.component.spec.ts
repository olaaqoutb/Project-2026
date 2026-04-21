import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfLesenDialogComponent } from './pdf-lesen-dialog.component';

describe('PdfLesenDialogComponent', () => {
  let component: PdfLesenDialogComponent;
  let fixture: ComponentFixture<PdfLesenDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfLesenDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfLesenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
