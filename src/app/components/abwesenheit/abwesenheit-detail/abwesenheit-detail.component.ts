import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy, OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import {CreateAbsenceRequest,} from '../../../models/absence.interface';
  import {DateUtilsService} from '../../../services/utils/date-utils.service';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {DeleteConfirmDialogComponent} from '../../delete-confirm-dialog/delete-confirm-dialog.component';
import {AbwesenheitService} from '../../../services/abwesenheit.service';
import {ErrorDialogComponent} from '../../dialogs/error-dialog/error-dialog.component';
import {InfoDialogComponent} from '../../dialogs/info-dialog/info-dialog.component';
import {ApiStempelzeit} from '../../../models/ApiStempelzeit';
import {ApiZeitTyp,  zeitTypToBackendKey} from '../../../models/ApiZeitTyp';
import {ApiStempelzeitEintragungsart} from '../../../models/ApiStempelzeitEintragungsart';
import {CustomDateAdapter} from '../../../services/custom-date-adapter.service';
import {
  DATE_FORMATS
} from '../../abwesenheit-korrigieren/abwesenheit-korrigieren-detail/abwesenheit-korrigieren-detail.component';
import {HttpResponse} from '@angular/common/http';
import {StatusPanelService} from '../../../services/utils/status-panel-status.service';
import {AppConstants} from '../../../models/app-constants';
import {ApiStempelzeitMarker} from '../../../models/ApiStempelzeitMarker';
import {MatTooltipModule} from '@angular/material/tooltip';
import {Subject, takeUntil} from 'rxjs';
import {dateRangeValidator} from '../../../validators/abwesenheit-form.validators';
import {ABWESENHEIT_FORM_ERRORS} from '../../../validators/abwesenheit-form.errors';
import {TimeBoxComponent} from '../../../shared/components/time-box/time-box.component';


@Component({
  selector: 'app-abwesenheit-detail',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule, MatTooltipModule,
    TimeBoxComponent,],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS }
  ],
  templateUrl: './abwesenheit-detail.component.html',
  styleUrl: './abwesenheit-detail.component.scss'
})



export class AbwesenheitDetailComponent implements OnInit, OnChanges, OnDestroy {

  @Input() abwesenheitId: string | null = null;
  @Input() abwesenheit: ApiStempelzeit | null = null;
  @Input() createMode: boolean = false;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  abwesenheitForm: FormGroup;
  loading = false;
  submitting = false;
  isNew = true;
  editMode = false;
  showForm = false;

  private originalValue: any = null;
  private destroy$ = new Subject<void>();

  // drag state
  private isDragging = false;
  private dragStartY = 0;
  private dragStartValue = 0;
  private activeDragField = '';

  constructor(
    private fb: FormBuilder,
    private abwesenheitService: AbwesenheitService,
    private statusPanelService: StatusPanelService,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    this.abwesenheitForm = this.createForm();
  }

  ngOnInit(): void {
    this.listenToStartDateChanges();
  //  this.loadAbwesenheitenData();


    this.abwesenheitService.refresh$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.resetOnNavigate();        // ← hide form / restore state first
        this.loadAbwesenheitenData();
      });
    /*
       this.abwesenheitService.refresh$
         .pipe(takeUntil(this.destroy$))
         .subscribe(() => {

           this.loadAbwesenheitenData()
         });*/
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['abwesenheitId'] || changes['createMode']) {
      this.loadAbwesenheitenData();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─── Form Setup ────────────────────────────────────────────────────────────

  private createForm(): FormGroup {
    return this.fb.group(
      {
        startDate:        [{ value: '', disabled: true }, Validators.required],
        startTimeHours:   [{ value: 0, disabled: true }, [Validators.min(0), Validators.max(24)]],
        startTimeMinutes: [{ value: 0, disabled: true }, [Validators.min(0), Validators.max(59)]],
        endDate:          [{ value: '', disabled: true }, Validators.required],
        endTimeHours:     [{ value: 0, disabled: true }, [Validators.min(0), Validators.max(24)]],
        endTimeMinutes:   [{ value: 0, disabled: true }, [Validators.min(0), Validators.max(59)]],
        comment:          [{ value: '', disabled: true }, Validators.maxLength(60)],
      },
      { validators: dateRangeValidator() }  // ← no originalStartDate yet
    );
  }

  private listenToStartDateChanges(): void {
    this.abwesenheitForm.get('startDate')?.valueChanges
      .pipe(takeUntil(this.destroy$))  // ← no more subscription leak
      .subscribe(selectedDate => {
        if (!selectedDate) return;

        const startDate = new Date(selectedDate);
        startDate.setHours(0, 0, 0, 0);

        const endDateControl = this.abwesenheitForm.get('endDate');
        const endDate = new Date(endDateControl?.value);

        if (startDate >= endDate) {
          endDateControl?.patchValue(new Date(selectedDate), { emitEvent: false });
        }

        this.abwesenheitForm.updateValueAndValidity();
      });
  }

  // ─── Load Data ─────────────────────────────────────────────────────────────

  private loadAbwesenheitenData(): void {
    this.isNew = this.abwesenheitId === 'new' || !this.abwesenheitId;
    this.editMode = this.isNew;

    if (this.createMode || this.abwesenheitId === 'new') {
      this.setupNewAbwesenheit();
    } else if (this.abwesenheitId) {
      this.setupExistingAbwesenheit();
    }
  }

  private setupNewAbwesenheit(): void {
    this.isNew = true;
    this.editMode = true;
    this.showForm = true;
    this.originalValue = null;

    this.abwesenheitForm.setValidators(dateRangeValidator());  // no original date
    this.resetForm();
    this.enableForm();

    const today = new Date();
    this.abwesenheitForm.patchValue({
      startDate:        today,
      startTimeHours:   0,
      startTimeMinutes: 0,
      endDate:          today,
      endTimeHours:     24,
      endTimeMinutes:   0,
    });
  }

  private setupExistingAbwesenheit(): void {
    this.editMode = false;
    this.loading = true;

    this.exitEditMode();

    this.abwesenheitForm.patchValue({
      startDate:        this.abwesenheit?.login || '',
      startTimeHours:   DateUtilsService.getHours(this.abwesenheit?.login),
      startTimeMinutes: DateUtilsService.getMinutes(this.abwesenheit?.login),
      endDate:          this.abwesenheit?.logoff || '',
      endTimeHours:     DateUtilsService.getHours(this.abwesenheit?.logoff),
      endTimeMinutes:   DateUtilsService.getMinutes(this.abwesenheit?.logoff),
      comment:          this.abwesenheit?.anmerkung || '',
    });

    // ← pass original start date so validator allows unchanged past dates
    this.abwesenheitForm.setValidators(
      dateRangeValidator({ originalStartDate: new Date(this.abwesenheit!.login!) })
    );
    this.abwesenheitForm.updateValueAndValidity();

    this.originalValue = this.abwesenheitForm.getRawValue();
    this.loading = false;
  }

  private resetForm(): void {
    this.abwesenheitForm.reset(
      { startDate: '', startTimeHours: 0, startTimeMinutes: 0,
        endDate: '', endTimeHours: 0, endTimeMinutes: 0, comment: '' },
      { emitEvent: false }
    );
  }

  // ─── Edit Mode ─────────────────────────────────────────────────────────────

  enterEditMode(): void {
    this.editMode = true;
    this.abwesenheitForm.enable();
  }

  exitEditMode(): void {
    this.editMode = false;
    this.abwesenheitForm.disable();
  }

  enableCreateMode(): void {
    this.createMode = true;
    this.setupNewAbwesenheit();
  }

  // ─── Submit ────────────────────────────────────────────────────────────────

  onSubmit(): void {
    this.abwesenheitForm.markAllAsTouched();

    const formValues = this.abwesenheitForm.getRawValue();

    // check required fields first
    if (!formValues.startDate) {
      return this.openErrorDialog('startDateRequired');
    }
    if (!formValues.endDate) {
      return this.openErrorDialog('endDateRequired');
    }

    // check form-level validation errors
    if (this.abwesenheitForm.invalid) {
      const formError = this.getFirstFormError();
      return this.openErrorDialog(formError);
    }

    this.submitting = true;
    const startTime = Date.now();
    const startTimeFormatted = `${this.padZero(formValues.startTimeHours)}:${this.padZero(formValues.startTimeMinutes)}`;
    const endTimeFormatted   = `${this.padZero(formValues.endTimeHours)}:${this.padZero(formValues.endTimeMinutes)}`;

    const absence: ApiStempelzeit = {
      ...(this.isNew ? {} : { id: this.abwesenheitId!, version: this.abwesenheit?.version }),
      zeitTyp:       zeitTypToBackendKey(ApiZeitTyp.ABWESENHEIT) as any,
      login:         DateUtilsService.formatDateAndTimeToISOFull(new Date(formValues.startDate), startTimeFormatted),
      logoff:        DateUtilsService.formatDateAndTimeToISOFull(new Date(formValues.endDate), endTimeFormatted),
      anmerkung:     formValues.comment,
      loginSystem:   '',
      logoffSystem:  '',
      poKorrektur:   true,
      marker:        [],
      eintragungsart: ApiStempelzeitEintragungsart.NORMAL,
    };

    const request$ = this.isNew
      ? this.abwesenheitService.createAbwesenheit(absence)
      : this.abwesenheitService.updateAbwesenheit(absence);

    const successMsg = this.isNew
      ? AppConstants.MSG_ABWESENHEITEN_CREATED_SUCCESS
      : AppConstants.MSG_ABWESENHEITEN_UPDATED_SUCCESS;
    const errorMsg = this.isNew
      ? AppConstants.MSG_ABWESENHEITEN_CREATED_ERROR
      : AppConstants.MSG_ABWESENHEITEN_UPDATED_ERROR;
    const successDetail = this.isNew
      ? 'Die Abwesenheit wurde erfolgreich erstellt!'
      : 'Die Abwesenheit wurde erfolgreich gespeichert!';

    request$.subscribe({
      next: (response) => {
        const duration = Date.now() - startTime;
        this.dialog.open(InfoDialogComponent, {
          data: { title: 'Erfolgreich', detail: successDetail },
          panelClass: 'custom-dialog-width'
        });
        this.statusPanelService.addMessageRequest(successMsg, this.isNew ? 'POST' : 'PUT', duration, response);
        this.saved.emit();
        this.submitting = false;
        if (this.isNew) {
          this.showForm = false;
          this.abwesenheitForm.reset();
        }
      },
      error: (err) => {
        const duration = Date.now() - startTime;
        this.dialog.open(ErrorDialogComponent, {
          data: { title: 'Fehler beim Speichern', detail: err.error },
          panelClass: 'custom-dialog-width'
        });
        this.statusPanelService.addMessageRequest(errorMsg, this.isNew ? 'POST' : 'PUT', duration, err);
        this.submitting = false;
      }
    });
  }

  // ─── Cancel / Delete ───────────────────────────────────────────────────────

  onCancel(): void {
    const wasNew = this.isNew;  // ← save BEFORE resetFormState changes it
    this.resetFormState();
    if (wasNew) {
      this.cancelled.emit();
    }
  }

  private resetFormState(): void {
    if (this.isNew) {
       this.showForm = false;
      this.isNew = false;
      this.editMode = false;
      this.createMode = false;
      this.abwesenheitForm.reset();
      this.originalValue = null;
    } else if (this.editMode) {
      // existing entry in edit mode — just disable, keep form visible
      if (this.originalValue) {
        this.abwesenheitForm.patchValue(this.originalValue);
      }
      this.exitEditMode();
    }
  }

  private resetOnNavigate(): void {
    this.showForm = false;
    this.isNew = false;
    this.editMode = false;
    this.createMode = false;
    this.abwesenheitId = null;   // ← clear selection
    this.abwesenheit = null;     // ← clear data
    this.abwesenheitForm.reset();
    this.originalValue = null;
    this.exitEditMode();
  }

  onDelete(absence: ApiStempelzeit): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '500px',
      data: { absence }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.delete(absence);
    });
  }

  private delete(row: ApiStempelzeit): void {
    if (new Date(row.login!) < new Date()) {
      return this.openErrorDialog('startDateInPast');  // reuse error map
    }

    const startTime = Date.now();
    row.deleted = true;

    this.abwesenheitService.deleteAbwesenheit(row).subscribe({
      next: (response) => {
        const duration = Date.now() - startTime;
        this.statusPanelService.addMessageRequest(AppConstants.MSG_ABWESENHEITEN_DELETED_SUCCESS, 'POST', duration, response);
        this.saved.emit();
      },
      error: (err) => {
        const duration = Date.now() - startTime;
        this.statusPanelService.addMessageRequest(AppConstants.MSG_ABWESENHEITEN_DELETED_ERROR, 'POST', duration, err);
      }
    });
  }

  // ─── Error Handling ────────────────────────────────────────────────────────

  private getFirstFormError(): string {
    const errors = this.abwesenheitForm.errors;
    if (!errors) return 'default';
    return Object.keys(errors)[0] ?? 'default';
  }

  private openErrorDialog(errorKey: string): void {
    const error = ABWESENHEIT_FORM_ERRORS[errorKey] ?? ABWESENHEIT_FORM_ERRORS['default'];
    this.dialog.open(ErrorDialogComponent, {
      data: { title: error.title, detail: error.detail },
      panelClass: 'custom-dialog-width'
    });
  }

  // ─── Time Controls ─────────────────────────────────────────────────────────

  adjustTime_(field: string, direction: 1 | -1, max: number): void {
    const control = this.abwesenheitForm.get(field);
    if (!control) return;

    const current = isNaN(Number(control.value)) ? 0 : Number(control.value);
    const newVal = Math.max(0, Math.min(max, current + direction));

    control.patchValue(newVal, { emitEvent: true });
    control.markAsTouched();
    this.abwesenheitForm.updateValueAndValidity();
  }

  formatTimeValue(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  onDragStart(event: MouseEvent, fieldName: string): void {
    event.preventDefault();
    this.isDragging = true;
    this.activeDragField = fieldName;
    this.dragStartY = event.clientY;
    this.dragStartValue = Number(this.abwesenheitForm.get(fieldName)?.value) || 0;
    document.body.style.cursor = 'ns-resize';
    document.addEventListener('mousemove', this.onDragMove.bind(this));
    document.addEventListener('mouseup', this.onDragEnd.bind(this));
  }

  onDragMove(event: MouseEvent): void {
    if (!this.isDragging || !this.activeDragField) return;
    event.preventDefault();

    const deltaY = this.dragStartY - event.clientY;
    const change = Math.floor(deltaY / 5);
    const max = this.activeDragField.includes('Hours') ? 23 : 59;
    const newValue = Math.max(0, Math.min(max, this.dragStartValue + change));

    if (!isNaN(newValue)) {
      this.abwesenheitForm.get(this.activeDragField)?.setValue(newValue);
    }
  }

  onDragEnd(event: MouseEvent): void {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.activeDragField = '';
    this.dragStartY = 0;
    this.dragStartValue = 0;
    document.body.style.cursor = '';
    document.removeEventListener('mousemove', this.onDragMove.bind(this));
    document.removeEventListener('mouseup', this.onDragEnd.bind(this));
    this.abwesenheitForm.updateValueAndValidity();
  }

  private padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }


  enableForm(): void {
    this.abwesenheitForm.enable();
  }

  disableForm(): void {
    this.abwesenheitForm.disable();
  }

  adjustTime(field: string, direction: 1 | -1, max: number): void {
    const control = this.abwesenheitForm.get(field);
    if (!control) return;

    const current = control.value !== null && control.value !== undefined
      ? Number(control.value)
      : 0;
    const currentNum = isNaN(current) ? 0 : current;

    let newVal = currentNum + direction;

    // Wrap around instead of clamping
    if (newVal < 0) newVal = max;
    if (newVal > max) newVal = 0;

    control.patchValue(newVal, { emitEvent: true });
    control.markAsTouched();

    // When hours hit 24, reset minutes to 0 but DON'T disable
    if (field === 'startTimeHours' || field === 'endTimeHours') {
      const minutesField = field === 'startTimeHours'
        ? 'startTimeMinutes'
        : 'endTimeMinutes';
      const minutesControl = this.abwesenheitForm.get(minutesField);
      if (minutesControl && newVal === 24 && minutesControl.value !== 0) {
        minutesControl.patchValue(0, { emitEvent: false });
      }
      // Remove the disable/enable logic entirely
    }

    this.abwesenheitForm.updateValueAndValidity();
  }

  private lastWheelAdjust = 0;
  onTimeWheel(field: string, event: WheelEvent, max: number): void {
    if (!this.editMode && !this.isNew) return;
    event.preventDefault();
    const now = Date.now();
    if (now - this.lastWheelAdjust < 120) return;
    this.lastWheelAdjust = now;
    const direction: 1 | -1 = event.deltaY < 0 ? 1 : -1;
    this.adjustTime(field, direction, max);
  }

  onTimeInput(field: string, event: Event, max: number): void {
    const input = event.target as HTMLInputElement;

    // Strip non-numeric characters
    input.value = input.value.replace(/[^0-9]/g, '');

    if (input.value === '') {
      this.abwesenheitForm.get(field)?.patchValue(0, { emitEvent: true });
      return;
    }

    let num = parseInt(input.value, 10);

    // Take only last digit(s) if exceeds max
    if (num > max) {
      const str = input.value;
      const lastDigit = parseInt(str[str.length - 1], 10);
      num = lastDigit;
      input.value = String(num);
    }

    this.abwesenheitForm.get(field)?.patchValue(num, { emitEvent: true });
    this.abwesenheitForm.updateValueAndValidity();
  }

  protected readonly ABWESENHEIT_FORM_ERRORS = ABWESENHEIT_FORM_ERRORS;
}
