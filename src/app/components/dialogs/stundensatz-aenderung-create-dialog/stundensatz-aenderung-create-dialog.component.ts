import { Component, inject, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatNativeDateModule,
  MAT_DATE_LOCALE,
  DateAdapter,
  NativeDateAdapter,
  MAT_DATE_FORMATS,
  MatDateFormats,
} from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

export interface StundensatzAenderungEntry {
  aktivierungsdatum: string;   // formatted dd.MM.yyyy for the row list
  stundensatz: number;
}

export interface StundensatzAenderungCreateDialogData {
  existingDates: string[];
  entry?: StundensatzAenderungEntry;
}

@Injectable()
class GermanDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'dd.MM.yyyy') {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }
    return super.format(date, displayFormat);
  }

  // Accept typed-in dates with flexible separators (".", " ", "-", "/") and
  // missing zero-padding — e.g. "22 4 2024", "22.4.2024", "22-04-2024" all
  // turn into a valid 22.04.2024 Date.
  override parse(value: any): Date | null {
    if (value instanceof Date) return value;
    if (typeof value !== 'string' || !value.trim()) return null;

    const parts = value.trim().split(/[\s.\-\/]+/).filter(Boolean);
    if (parts.length !== 3) return super.parse(value);

    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    let y = parseInt(parts[2], 10);
    if (isNaN(d) || isNaN(m) || isNaN(y)) return null;
    if (y < 100) y += y >= 70 ? 1900 : 2000; // 2-digit year heuristic

    const date = new Date(y, m, d);
    return isNaN(date.getTime()) ? null : date;
  }
}

const GERMAN_DATE_FORMATS: MatDateFormats = {
  parse: { dateInput: 'dd.MM.yyyy' },
  display: {
    dateInput: 'dd.MM.yyyy',
    monthYearLabel: 'MMMM yyyy',
    dateA11yLabel: 'dd.MM.yyyy',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

@Component({
  selector: 'app-stundensatz-aenderung-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    { provide: DateAdapter, useClass: GermanDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: GERMAN_DATE_FORMATS },
  ],
  templateUrl: './stundensatz-aenderung-create-dialog.component.html',
  styleUrl: './stundensatz-aenderung-create-dialog.component.scss',
})
export class StundensatzAenderungCreateDialogComponent {
  data = inject<StundensatzAenderungCreateDialogData>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<StundensatzAenderungCreateDialogComponent>);

  // ngModel binds to a Date (picker writes a Date object back); we also
  // accept an existing dd.MM.yyyy string when editing an existing entry.
  aktivierungsdatum: Date | string | null = null;
  stundensatz: number | null = null;
  saveAttempted = false;

  constructor() {
    if (this.data?.entry) {
      this.aktivierungsdatum = this.parseGermanDate(this.data.entry.aktivierungsdatum);
      this.stundensatz = this.data.entry.stundensatz;
    }
  }

  isDateMissing(): boolean {
    if (this.aktivierungsdatum instanceof Date) {
      return isNaN(this.aktivierungsdatum.getTime());
    }
    return !(this.aktivierungsdatum && (this.aktivierungsdatum as string).trim());
  }

  isDateDuplicate(): boolean {
    const formatted = this.formattedDate();
    if (!formatted) return false;
    return (this.data?.existingDates || []).includes(formatted);
  }

  hasErrors(): boolean {
    return this.isDateMissing() || this.isDateDuplicate();
  }

  onOk(): void {
    this.saveAttempted = true;
    if (this.hasErrors()) return;
    const result: StundensatzAenderungEntry = {
      aktivierungsdatum: this.formattedDate(),
      stundensatz: this.stundensatz ?? 0,
    };
    this.dialogRef.close(result);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  private formattedDate(): string {
    if (this.aktivierungsdatum instanceof Date) {
      if (isNaN(this.aktivierungsdatum.getTime())) return '';
      const d = this.aktivierungsdatum.getDate().toString().padStart(2, '0');
      const m = (this.aktivierungsdatum.getMonth() + 1).toString().padStart(2, '0');
      const y = this.aktivierungsdatum.getFullYear();
      return `${d}.${m}.${y}`;
    }
    return (this.aktivierungsdatum || '').toString().trim();
  }

  private parseGermanDate(str: string): Date | null {
    const parts = (str || '').split('.');
    if (parts.length !== 3) return null;
    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const y = parseInt(parts[2], 10);
    if (isNaN(d) || isNaN(m) || isNaN(y)) return null;
    const date = new Date(y, m, d);
    return isNaN(date.getTime()) ? null : date;
  }
}
