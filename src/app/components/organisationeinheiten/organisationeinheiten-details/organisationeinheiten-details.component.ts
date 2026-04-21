import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DateAdapter } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { Datalistorganizationanc } from '../../../models/datalistorganizationanc';
import { ErrorHandlingService } from '../../../services/error-handling.service';
import { PersonenService } from '../../../services/personen.service';
import { forkJoin } from 'rxjs';
import {ApiOrganisationseinheit} from '../../../models/ApiOrganisationseinheit';
import {SharedDataServiceService} from '../../../services/shared-data-service.service';
import {OrganisationseinheitService} from '../../../services/organisationseinheit.service';
import {ApiMitarbeiterart} from '../../../models/ApiMitarbeiterart';
import {ApiPerson} from '../../../models/ApiPerson';
import {CustomDateAdapter} from '../../../services/custom-date-adapter.service';
import {
  DATE_FORMATS
} from '../../bereitschaftszeiten/bereitschaftszeiten-details/bereitschaftszeiten-details.component';


@Component({
  selector: 'app-organisationeinheiten-details',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSnackBarModule
  ],

  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS }
  ],
  templateUrl: './organisationeinheiten-details.component.html',
  styleUrl: './organisationeinheiten-details.component.scss'
})
export class OrganisationeinheitenDetailsComponent {
  organisationseinheitForm: FormGroup;
  isNewOrganisationseinheit = true;
  isFormEditable = false;
  loading = false;
  saving = false;
  selectedOrganization: ApiOrganisationseinheit | null = null;

  dataSource: ApiOrganisationseinheit[] = [];
  uebergeordneteEinheiten: ApiOrganisationseinheit[] = [];
  leitungPersonen: ApiPerson[] = [];
  selectedId : string | undefined; // or string, depending on your ID type
  selectedParentId  : string | undefined;

  constructor(
    private dateAdapter: DateAdapter<Date>,
    private fb: FormBuilder,
    private router: Router,
    private OrganisationseinheitService: OrganisationseinheitService,
    private snackBar: MatSnackBar,
    private errorHandlingService : ErrorHandlingService,
    private personenService : PersonenService

  ) {
    this.organisationseinheitForm = this.createForm();
    this.dateAdapter.setLocale('de-DE'); // Set German locale

  }


  ngOnInit(): void {
    this.selectedOrganization = history.state?.selectedOrganisation;

    if(this.selectedOrganization ){
      console.log('Selected-Org', this.selectedOrganization);
      this.isNewOrganisationseinheit = false;
    }else{
      console.log('New Organisation ' + new Date());
      this.isNewOrganisationseinheit = true;
    }

    forkJoin([
      this.OrganisationseinheitService.getActiveData(),
      this.personenService.loadPersonen()
    ]).subscribe({
      next: ([orgData, personData]) => {

        this.uebergeordneteEinheiten = orgData.sort((a, b) => {
          const nameA = a.kurzBezeichnung?.toLowerCase() || '';
          const nameB = b.kurzBezeichnung?.toLowerCase() || '';
          return nameA.localeCompare(nameB);
        });

        // Filter and sort leitungPersonen
        this.leitungPersonen = personData
          .filter(person => person.mitarbeiterart !== ApiMitarbeiterart.ZIVILDIENSTLEISTENDER)// 'ZIVILDIENSTLEISTENDER')
          .sort((a, b) => {
            const nameA = a.nachname?.toLowerCase() || '';
            const nameB = b.nachname?.toLowerCase() || '';
            return nameA.localeCompare(nameB);
          });

        if (this.selectedOrganization) {

          this.selectedId = this.selectedOrganization.parent?.id;
          this.selectedParentId = this.selectedOrganization.leiter?.id;
          console.log('ORG', this.selectedOrganization);
          console.log('ORG-LEITER', this.selectedOrganization.leiter?.id);


          console.log('selectedId-ORG', this.selectedId);
          const preselectedEinheit = this.uebergeordneteEinheiten.find(
            einheit => einheit.id === this.selectedId
          );

          const preselectedLeiter = this.leitungPersonen.find(
            person => person.id === this.selectedParentId
          );



          this.isNewOrganisationseinheit = false;

          this.organisationseinheitForm.patchValue({
            bezeichnung: this.selectedOrganization.bezeichnung || '',
            kurzbezeichnung: this.selectedOrganization.kurzBezeichnung || '',
            gueltigVon: this.selectedOrganization.gueltigVon ? new Date(this.selectedOrganization.gueltigVon) : null,
            gueltigBis: this.selectedOrganization.gueltigBis ? new Date(this.selectedOrganization.gueltigBis) : null,
            leitung: preselectedLeiter,
            uebergeordneteEinheitId: preselectedEinheit,// org.parent?.kurzBezeichnung || '',
            testId : '',
            email: this.selectedOrganization.email || '',
          });


          this.organisationseinheitForm.disable();
          this.isFormEditable = false;
        } else {
          this.organisationseinheitForm.enable();
          this.isFormEditable = true;
        }
      }
    });


     this.OrganisationseinheitService.getActiveData().subscribe(data => {
      this.dataSource = data; // <-- assign the emitted array to dataSource
    });
  }



  compareOrganisationEinheit(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  comparePerson(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }




  createForm(): FormGroup {
    return this.fb.group({
      bezeichnung: ['', Validators.required],
      kurzbezeichnung: [''],
      hierarchieEbene: [''],
      uebergeordneteEinheitId: [null],
      parent: [null],

      gueltigVon: [''],
      gueltigBis: [''],
      leitung: [null],
      kostenstelle: [''],

      fax: [''],
      email: ['', Validators.email],
      testId : ['']
    });
  }

  onEditOrSubmit(): void {
    if (!this.isFormEditable) {
      this.organisationseinheitForm.enable();
      this.isFormEditable = true;
    } else {
      this.onSubmit();
    }
  }


  onSubmit(): void {
    if (this.organisationseinheitForm.invalid) {
      this.markFormGroupTouched(this.organisationseinheitForm);
      return;
    }

    const formData = this.organisationseinheitForm.value;
    const id = this.selectedOrganization?.id;

    console.log(' formData.leitung',  formData.leitung);
    console.log(' formData.leitung-vorname',  formData.leitung.vorname);
    console.log(' formData.leitung-nachname',  formData.leitung.nachname);
    console.log(' formData.parent',  formData.uebergeordneteEinheitId);
    console.log(' formData-Full',  formData);


    const newOrUpdatedOrg: ApiOrganisationseinheit = {
      id,
      version: this.selectedOrganization?.version,
      deleted: false,
      bezeichnung: formData.bezeichnung,
      kurzBezeichnung: formData.kurzbezeichnung,
      gueltigVon: formData.gueltigVon,
      gueltigBis: formData.gueltigBis,
      email: [formData.email],
      parent : formData.uebergeordneteEinheitId,
      leiter: formData.leitung
        ? {
          id: formData.leitung.id,
          vorname: formData.leitung.vorname,
          nachname: formData.leitung.nachname,
          recht: [],
          funktion: [],
          vertrag: []
        }
        : undefined
    };


    console.log('newOrUpdatedOrg', newOrUpdatedOrg);
    console.log('isNewOrganisationseinheit', this.isNewOrganisationseinheit);

    if (this.isNewOrganisationseinheit) {
      this.OrganisationseinheitService.createOrganisation(newOrUpdatedOrg).subscribe({
        next : (response : ApiOrganisationseinheit) => {
          console.log('Organisationseinheit created successfully:', response);

        },
        error : (err) => {
          console.error('Error by creating new Organisationseinheit: ', err);
          this.errorHandlingService.handleAppError(err);
        }
      });
    } else {

      this.OrganisationseinheitService.updateOrganisation( newOrUpdatedOrg).subscribe({
        next: (response) => {
          console.log('Organisationseinheit updated successfully:', response);
          // Optionally refresh data or show success message
        },
        error: (err) => {
          console.error('Error updating Organisationseinheit:', err);
          this.errorHandlingService.handleAppError(err);
        }
      });

      //    this.OrganisationseinheitService.updateOrganization(newOrUpdatedOrg);
    }

    this.saving = false;
    this.organisationseinheitForm.disable();
    this.isFormEditable = false;

    this.snackBar.open('Daten wurden erfolgreich gespeichert', 'Schließen', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });

    this.router.navigate(['/organisationseinheiten']);
  }

  onCancel(): void {
    this.router.navigate(['/organisationseinheiten']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onDateInput(field: string, event: MatDatepickerInputEvent<Date>) {
    const inputValue = event.target.value;
   }

  onDateChange(field: string, event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      this.organisationseinheitForm.get(field)?.setValue(event.value);
    }
  }

}
