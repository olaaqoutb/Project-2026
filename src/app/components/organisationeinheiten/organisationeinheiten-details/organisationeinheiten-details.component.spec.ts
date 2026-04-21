import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationeinheitenDetailsComponent } from './organisationeinheiten-details.component';

describe('OrganisationeinheitenDetailsComponent', () => {
  let component: OrganisationeinheitenDetailsComponent;
  let fixture: ComponentFixture<OrganisationeinheitenDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganisationeinheitenDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganisationeinheitenDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
