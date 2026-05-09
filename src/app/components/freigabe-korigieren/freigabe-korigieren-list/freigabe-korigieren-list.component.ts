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
import { MatTooltipModule } from '@angular/material/tooltip';
import { FreigabeKorigierenService } from '../../../services/freigabe-korigieren.service';
import { StatusPanelService } from '../../../services/utils/status-panel-status.service';
import { AppConstants } from '../../../models/app-constants';
import { ApiFreigabePosition } from '../../../models/ApiFreigabePosition';
import { ApiFreigabeStatus } from '../../../models/ApiFreigabeStatus';
import { ApiTaetigkeitsbuchung } from '../../../models/ApiTaetigkeitsbuchung';

@Component({
  selector: 'app-freigabe-korigieren-list',
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
    MatTooltipModule,
  ],
  templateUrl: './freigabe-korigieren-list.component.html',
  styleUrl: './freigabe-korigieren-list.component.scss',
})
export class FreigabeKorigierenListComponent implements OnInit {
  dropdownOptions: string[] = ['Projectoffice', 'Abteilungsleiter'];
  selectedOption: string = this.dropdownOptions[0];
  selectedEntry: ApiFreigabePosition | null = null;
  displayedColumns: string[] = ['Produktposition', 'Monat', 'Mitarbeiter', 'Std', 'actions'];
  dataSource: ApiFreigabePosition[] = [];
  detailedData: ApiTaetigkeitsbuchung[] = [];
  detailDisplayedColumns: string[] = ['datum', 'buchungspunkt', 'taetigkeit', 'minutenDauer'];
  selectedEntryId: string | null = null;
  isLoading: boolean = false;
  isEditMode: boolean = false;
  isEditVisible: boolean = true;

  originalDataSource: ApiFreigabePosition[] = [];
  freigabePositionen: ApiFreigabePosition[] = [];

  sortState: { [key: string]: 'asc' | 'desc' } = {
    Produktposition: 'asc',
    Monat: 'asc',
    Mitarbeiter: 'asc',
    Std: 'asc',
  };
  activeSortColumn: string | null = null;

  detailSortState: { [key: string]: 'asc' | 'desc' } = {
    datum: 'asc',
    buchungspunkt: 'asc',
    taetigkeit: 'asc',
    minutenDauer: 'asc',
  };
  activeDetailSortColumn: string | null = null;

  tooltips: { [key: string]: string } = {
    edit: 'Bearbeiten',
    cancel: 'Abbrechen',
    save: 'Speichern',
    ABGELEHNT: 'Abgelehnt',
    PRUEFEN_DV: 'Prüfen DV',
    PRUEFEN_EV: 'Prüfen EV',
    FREIGEGEBEN: 'Freigegeben',
  };

  constructor(
    private freigabeKorigierenService: FreigabeKorigierenService,
    private statusPanelService: StatusPanelService,
  ) {}

  ngOnInit(): void {
    this.loadFromServer();
  }

  loadFromServer(): void {
    this.freigabeKorigierenService.getFreigabePositionen().subscribe({
      next: (response) => {
        this.originalDataSource = response.body ?? [];
        this.applyFilter(this.selectedOption);
      },
      error: (err) => {
        console.error('Error loading freigabe positionen:', err);
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
        return (
          (item.produktPosition?.produkt?.kurzName || '').toString().toLowerCase() +
          ' » ' +
          (item.produktPosition?.produktPositionname || '')
        );
      case 'Monat': {
        const [month, year] = (item.buchungsZeitraum || '00-0000').split('-');
        return parseInt(year + month, 10);
      }
      case 'Mitarbeiter':
        return (item.produktPosition?.durchfuehrungsverantwortlicher?.nachname || '')
          .toString()
          .toLowerCase();
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
      case 'datum': {
        if (!item.datum) return 0;
        const t = new Date(item.datum).getTime();
        return isNaN(t) ? 0 : t;
      }
      case 'buchungspunkt':
        return (item.buchungspunkt?.buchungspunkt || '').toString().toLowerCase();
      case 'taetigkeit':
        return (item.taetigkeit || '').toString().toLowerCase();
      case 'minutenDauer':
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

    this.freigabeKorigierenService.getFreigabePositionenDetail(entryId).subscribe({
      next: (response) => {
        this.detailedData = response.body ?? [];
        this.isEditVisible = true;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading detailed data:', err);
        this.detailedData = [];
        this.isLoading = false;
      },
    });
  }

  get uiFreigabeStatus(): string {
    const status = this.selectedEntry?.freigabeStatus ?? '';
    return status === ApiFreigabeStatus.PRUEFEN_DV || status === ApiFreigabeStatus.PRUEFEN_EV
      ? 'FREIGEGEBEN'
      : status;
  }

  set uiFreigabeStatus(value: string) {
    if (this.selectedEntry) {
      this.selectedEntry.freigabeStatus = value as ApiFreigabeStatus;
    }
  }

  getRowStyle(_entry: ApiFreigabePosition): { color: string } {
    return { color: '#000' };
  }

  getOddEvenRowClass(index: number): string {
    return index % 2 === 0 ? 'even-row-bg' : 'odd-row-bg';
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  saveChanges(): void {
    if (!this.selectedEntry) return;

    if (
      this.uiFreigabeStatus === 'FREIGEGEBEN' &&
      this.selectedEntry.freigabeStatus === ApiFreigabeStatus.PRUEFEN_DV
    ) {
      this.selectedEntry.freigabeStatus = ApiFreigabeStatus.PRUEFEN_EV;
    }

    this.freigabePositionen = [this.selectedEntry];
    this.isEditMode = false;

    const startTime = Date.now();
    this.freigabeKorigierenService.updateFreigabePositionen(this.freigabePositionen).subscribe({
      next: (response) => {
        const duration = Date.now() - startTime;
        this.statusPanelService.addMessageRequest(
          AppConstants.MSG_FREIGABEPOSITIONEN_UPDATED_SUCCESS,
          'POST',
          duration,
          response,
        );
      },
      error: (error) => {
        const duration = Date.now() - startTime;
        console.error('Fehler beim Aktualisieren der freigabePositionen:', error);
        this.statusPanelService.addMessageRequest(
          AppConstants.MSG_FREIGABEPOSITIONEN_UPDATED_ERROR,
          'POST',
          duration,
          error,
        );
      },
    });
  }

  cancelEdit(): void {
    this.isEditMode = false;
    if (this.selectedEntry && this.selectedEntry.id) {
      const original = this.dataSource.find((entry) => entry.id === this.selectedEntry!.id);
      if (original) {
        this.selectedEntry = JSON.parse(JSON.stringify(original));
      }
    }
  }

  applyFilter(option: string): void {
    if (!this.originalDataSource.length) return;

    switch (option) {
      case 'Projectoffice':
        this.dataSource = this.originalDataSource.filter(
          (item) =>
            item.freigabeStatus === ApiFreigabeStatus.ABGELEHNT ||
            item.freigabeStatus === ApiFreigabeStatus.PRUEFEN_DV,
        );
        break;

      case 'Abteilungsleiter':
        this.dataSource = this.originalDataSource.filter(
          (item) => item.freigabeStatus === ApiFreigabeStatus.PRUEFEN_EV,
        );
        break;

      default:
        this.dataSource = [...this.originalDataSource];
    }

    this.selectedEntry = null;
    this.detailedData = [];
    this.activeSortColumn = null;
    this.applySorting('Produktposition');
  }

  onDropdownChange(): void {
    this.applyFilter(this.selectedOption);
  }

  debugEntry(entry: ApiFreigabePosition): void {
    console.log('Entry debug:', {
      id: entry.id,
      produktPositionName: entry.produktPosition?.produktPositionname,
      kurzName: entry.produktPosition?.produkt?.kurzName,
      metadaten: entry.metadaten,
    });
  }
}
