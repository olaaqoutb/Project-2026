import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FreigabeHistorischService } from '../../../services/freigabe-historisch.service';
import { ApiFreigabePosition } from '../../../models/ApiFreigabePosition';
import { ApiTaetigkeitsbuchung } from '../../../models/ApiTaetigkeitsbuchung';

@Component({
  selector: 'app-freigabe-historisch-list',
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatTableModule,
    MatRadioModule,
    MatButtonModule,
    MatInputModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  templateUrl: './freigabe-historisch-list.component.html',
  styleUrl: './freigabe-historisch-list.component.scss',
})
export class FreigabeHistorischListComponent implements OnInit {
  dropdownOptions: string[] = [];
  selectedOption: string = '';
  selectedEntry: ApiFreigabePosition | null = null;
  displayedColumns: string[] = ['Produktposition', 'Monat', 'Mitarbeiter', 'Std', 'actions'];
  dataSource: ApiFreigabePosition[] = [];
  detailedData: ApiTaetigkeitsbuchung[] = [];
  detailDisplayedColumns: string[] = ['Datum', 'Buchungspunkt', 'Tatigkeit', 'Stunden'];
  selectedEntryId: string | null = null;
  isLoading: boolean = false;
  isEditMode: boolean = false;

  originalDataSource: ApiFreigabePosition[] = [];

  sortState: { [key: string]: 'asc' | 'desc' } = {
    Produktposition: 'asc',
    Monat: 'asc',
    Mitarbeiter: 'asc',
    Std: 'asc',
  };
  activeSortColumn: string | null = null;

  detailSortState: { [key: string]: 'asc' | 'desc' } = {
    Datum: 'asc',
    Buchungspunkt: 'asc',
    Tatigkeit: 'asc',
    Stunden: 'asc',
  };
  activeDetailSortColumn: string | null = null;

  tooltips: { [key: string]: string } = {
    ABGELEHNT: 'Abgelehnt',
    PRUEFEN_DV: 'Prüfen DV',
    PRUEFEN_EV: 'Prüfen EV',
    FREIGEGEBEN: 'Freigegeben',
  };

  constructor(private freigabeHistorischService: FreigabeHistorischService) {}

  ngOnInit(): void {
    this.generateDropdownOptions();
    this.loadFromServer();
  }

  generateDropdownOptions(): void {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    this.dropdownOptions = [];
    for (let i = 0; i < 12; i++) {
      let month = currentMonth - i;
      let year = currentYear;
      if (month < 1) {
        month += 12;
        year -= 1;
      }
      this.dropdownOptions.push(`${month.toString().padStart(2, '0')}-${year}`);
    }
    this.selectedOption = this.dropdownOptions[0];
  }

  loadFromServer(): void {
    this.freigabeHistorischService.getFreigabePositionen(this.selectedOption).subscribe({
      next: (response) => {
        const data = response.body ?? [];
        this.dataSource = data;
        this.originalDataSource = data;
        this.activeSortColumn = null;
      },
      error: (err) => {
        console.error('Error loading freigabe positionen history:', err);
      },
    });
  }

  toggleSort(field: string): void {
    if (this.activeSortColumn === field) {
      this.sortState[field] = this.sortState[field] === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortState[field] = 'asc';
    }
    this.activeSortColumn = field;
    this.applySorting(field);
  }

  applySorting(field: string): void {
    const direction = this.sortState[field];
    this.dataSource = [...this.dataSource].sort((a, b) => {
      const valueA = this.getSortValue(a, field);
      const valueB = this.getSortValue(b, field);
      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  private getSortValue(item: ApiFreigabePosition, field: string): string | number {
    switch (field) {
      case 'Produktposition':
        return (item.produktPosition?.produktPositionname || '').toString().toLowerCase();
      case 'Monat': {
        const [month, year] = (item.buchungsZeitraum || '00-0000').split('-');
        return parseInt(year + month, 10);
      }
      case 'Mitarbeiter':
        return (item.bucher?.nachname || '').toString().toLowerCase();
      case 'Std':
        return item.minutenDauer || 0;
      default:
        return (item[field as keyof ApiFreigabePosition] || '').toString().toLowerCase();
    }
  }

  getSortIcon(column: string): string {
    return this.sortState[column] === 'desc' ? 'mdi-chevron-down' : 'mdi-chevron-up';
  }

  toggleDetailSort(field: string): void {
    if (this.activeDetailSortColumn === field) {
      this.detailSortState[field] = this.detailSortState[field] === 'asc' ? 'desc' : 'asc';
    } else {
      this.detailSortState[field] = 'asc';
    }
    this.activeDetailSortColumn = field;
    this.applyDetailSorting(field);
  }

  applyDetailSorting(field: string): void {
    const direction = this.detailSortState[field];
    this.detailedData = [...this.detailedData].sort((a, b) => {
      const valueA = this.getDetailSortValue(a, field);
      const valueB = this.getDetailSortValue(b, field);
      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  private getDetailSortValue(item: ApiTaetigkeitsbuchung, field: string): string | number {
    switch (field) {
      case 'Datum': {
        if (!item.datum) return 0;
        const t = new Date(item.datum).getTime();
        return isNaN(t) ? 0 : t;
      }
      case 'Buchungspunkt':
        return (item.buchungspunkt?.buchungspunkt || '').toString().toLowerCase();
      case 'Tatigkeit':
        return (item.taetigkeit || '').toString().toLowerCase();
      case 'Stunden':
        return item.minutenDauer || 0;
      default:
        return (item[field as keyof ApiTaetigkeitsbuchung] || '').toString().toLowerCase();
    }
  }

  getDetailSortIcon(column: string): string {
    return this.detailSortState[column] === 'desc' ? 'mdi-chevron-down' : 'mdi-chevron-up';
  }

  extractProduktPositionName(item: ApiFreigabePosition): string {
    const kurz = item.produktPosition?.produkt?.kurzName || '';
    const name = item.produktPosition?.produktPositionname || '';
    return `${kurz} » ${name}`;
  }

  formatMonth(dateString: string): string {
    if (!dateString) return 'Unbekannt';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Unbekannt';
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}`;
  }

  formatMinutesToHoursMinutes(totalMinutes: number | undefined): string {
    if (totalMinutes === undefined || isNaN(totalMinutes)) return '0:00';
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  selectEntry(entry: ApiFreigabePosition): void {
    this.selectedEntryId = entry.id || null;
    this.isEditMode = false;
    this.selectedEntry = entry;

    if (entry.id) {
      this.loadDetailedData(entry.id);
    } else {
      this.detailedData = [];
    }
  }

  loadDetailedData(entryId: string): void {
    this.isLoading = true;
    this.activeDetailSortColumn = null;

    this.freigabeHistorischService.getFreigabePositionenDetail(entryId).subscribe({
      next: (response) => {
        this.detailedData = response.body ?? [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading detailed data:', err);
        this.detailedData = [];
        this.isLoading = false;
      },
    });
  }

  getRowStyle(entry: ApiFreigabePosition): { color: string } {
    switch (entry.freigabeStatus) {
      case 'ABGELEHNT':
        return { color: '#c00' };
      case 'PRUEFEN_EV':
        return { color: '#000000' };
      case 'FREIGEGEBEN':
        return { color: '#008000' };
      case 'PRUEFEN_DV':
        return { color: '#007bff' };
      default:
        return { color: 'inherit' };
    }
  }

  getOddEvenRowClass(index: number): string {
    return index % 2 === 0 ? 'even-row-bg' : 'odd-row-bg';
  }

  saveChanges(): void {
    if (this.selectedEntry) {
      this.isEditMode = false;
    }
  }

  onDropdownChange(): void {
    this.loadFromServer();
  }

  exportData(): void {
    console.log('Export data for month', this.selectedOption, this.dataSource.length, 'rows');
  }

  refreshData(): void {
    this.loadFromServer();
  }
}
