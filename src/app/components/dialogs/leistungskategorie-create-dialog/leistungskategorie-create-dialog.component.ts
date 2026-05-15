import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

export interface LeistungskategorieEntry {
  lkKategorie: string;
  lkFaktor: number;
  lkBezeichnung: string;
}

export interface LeistungskategorieCreateDialogData {
  existingKategorien: string[];
  entry?: LeistungskategorieEntry;
}

@Component({
  selector: 'app-leistungskategorie-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './leistungskategorie-create-dialog.component.html',
  styleUrl: './leistungskategorie-create-dialog.component.scss',
})
export class LeistungskategorieCreateDialogComponent {
  data = inject<LeistungskategorieCreateDialogData>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<LeistungskategorieCreateDialogComponent>);

  lkKategorie = '';
  lkFaktor: number | null = null;
  lkBezeichnung = '';
  saveAttempted = false;

  constructor() {
    if (this.data?.entry) {
      this.lkKategorie = this.data.entry.lkKategorie ?? '';
      this.lkFaktor = this.data.entry.lkFaktor ?? null;
      this.lkBezeichnung = this.data.entry.lkBezeichnung ?? '';
    }
  }

  isKategorieMissing(): boolean {
    return !this.lkKategorie?.trim();
  }

  isKategorieDuplicate(): boolean {
    const k = this.lkKategorie?.trim();
    if (!k) return false;
    return (this.data?.existingKategorien || []).includes(k);
  }

  isFaktorMissing(): boolean {
    return this.lkFaktor === null || this.lkFaktor === undefined;
  }

  hasErrors(): boolean {
    return this.isKategorieMissing() || this.isKategorieDuplicate() || this.isFaktorMissing();
  }

  onOk(): void {
    this.saveAttempted = true;
    if (this.hasErrors()) return;
    const result: LeistungskategorieEntry = {
      lkKategorie: this.lkKategorie.trim(),
      lkFaktor: this.lkFaktor ?? 0,
      lkBezeichnung: this.lkBezeichnung?.trim() ?? '',
    };
    this.dialogRef.close(result);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
