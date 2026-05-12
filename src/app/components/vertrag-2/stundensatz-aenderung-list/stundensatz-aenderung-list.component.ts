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
  StundensatzAenderungCreateDialogComponent,
  StundensatzAenderungEntry,
} from '../../dialogs/stundensatz-aenderung-create-dialog/stundensatz-aenderung-create-dialog.component';

@Component({
  selector: 'app-stundensatz-aenderung-list',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  templateUrl: './stundensatz-aenderung-list.component.html',
  styleUrl: './stundensatz-aenderung-list.component.scss',
})
export class StundensatzAenderungListComponent {
  @Input() entries: StundensatzAenderungEntry[] = [];
  @Input() disabled = false;
  @Output() entriesChange = new EventEmitter<StundensatzAenderungEntry[]>();

  selectedIndex: number | null = null;

  private dialog = inject(MatDialog);

  selectRow(index: number): void {
    if (this.disabled) return;
    this.selectedIndex = this.selectedIndex === index ? null : index;
  }

  onCreate(): void {
    if (this.disabled) return;
    const ref = this.dialog.open(StundensatzAenderungCreateDialogComponent, {
      panelClass: 'custom-dialog-width',
      data: {
        existingDates: this.entries.map(e => e.aktivierungsdatum),
      },
    });
    ref.afterClosed().subscribe((result: StundensatzAenderungEntry | null) => {
      if (!result) return;
      const newEntries = [...this.entries, result];
      newEntries.sort((a, b) =>
        this.toComparable(a.aktivierungsdatum).localeCompare(this.toComparable(b.aktivierungsdatum))
      );
      this.entries = newEntries;
      this.selectedIndex = newEntries.findIndex(
        e => e.aktivierungsdatum === result.aktivierungsdatum
      );
      this.entriesChange.emit(this.entries);
    });
  }

  onEdit(): void {
    if (this.disabled || this.selectedIndex === null) return;
    const current = this.entries[this.selectedIndex];
    const ref = this.dialog.open(StundensatzAenderungCreateDialogComponent, {
      panelClass: 'custom-dialog-width',
      data: {
        existingDates: this.entries
          .filter((_, i) => i !== this.selectedIndex)
          .map(e => e.aktivierungsdatum),
        entry: current,
      },
    });
    ref.afterClosed().subscribe((result: StundensatzAenderungEntry | null) => {
      if (!result || this.selectedIndex === null) return;
      const newEntries = [...this.entries];
      newEntries[this.selectedIndex] = result;
      newEntries.sort((a, b) =>
        this.toComparable(a.aktivierungsdatum).localeCompare(this.toComparable(b.aktivierungsdatum))
      );
      this.entries = newEntries;
      this.selectedIndex = newEntries.findIndex(
        e => e.aktivierungsdatum === result.aktivierungsdatum
      );
      this.entriesChange.emit(this.entries);
    });
  }

  // Cancel: directly remove the selected row — no confirmation dialog.
  onCancelSelected(): void {
    if (this.disabled || this.selectedIndex === null) return;
    this.entries = this.entries.filter((_, i) => i !== this.selectedIndex);
    this.selectedIndex = null;
    this.entriesChange.emit(this.entries);
  }

  // Convert dd.MM.yyyy → yyyy-MM-dd for lexical sorting.
  private toComparable(s: string): string {
    const parts = (s || '').split('.');
    if (parts.length !== 3) return s;
    const [d, m, y] = parts;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
}
