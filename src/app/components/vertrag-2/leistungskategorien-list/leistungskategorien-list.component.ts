import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  LeistungskategorieCreateDialogComponent,
  LeistungskategorieEntry,
} from '../../dialogs/leistungskategorie-create-dialog/leistungskategorie-create-dialog.component';

@Component({
  selector: 'app-leistungskategorien-list',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  templateUrl: './leistungskategorien-list.component.html',
  styleUrl: './leistungskategorien-list.component.scss',
})
export class LeistungskategorienListComponent {
  @Input() entries: LeistungskategorieEntry[] = [];
  @Input() disabled = false;
  @Output() entriesChange = new EventEmitter<LeistungskategorieEntry[]>();

  selectedIndex: number | null = null;

  private dialog = inject(MatDialog);

  selectRow(index: number): void {
    if (this.disabled) return;
    this.selectedIndex = this.selectedIndex === index ? null : index;
  }

  onCreate(): void {
    this.openEntryDialog(null);
  }

  onEdit(): void {
    if (this.selectedIndex === null) return;
    this.openEntryDialog(this.selectedIndex);
  }

  onCancelSelected(): void {
    if (this.disabled || this.selectedIndex === null) return;
    this.entries = this.entries.filter((_, i) => i !== this.selectedIndex);
    this.selectedIndex = null;
    this.entriesChange.emit(this.entries);
  }

  private openEntryDialog(editIndex: number | null): void {
    if (this.disabled) return;

    const existingKategorien = this.entries
      .filter((_, i) => editIndex === null || i !== editIndex)
      .map(e => e.lkKategorie);

    const ref = this.dialog.open(LeistungskategorieCreateDialogComponent, {
      panelClass: 'custom-dialog-width',
      data: {
        existingKategorien,
        ...(editIndex !== null ? { entry: this.entries[editIndex] } : {}),
      },
    });

    ref.afterClosed().subscribe((result: LeistungskategorieEntry | null) => {
      if (!result) return;
      const newEntries = [...this.entries];
      if (editIndex !== null) {
        newEntries[editIndex] = result;
      } else {
        newEntries.push(result);
      }
      newEntries.sort((a, b) =>
        (a.lkKategorie || '').localeCompare(b.lkKategorie || '')
      );
      this.entries = newEntries;
      this.selectedIndex = newEntries.findIndex(
        e => e.lkKategorie === result.lkKategorie
      );
      this.entriesChange.emit(this.entries);
    });
  }
}
