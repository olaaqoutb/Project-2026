import { AbstractControl, ValidationErrors } from '@angular/forms';

export interface DateRangeValidatorOptions {
  originalStartDate?: Date | null;
}



export const DEFAULT_FIELDS = {
  startDate:    'startDate',
  startHours:   'startTimeHours',
  startMinutes: 'startTimeMinutes',
  endDate:      'endDate',
  endHours:     'endTimeHours',
  endMinutes:   'endTimeMinutes',
};


export function dateRangeValidator(options: DateRangeValidatorOptions = {}) {
  return (control: AbstractControl): ValidationErrors | null => {
    const startDateVal = control.get('startDate')?.value;
    const endDateVal = control.get('endDate')?.value;

    if (!startDateVal || !endDateVal) return null;

    const startH = Number(control.get('startTimeHours')?.value) || 0;
    const startM = Number(control.get('startTimeMinutes')?.value) || 0;
    const endH   = Number(control.get('endTimeHours')?.value)   || 0;
    const endM   = Number(control.get('endTimeMinutes')?.value) || 0;

    const start = new Date(startDateVal);
    start.setHours(startH, startM, 0, 0);

    const end = new Date(endDateVal);
    end.setHours(endH, endM, 0, 0);

    // 1. end must be after start
    if (end <= start) {
      return { startDateAfterEndDate: true };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOnly = new Date(startDateVal);
    startOnly.setHours(0, 0, 0, 0);

    const endOnly = new Date(endDateVal);
    endOnly.setHours(0, 0, 0, 0);

    // 2. both dates in past
    if (startOnly < today && endOnly < today) {
      return { startDateAndEndDateInPast: true };
    }

    // 3. end date in past
    if (endOnly < today) {
      return { endDateInPast: true };
    }

    // 4. end time in past (when end date is today)
    if (endOnly.getTime() === today.getTime()) {
      const now = new Date();
      if (endH < now.getHours() || (endH === now.getHours() && endM <= now.getMinutes())) {
        return { endTimeInPast: true };
      }
    }

    // 5. start date validation — only if changed from original
    const { originalStartDate } = options;
    if (originalStartDate) {
      const originalOnly = new Date(originalStartDate);
      originalOnly.setHours(0, 0, 0, 0);

      const startChanged = startOnly.getTime() !== originalOnly.getTime();

      if (startChanged) {
        // changed to past
        if (startOnly < today) {
          return { startDateEditedInPast: true };
        }
        // original was in past, changed to future — not allowed
        if (originalOnly < today && startOnly >= today) {
          return { startDateEditedInFuture: true };
        }
      }
    } else {
      // new entry — start must not be in past
      if (startOnly < today) {
        return { startDateInPast: true };
      }
    }

    // 6. end date max 2 years in future
    const twoYearsFromNow = new Date();
    twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
    if (end > twoYearsFromNow) {
      return { endDateTooFarInFuture: true };
    }

    // 7. max duration 1 year
    const oneYearMs = 365 * 24 * 60 * 60 * 1000;
    if (end.getTime() - start.getTime() > oneYearMs) {
      return { absenceTooLong: true };
    }

    return null;
  };
}



export function dateRangeValidatorBase(fieldNames?: Partial<typeof DEFAULT_FIELDS>) {
  return (control: AbstractControl): ValidationErrors | null => {
    const fields = { ...DEFAULT_FIELDS, ...fieldNames };

    const startDateVal = control.get(fields.startDate)?.value;
    const endDateVal   = control.get(fields.endDate)?.value;
    if (!startDateVal || !endDateVal) return null;

    const startH = Number(control.get(fields.startHours)?.value)   || 0;
    const startM = Number(control.get(fields.startMinutes)?.value)  || 0;
    const endH   = Number(control.get(fields.endHours)?.value)      || 0;
    const endM   = Number(control.get(fields.endMinutes)?.value)    || 0;

    const start = new Date(startDateVal);
    start.setHours(startH, startM, 0, 0);

    const end = new Date(endDateVal);
    end.setHours(endH, endM, 0, 0);

    // 1. end must be after start — always required
    if (end <= start) return { startDateAfterEndDateKorrigieren: true };


    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOnly = new Date(startDateVal);
    startOnly.setHours(0, 0, 0, 0);

    const endOnly = new Date(endDateVal);
    endOnly.setHours(0, 0, 0, 0);

    // 2. max duration 1 year — always required
    const oneYearMs = 365 * 24 * 60 * 60 * 1000;
    if (end.getTime() - start.getTime() > oneYearMs) return { abwesenheitMaximalEinJahr: true };

    const twoYearsFromNow = new Date();
    twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
    twoYearsFromNow.setHours(23, 59, 59, 999);

    if (startOnly >= today && endOnly >= today &&
      start > twoYearsFromNow && end > twoYearsFromNow) {
      return { bothDatesTooFarInFuture: true };
    }


    if (startOnly >= today && endOnly >= today &&
      start > twoYearsFromNow && end > twoYearsFromNow) {
      return { bothDatesTooFarInFuture: true };
    }

// 4. only start more than 2 years in the future
    if (startOnly >= today && start > twoYearsFromNow) {
      return { startDateTooFarInFuture: true };
    }

// 5. only end more than 2 years in the future
    if (endOnly >= today && end > twoYearsFromNow) {
      return { endDateTooFarInFuture: true };
    }

    return null;
  };
}




export function dateRangeValidatorKorrigieren(fieldNames?: Partial<typeof DEFAULT_FIELDS>) {
  return (control: AbstractControl): ValidationErrors | null => {
    // run base checks first
    const baseError = dateRangeValidatorBase(fieldNames)(control);
    if (baseError) return baseError;

    const fields = { ...DEFAULT_FIELDS, ...fieldNames };
    const endDateVal = control.get(fields.endDate)?.value;
    const endH = Number(control.get(fields.endHours)?.value) || 0;
    const endM = Number(control.get(fields.endMinutes)?.value) || 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOnly = new Date(endDateVal);
    endOnly.setHours(0, 0, 0, 0);

    // end time must not be in past if end date is today
    if (endOnly.getTime() === today.getTime()) {
      const now = new Date();
      if (endH < now.getHours() || (endH === now.getHours() && endM <= now.getMinutes())) {
        return { endTimeInPast: true };
      }
    }

    return null;
  };
}
