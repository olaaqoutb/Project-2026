import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationeinheitenListComponent } from './organisationeinheiten-list.component';

describe('OrganisationeinheitenListComponent', () => {
  let component: OrganisationeinheitenListComponent;
  let fixture: ComponentFixture<OrganisationeinheitenListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganisationeinheitenListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganisationeinheitenListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
