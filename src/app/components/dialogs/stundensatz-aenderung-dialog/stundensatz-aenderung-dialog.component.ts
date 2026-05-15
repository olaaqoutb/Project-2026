// import { Component, Inject, Injectable } from '@angular/core';
// import { CommonModule, DecimalPipe } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { MatButtonModule } from '@angular/material/button';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatIconModule } from '@angular/material/icon';
// import { MatTooltipModule } from '@angular/material/tooltip';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import {
//   MatNativeDateModule,
//   MAT_DATE_LOCALE,
//   DateAdapter,
//   NativeDateAdapter,
//   MAT_DATE_FORMATS,
//   MatDateFormats,
// } from '@angular/material/core';
// import {
//   MAT_DIALOG_DATA,
//   MatDialogModule,
//   MatDialogRef,
// } from '@angular/material/dialog';

// export interface StundensatzAenderungEntry {
//   aktivierungsdatum: string;   // formatted dd.MM.yyyy
//   stundensatz: number;
// }

// export interface StundensatzAenderungDialogData {
//   entries: StundensatzAenderungEntry[];
//   disabled?: boolean;
// }

// @Injectable()
// class GermanDateAdapter extends NativeDateAdapter {
//   override format(date: Date, displayFormat: Object): string {
//     if (displayFormat === 'dd.MM.yyyy') {
//       const day = date.getDate().toString().padStart(2, '0');
//       const month = (date.getMonth() + 1).toString().padStart(2, '0');
//       const year = date.getFullYear();
//       return `${day}.${month}.${year}`;
//     }
//     return super.format(date, displayFormat);
//   }

//   override parse(value: any): Date | null {
//     if (value instanceof Date) return value;
//     if (typeof value !== 'string' || !value.trim()) return null;

//     const parts = value.trim().split(/[\s.\-\/]+/).filter(Boolean);
//     if (parts.length !== 3) return super.parse(value);

//     const d = parseInt(parts[0], 10);
//     const m = parseInt(parts[1], 10) - 1;
//     let y = parseInt(parts[2], 10);
//     if (isNaN(d) || isNaN(m) || isNaN(y)) return null;
//     if (y < 100) y += y >= 70 ? 1900 : 2000;

//     const date = new Date(y, m, d);
//     return isNaN(date.getTime()) ? null : date;
//   }
// }

// const GERMAN_DATE_FORMATS: MatDateFormats = {
//   parse: { dateInput: 'dd.MM.yyyy' },
//   display: {
//     dateInput: 'dd.MM.yyyy',
//     monthYearLabel: 'MMMM yyyy',
//     dateA11yLabel: 'dd.MM.yyyy',
//     monthYearA11yLabel: 'MMMM yyyy',
//   },
// };

// @Component({
//   selector: 'app-stundensatz-aenderung-dialog',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     DecimalPipe,
//     MatDialogModule,
//     MatButtonModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatIconModule,
//     MatTooltipModule,
//     MatDatepickerModule,
//     MatNativeDateModule,
//   ],
//   providers: [
//     { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
//     { provide: DateAdapter, useClass: GermanDateAdapter },
//     { provide: MAT_DATE_FORMATS, useValue: GERMAN_DATE_FORMATS },
//   ],
//   templateUrl: './stundensatz-aenderung-dialog.component.html',
//   styleUrl: './stundensatz-aenderung-dialog.component.scss',
// })
// export class StundensatzAenderungDialogComponent {
//   entries: StundensatzAenderungEntry[];
//   readonly disabled: boolean;

//   selectedIndex: number | null = null;

//   // Form bindings for the inline create/edit area
//   aktivierungsdatum: Date | string | null = null;
//   stundensatz: number | null = null;
//   saveAttempted = false;

//   constructor(
//     private dialogRef: MatDialogRef<StundensatzAenderungDialogComponent>,
//     @Inject(MAT_DIALOG_DATA) data: StundensatzAenderungDialogData,
//   ) {
//     this.entries = [...(data?.entries || [])];
//     this.disabled = !!data?.disabled;
//   }

//   // ───── Row selection — fills the form so the user can edit / remove. ─────
//   selectRow(index: number): void {
//     if (this.disabled) return;
//     if (this.selectedIndex === index) {
//       this.clearForm();
//       return;
//     }
//     this.selectedIndex = index;
//     const entry = this.entries[index];
//     this.aktivierungsdatum = this.parseGermanDate(entry.aktivierungsdatum);
//     this.stundensatz = entry.stundensatz;
//     this.saveAttempted = false;
//   }

//   // ───── Validation ─────
//   isDateMissing(): boolean {
//     if (this.aktivierungsdatum instanceof Date) {
//       return isNaN(this.aktivierungsdatum.getTime());
//     }
//     return !(this.aktivierungsdatum && (this.aktivierungsdatum as string).trim());
//   }

//   isDateDuplicate(): boolean {
//     const formatted = this.formattedDate();
//     if (!formatted) return false;
//     return this.entries.some(
//       (e, i) => i !== this.selectedIndex && e.aktivierungsdatum === formatted,
//     );
//   }

//   hasErrors(): boolean {
//     return this.isDateMissing() || this.isDateDuplicate();
//   }

//   // ───── Add new / update selected / remove selected ─────
//   onAdd(): void {
//     if (this.disabled) return;
//     this.saveAttempted = true;
//     if (this.hasErrors()) return;

//     const entry: StundensatzAenderungEntry = {
//       aktivierungsdatum: this.formattedDate(),
//       stundensatz: this.stundensatz ?? 0,
//     };
//     this.entries = [...this.entries, entry];
//     this.sortEntries();
//     this.selectedIndex = this.entries.findIndex(
//       e => e.aktivierungsdatum === entry.aktivierungsdatum,
//     );
//     this.saveAttempted = false;
//   }

//   onUpdate(): void {
//     if (this.disabled || this.selectedIndex === null) return;
//     this.saveAttempted = true;
//     if (this.hasErrors()) return;

//     const updated: StundensatzAenderungEntry = {
//       aktivierungsdatum: this.formattedDate(),
//       stundensatz: this.stundensatz ?? 0,
//     };
//     const next = [...this.entries];
//     next[this.selectedIndex] = updated;
//     this.entries = next;
//     this.sortEntries();
//     this.selectedIndex = this.entries.findIndex(
//       e => e.aktivierungsdatum === updated.aktivierungsdatum,
//     );
//     this.saveAttempted = false;
//   }

//   onRemove(): void {
//     if (this.disabled || this.selectedIndex === null) return;
//     this.entries = this.entries.filter((_, i) => i !== this.selectedIndex);
//     this.clearForm();
//   }

//   clearForm(): void {
//     this.selectedIndex = null;
//     this.aktivierungsdatum = null;
//     this.stundensatz = null;
//     this.saveAttempted = false;
//   }

//   // ───── Dialog confirmation ─────
//   onOk(): void {
//     this.dialogRef.close(this.entries);
//   }

//   onCancel(): void {
//     this.dialogRef.close(null);
//   }

//   // ───── Internal helpers ─────
//   private sortEntries(): void {
//     this.entries = [...this.entries].sort((a, b) =>
//       this.toComparable(a.aktivierungsdatum).localeCompare(this.toComparable(b.aktivierungsdatum)),
//     );
//   }

//   private toComparable(s: string): string {
//     const parts = (s || '').split('.');
//     if (parts.length !== 3) return s;
//     const [d, m, y] = parts;
//     return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
//   }

//   private formattedDate(): string {
//     if (this.aktivierungsdatum instanceof Date) {
//       if (isNaN(this.aktivierungsdatum.getTime())) return '';
//       const d = this.aktivierungsdatum.getDate().toString().padStart(2, '0');
//       const m = (this.aktivierungsdatum.getMonth() + 1).toString().padStart(2, '0');
//       const y = this.aktivierungsdatum.getFullYear();
//       return `${d}.${m}.${y}`;
//     }
//     return (this.aktivierungsdatum || '').toString().trim();
//   }

//   private parseGermanDate(str: string): Date | null {
//     const parts = (str || '').split('.');
//     if (parts.length !== 3) return null;
//     const d = parseInt(parts[0], 10);
//     const m = parseInt(parts[1], 10) - 1;
//     const y = parseInt(parts[2], 10);
//     if (isNaN(d) || isNaN(m) || isNaN(y)) return null;
//     const date = new Date(y, m, d);
//     return isNaN(date.getTime()) ? null : date;
//   }
// }
