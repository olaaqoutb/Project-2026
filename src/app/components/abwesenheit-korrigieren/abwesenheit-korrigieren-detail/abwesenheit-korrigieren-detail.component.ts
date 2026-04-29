import {ChangeDetectorRef, Component} from '@angular/core';
import {TimeBoxComponent} from '../../../shared/components/time-box/time-box.component';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ActivatedRoute, Router} from '@angular/router';

import {FormValidationService} from '../../../services/utils/form-validation.service';
import {DateParserService} from '../../../services/utils/date-parser.service';
import {DummyService} from '../../../services/dummy.service';
import {ApiStempelzeit} from '../../../models/ApiStempelzeit';
import {ApiZeitTyp} from '../../../models/ApiZeitTyp';

import {ApiGetItEntitaet} from '../../../models/ApiGetItEntitaet';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {CustomDateAdapter} from '../../../services/custom-date-adapter.service';
import {ConfirmationDialogComponent} from '../../confirmation-dialog/confirmation-dialog/confirmation-dialog.component';
import {AbwesenheitKorrigierenService} from '../../../services/abwesenheit-korrigieren.service';
import {ApiPerson} from '../../../models/ApiPerson';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
  MatTableModule
} from '@angular/material/table';
import {DateUtilsService} from '../../../services/utils/date-utils.service';
import {getEnumKeyByValue} from '../../../services/utils/enum.utils';
import {ParsedDateTime} from '../../../models/ui-models/date-time-ui';
import {InfoDialogComponent} from '../../dialogs/info-dialog/info-dialog.component';
import {ErrorDialogComponent} from '../../dialogs/error-dialog/error-dialog.component';
import {StatusPanelService} from '../../../services/utils/status-panel-status.service';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {AppConstants} from '../../../models/app-constants';
import {MatTooltipModule} from '@angular/material/tooltip';
import {DeleteConfirmDialogComponent} from '../../delete-confirm-dialog/delete-confirm-dialog.component';
import {Subject, takeUntil} from 'rxjs';
import {dateRangeValidatorKorrigieren} from '../../../validators/abwesenheit-form.validators';
import {ABWESENHEIT_FORM_ERRORS} from '../../../validators/abwesenheit-form.errors';


export const DATE_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD.MM.YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-abwesenheit-korrigieren-detail',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,

    MatTableModule,
    MatTooltipModule,
    TimeBoxComponent,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS }
  ],
  templateUrl: './abwesenheit-korrigieren-detail.component.html',
  styleUrl: './abwesenheit-korrigieren-detail.component.scss'
})
export class AbwesenheitKorrigierenDetailComponent {

  abwesenheitForm: FormGroup;
  selectedAbwesenheit: ApiStempelzeit | null = null;
  isEditing = false;
  isCreatingNew = false;
  isLoading = true;
  personName = '';
  personId: string | null = null;
  selectedIndex = -1;
  selectedPerson: ApiPerson = {};
  dataSource = new MatTableDataSource<ApiStempelzeit>();
  selectedRow: ApiStempelzeit | null = null;
  abwesenheiten: ApiStempelzeit[] = [];

  private destroy$ = new Subject<void>();

  // field names used in this component's form
  private readonly FIELDS = {
    startDate:    'startDatum',
    startHours:   'startStunde',
    startMinutes: 'startMinuten',
    endDate:      'endeDatum',
    endHours:     'endeStunde',
    endMinutes:   'endeMinuten',
  };

  displayedColumns: string[] = ['login', 'logoff'];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private abwesenheitKorrigierenService: AbwesenheitKorrigierenService,
    private statusPanelService: StatusPanelService,
    private cdr: ChangeDetectorRef
  ) {
    this.abwesenheitForm = this.createForm();
  }

  ngOnInit(): void {
    this.selectedPerson = history.state?.selectedPerson;
    this.personName = `${this.selectedPerson.vorname} ${this.selectedPerson.nachname}`;

    this.loadData();
    this.listenToTimeFieldChanges();
    this.listenToStartDateChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─── Form Setup ────────────────────────────────────────────────────────────

  private createForm(): FormGroup {
    return this.fb.group(
      {
        startDatum:   [new Date(), Validators.required],
        startStunde:  [0,  [Validators.required, Validators.min(0), Validators.max(24)]],
        startMinuten: [0,  [Validators.required, Validators.min(0), Validators.max(59)]],
        endeDatum:    [new Date()],
        endeStunde:   [24, [Validators.required, Validators.min(0), Validators.max(24)]],
        endeMinuten:  [0,  [Validators.required, Validators.min(0), Validators.max(59)]],
        anmerkung:    ['']
      },
      // ← reuse shared validator with this component's field names
      { validators: dateRangeValidatorKorrigieren(this.FIELDS ) }
    );
  }

  private listenToTimeFieldChanges(): void {
    ['startStunde', 'startMinuten', 'endeStunde', 'endeMinuten'].forEach(field => {
      this.abwesenheitForm.get(field)?.valueChanges
        .pipe(takeUntil(this.destroy$))  // ← no more subscription leak
        .subscribe(() => this.abwesenheitForm.updateValueAndValidity());
    });

  }

  private listenToStartDateChanges(): void {
    this.abwesenheitForm.get('startDatum')?.valueChanges
      .pipe(takeUntil(this.destroy$))  // ← no more subscription leak
      .subscribe(selectedDate => {
        if (!selectedDate) return;

        const startDate = new Date(selectedDate);
        startDate.setHours(0, 0, 0, 0);

        const endDateControl = this.abwesenheitForm.get('endeDatum');
        const endDateValue = endDateControl?.value;

        if (!endDateValue) {
          endDateControl?.patchValue(new Date(selectedDate), { emitEvent: false });
          return;
        }

        const endDate = new Date(endDateValue);
        endDate.setHours(0, 0, 0, 0);

        if (startDate >= endDate) {
          endDateControl?.patchValue(new Date(selectedDate), { emitEvent: false });
        }

        this.abwesenheitForm.updateValueAndValidity();
      });
  }

  // ─── Load Data ─────────────────────────────────────────────────────────────

  loadData(): void {
    this.isLoading = true;
    this.personId = this.route.snapshot.paramMap.get('id');
    const startTime = Date.now();

    this.abwesenheitKorrigierenService.getPersonAbwesenheitsListe(this.personId!).subscribe({
      next: (response: HttpResponse<ApiStempelzeit[]>) => {
        const duration = Date.now() - startTime;
        this.abwesenheiten = this.sortByLoginDate(response.body!, 'asc');
        this.dataSource.data = this.abwesenheiten;
        this.isLoading = false;
        this.statusPanelService.addMessageRequest(AppConstants.MSG_ABWESENHEITEN_LOADED_SUCCESS, 'GET', duration, response);
      },
      error: (error: HttpErrorResponse) => {
        const duration = Date.now() - startTime;
        this.isLoading = false;
        this.statusPanelService.addMessageRequest(AppConstants.MSG_ABWESENHEITEN_LOADED_ERROR, 'GET', duration, error);
      }
    });
  }

  // ─── Row Selection ─────────────────────────────────────────────────────────

  openAbwesenheitDetails(abwesenheit: ApiStempelzeit, index: number): void {
    this.selectedAbwesenheit = abwesenheit;
    this.selectedRow = abwesenheit;
    this.selectedIndex = index;
    this.isEditing = false;
    this.isCreatingNew = false;
    this.populateForm(abwesenheit);
    this.abwesenheitForm.disable();
  }

  private populateForm(entry: ApiStempelzeit): void {
    const loginDate  = new Date(entry.login  || '');
    const logoffDate = new Date(entry.logoff || '');
    const endDate    = DateUtilsService.parseGermanDateTimeToComponents(
      DateUtilsService.formatDateTimeWithoutSeconds(logoffDate)
    );

    this.abwesenheitForm.patchValue({
      startDatum:   loginDate,
      startStunde:  loginDate.getHours(),
      startMinuten: loginDate.getMinutes(),
      endeDatum:    DateUtilsService.parseGermanDate(endDate?.date!),
      endeStunde:   endDate?.hours,
      endeMinuten:  endDate?.minutes,
      anmerkung:    entry.anmerkung || ''
    });
  }

  // ─── Create / Edit ─────────────────────────────────────────────────────────

  addNewStempelzeit(): void {
    const now = new Date();
    this.isCreatingNew = true;
    this.isEditing = true;
    this.selectedAbwesenheit = null;
    this.selectedIndex = -1;

    this.abwesenheitForm.reset();
    this.abwesenheitForm.enable();
    this.abwesenheitForm.patchValue({
      startDatum: now, startStunde: 0, startMinuten: 0,
      endeDatum:  now, endeStunde:  0, endeMinuten:  0,
      anmerkung: ''
    });
  }

  cancelFormChanges(): void {
    if (this.isCreatingNew) {
      this.selectedAbwesenheit = null;
      this.abwesenheitForm.reset();
      this.isCreatingNew = false;
    } else if (this.selectedAbwesenheit) {
      this.populateForm(this.selectedAbwesenheit);
    }
    this.isEditing = false;
    this.abwesenheitForm.disable();
  }

  // ─── Save ──────────────────────────────────────────────────────────────────

  saveAbwesenheit(): void {
    const formValue = this.abwesenheitForm.getRawValue();

    if (!formValue.startDatum || isNaN(new Date(formValue.startDatum).getTime())) {
      return this.openErrorDialog('startDateRequired');
    }

    if (this.abwesenheitForm.invalid) {
      return this.openErrorDialog(this.getFirstFormError());
    }

    if (!this.validateHour24Rule(formValue, 'start') ||
      !this.validateHour24Rule(formValue, 'end')) {
      return;
    }

    if (this.isCreatingNew) {
      this.saveNewAbwesenheit(formValue);
    } else if (this.selectedAbwesenheit) {
      this.updateAbwesenheit(formValue);
    }
  }

  private saveNewAbwesenheit(formValue: any): void {
    const startTime = Date.now();
    const loginDate = new Date(formValue.startDatum);
    loginDate.setHours(formValue.startStunde, formValue.startMinuten, 0, 0);

    const logoffDate = formValue.endeDatum ? new Date(formValue.endeDatum) : null;
    if (logoffDate) logoffDate.setHours(formValue.endeStunde, formValue.endeMinuten, 0, 0);

    const newEntry: ApiStempelzeit = {
      version: 1,
      deleted: false,
      login:   DateUtilsService.formatDateToISOFull(loginDate),
      logoff:  logoffDate ? DateUtilsService.formatDateToISOFull(logoffDate) : undefined,
      anmerkung: formValue.anmerkung || '',
      zeitTyp:   'ABWESENHEIT' as ApiZeitTyp,
      poKorrektur: false,
      marker: undefined
    };

    this.abwesenheitKorrigierenService.createAbwesenheit_(this.personId!, newEntry).subscribe({
      next: (response: HttpResponse<ApiStempelzeit>) => {
        const duration = Date.now() - startTime;
        this.dataSource.data = this.sortByLoginDate([response.body!, ...this.dataSource.data], 'asc');
        this.abwesenheiten = this.dataSource.data;
        this.selectedAbwesenheit = response.body!;
        this.afterSave();
        this.statusPanelService.addMessageRequest(AppConstants.MSG_ABWESENHEITEN_CREATED_SUCCESS, 'POST', duration, response);
      },
      error: (error) => {
        const duration = Date.now() - startTime;
        this.openErrorDialog('default', error.error);
        this.statusPanelService.addMessageRequest(error.error, 'POST', duration, error);
      }
    });
  }

  private updateAbwesenheit(formValue: any): void {
    if (!this.selectedAbwesenheit) return;
    const startTime = Date.now();

    const loginDate = new Date(this.abwesenheitForm.get('startDatum')?.value);
    loginDate.setHours(formValue.startStunde, formValue.startMinuten, 0, 0);

    const logoffDate = new Date(this.abwesenheitForm.get('endeDatum')?.value);
    logoffDate.setHours(formValue.endeStunde, formValue.endeMinuten, 0, 0);

    const updated: ApiStempelzeit = {
      id:      this.selectedAbwesenheit.id,
      person:  this.selectedPerson,
      version: this.selectedAbwesenheit.version,
      deleted: false,
      login:   DateUtilsService.formatDateToISOFull(loginDate),
      logoff:  DateUtilsService.formatDateToISOFull(logoffDate),
      anmerkung:   formValue.anmerkung || '',
      zeitTyp:     'ABWESENHEIT' as ApiZeitTyp,
      poKorrektur: false,
      marker: undefined
    };

    this.abwesenheitKorrigierenService.updateAbwesenheit(this.selectedAbwesenheit.id!, updated).subscribe({
      next: (response: HttpResponse<ApiStempelzeit>) => {
        const duration = Date.now() - startTime;
        const index = this.dataSource.data.findIndex(e => e.id === response.body!.id);
        if (index >= 0) {
          const updatedData = [...this.dataSource.data];
          updatedData[index] = response.body!;
          this.dataSource.data = this.sortByLoginDate(updatedData, 'asc');
          this.abwesenheiten = this.dataSource.data;
          this.selectedAbwesenheit = { ...response.body };
        }
        this.afterSave();
        this.statusPanelService.addMessageRequest(AppConstants.MSG_ABWESENHEITEN_UPDATED_SUCCESS, 'POST', duration, response);
      },
      error: (error) => {
        const duration = Date.now() - startTime;
        this.openErrorDialog('default', error.error);
        this.statusPanelService.addMessageRequest(AppConstants.MSG_ABWESENHEITEN_UPDATED_ERROR, 'POST', duration, error);
      }
    });
  }

  // ─── Delete ────────────────────────────────────────────────────────────────

  async deleteStempelzeit(): Promise<void> {
    if (!this.selectedAbwesenheit || this.isCreatingNew) return;

    const confirmed = await this.showDeleteConfirmation();
    if (!confirmed) return;

    const startTime = Date.now();
    this.selectedAbwesenheit.deleted = true;

    this.abwesenheitKorrigierenService.updateAbwesenheit(
      this.selectedAbwesenheit.id!, this.selectedAbwesenheit
    ).subscribe({
      next: (response: HttpResponse<ApiStempelzeit>) => {
        const duration = Date.now() - startTime;
        this.dataSource.data = this.dataSource.data.filter(e => e.id !== response.body!.id);
        this.abwesenheiten = this.dataSource.data;
        this.selectedAbwesenheit = null;
        this.abwesenheitForm.reset();
        this.statusPanelService.addMessageRequest(AppConstants.MSG_ABWESENHEITEN_DELETED_SUCCESS, 'POST', duration, response);
      },
      error: (error) => {
        const duration = Date.now() - startTime;
        this.statusPanelService.addMessageRequest(AppConstants.MSG_ABWESENHEITEN_DELETED_ERROR, 'POST', duration, error);
      }
    });
  }

  private async showDeleteConfirmation(): Promise<boolean> {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '450px',
      data: {
        absence: {
          name: this.formatDateTime(this.selectedAbwesenheit?.login),
          date: this.formatDateTime(this.selectedAbwesenheit?.logoff)
        }
      }
    });
    return await dialogRef.afterClosed().toPromise() === true;
  }

  // ─── Error Handling ────────────────────────────────────────────────────────

  private getFirstFormError(): string {
    const errors = this.abwesenheitForm.errors;
    if (!errors) return 'default';
    return Object.keys(errors)[0] ?? 'default';
  }

  private openErrorDialog(errorKey: string, customDetail?: string): void {
    console.log('XXX--errorKey', errorKey);
    console.log('XXX- ERROR MESSAGE FROM ARRAY',  ABWESENHEIT_FORM_ERRORS[errorKey] );
    const error = ABWESENHEIT_FORM_ERRORS[errorKey] ?? ABWESENHEIT_FORM_ERRORS['default'];
    this.dialog.open(ErrorDialogComponent, {
      data: { title: error.title, detail: customDetail ?? error.detail },
      panelClass: 'custom-dialog-width'
    });
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  private afterSave(): void {
    this.dialog.open(InfoDialogComponent, {
      data: { title: 'Erfolgreich gespeichert', detail: 'Die Änderungen wurden erfolgreich gespeichert!' },
      panelClass: 'custom-dialog-width'
    });
    this.isEditing = false;
    this.isCreatingNew = false;
    this.abwesenheitForm.disable();
    this.cdr.detectChanges();
  }

  private validateHour24Rule(formValue: any, type: 'start' | 'end'): boolean {
    const hour   = type === 'start' ? formValue.startStunde  : formValue.endeStunde;
    const minute = type === 'start' ? formValue.startMinuten : formValue.endeMinuten;

    if (hour === 24 && minute !== 0) {
      this.snackBar.open(
        `${type === 'start' ? 'Start' : 'Ende'}: Bei 24 Stunden müssen die Minuten 0 sein`,
        'Schließen', { duration: 5000, verticalPosition: 'top' }
      );
      return false;
    }
    return true;
  }

  adjustTime(type: 'start' | 'end', unit: 'hour' | 'minute', amount: number): void {
    if (!this.isEditing && !this.isCreatingNew) return;

    const controlName =
      type === 'start' && unit === 'hour'   ? 'startStunde'  :
        type === 'start' && unit === 'minute' ? 'startMinuten' :
          type === 'end'   && unit === 'hour'   ? 'endeStunde'   : 'endeMinuten';

    const control = this.abwesenheitForm.get(controlName);
    if (!control) return;

    const max = unit === 'hour' ? 24 : 59;
    let newVal = (control.value || 0) + amount;
    newVal = newVal < 0 ? max : newVal > max ? 0 : newVal;
    control.setValue(newVal);

    // reset minutes if hour is set to 24
    if (unit === 'hour' && newVal === 24) {
      const minuteField = type === 'start' ? 'startMinuten' : 'endeMinuten';
      this.abwesenheitForm.get(minuteField)?.setValue(0);
    }

    // prevent minute changes when hour is 24
    if (unit === 'minute') {
      const hourField = type === 'start' ? 'startStunde' : 'endeStunde';
      if (this.abwesenheitForm.get(hourField)?.value === 24) {
        control.setValue(0);
        return;
      }
    }
  }

  getRowClass(row: ApiStempelzeit): string {
    const classes = ['list-row'];
    if (row.logoff && new Date(row.logoff) < new Date()) classes.push('inactive-row');
    if (this.selectedRow === row) classes.push('selected-row');
    return classes.join(' ');
  }

  getRowDateStatus(element: ApiStempelzeit): string {
    const now   = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const beginn = element.login  ? new Date(element.login)  : null;
    const ende   = element.logoff ? new Date(element.logoff) : null;

    if (ende && ende < now) return 'row-past';

    const beginnOnly = beginn ? new Date(beginn.setHours(0, 0, 0, 0)) : null;
    const endeOnly   = ende   ? new Date(new Date(element.logoff!).setHours(0, 0, 0, 0)) : null;

    if (
      (beginnOnly && beginnOnly.getTime() === today.getTime()) ||
      (endeOnly   && endeOnly.getTime()   === today.getTime())
    ) return 'row-today';

    return 'row-today';
  }

  formatDateTime(dateString: string | undefined): string {
    if (!dateString) return '-';
    return DateUtilsService.formateDateWithoutSeconds(new Date(dateString));
  }

  formatDateTimeEnde(dateString: string | undefined): string {
    if (!dateString) return '-';
    return DateUtilsService.formatDateTimeWithoutSeconds(new Date(dateString));
  }

  formatTimeValue(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  private sortByLoginDate(data: ApiStempelzeit[], order: 'asc' | 'desc' = 'desc'): ApiStempelzeit[] {
    return [...data].sort((a, b) => {
      const dateA = a.login ? new Date(a.login).getTime() : 0;
      const dateB = b.login ? new Date(b.login).getTime() : 0;
      return order === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }


  private lastWheelAdjust = 0;
  onTimeWheel(type: 'start' | 'end', unit: 'hour' | 'minute', event: WheelEvent): void {
    if (!this.isEditing && !this.isCreatingNew) return;
    event.preventDefault();
    const now = Date.now();
    if (now - this.lastWheelAdjust < 120) return;
    this.lastWheelAdjust = now;
    const amount = event.deltaY < 0 ? 1 : -1;
    this.adjustTime(type, unit, amount);
  }

  onTimeInput(field: string, event: Event, max: number): void {
    const input = event.target as HTMLInputElement;

    input.value = input.value.replace(/[^0-9]/g, '');

    if (input.value === '') {
      this.abwesenheitForm.get(field)?.patchValue(0, { emitEvent: true });
      return;
    }

    let num = parseInt(input.value, 10);

    if (num > max) {
      const lastDigit = parseInt(input.value[input.value.length - 1], 10);
      num = lastDigit;
      input.value = String(num);
    }

    this.abwesenheitForm.get(field)?.patchValue(num, { emitEvent: true });
    this.abwesenheitForm.updateValueAndValidity();
  }
  goBackToList(): void {
    this.router.navigate(['/abwesenheit-korrigieren']);
  }
}
