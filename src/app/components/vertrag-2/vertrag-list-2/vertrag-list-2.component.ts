import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { VertraegeService } from '../../../services/vertraege.service';
import { ApiVertrag } from '../../../models/ApiVertrag';

@Component({
  selector: 'app-vertrag-list-2',
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSortModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  templateUrl: './vertrag-list-2.component.html',
  styleUrl: './vertrag-list-2.component.scss',
})
export class VertragList2Component implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<ApiVertrag>([]);

  vertraege: ApiVertrag[] = [];
  searchTerm = '';
  showInactive = false;
  displayedColumns: string[] = ['vertragsname', 'zusatz', 'geplan', 'org-Einheit', 'verbrauchtDate'];

  private static readonly LAST_ROW_KEY = 'vertraege.lastRowId';
  private static readonly SEARCH_KEY = 'vertraege.search';
  private static readonly SHOW_INACTIVE_KEY = 'vertraege.showInactive';
  private static readonly SORT_COLUMN_KEY = 'vertraege.sortColumn';
  private static readonly SORT_DIRECTION_KEY = 'vertraege.sortDirection';
  selectedRowId: string | null = null;
  activeSortColumn: string | null = null;

  sortState: { [key: string]: 'asc' | 'desc' } = {
    vertragsname: 'asc',
    zusatz: 'asc',
    geplan: 'desc',
    'org-Einheit': 'asc',
    verbrauchtDate: 'desc',
  };

  constructor(
    private vertraegeService: VertraegeService,
    private router: Router,
    private host: ElementRef<HTMLElement>,
  ) {
    this.selectedRowId = sessionStorage.getItem(VertragList2Component.LAST_ROW_KEY);
    this.searchTerm = sessionStorage.getItem(VertragList2Component.SEARCH_KEY) ?? '';
    this.showInactive = sessionStorage.getItem(VertragList2Component.SHOW_INACTIVE_KEY) === 'true';
    this.activeSortColumn = sessionStorage.getItem(VertragList2Component.SORT_COLUMN_KEY);
    const storedDir = sessionStorage.getItem(VertragList2Component.SORT_DIRECTION_KEY) as 'asc' | 'desc' | null;
    if (this.activeSortColumn && storedDir) {
      this.sortState[this.activeSortColumn] = storedDir;
    }

    this.vertraegeService.getVertraege().subscribe({
      next: (data) => {
        this.vertraege = this.sortData(data ?? []);
        this.filterData();
        if (this.activeSortColumn) {
          this.applySort(this.activeSortColumn);
        }
        this.scrollToSelectedRow();
      },
      error: (err) => {
        console.error('Error fetching vertraege list:', err);
      },
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item: ApiVertrag, property: string): string | number => {
      switch (property) {
        case 'vertragsname':
          return (item.vertragsname ?? '').toString().toLowerCase();
        case 'zusatz':
          return (item.vertragszusatz ?? '').toString().toLowerCase();
        case 'geplan':
          return parseFloat((item as any).stundenGeplant) || 0;
        case 'org-Einheit':
          return (item.vertragsverantwortlicher?.organisationseinheit?.kurzBezeichnung ?? '')
            .toString()
            .toLowerCase();
        case 'verbrauchtDate':
          return parseFloat((item as any).stundenGebucht) || 0;
        default:
          return ((item as Record<string, unknown>)[property] ?? '').toString().toLowerCase();
      }
    };
  }

  sortData(data: ApiVertrag[]): ApiVertrag[] {
    return [...data].sort((a, b) => {
      const nameA = a.vertragsname?.toLowerCase() || '';
      const nameB = b.vertragsname?.toLowerCase() || '';
      return nameA.localeCompare(nameB);
    });
  }

  toggleSort(field: string) {
    if (this.activeSortColumn === field) {
      this.sortState[field] = this.sortState[field] === 'asc' ? 'desc' : 'asc';
    }
    this.activeSortColumn = field;
    sessionStorage.setItem(VertragList2Component.SORT_COLUMN_KEY, field);
    sessionStorage.setItem(VertragList2Component.SORT_DIRECTION_KEY, this.sortState[field]);
    this.applySort(field);
  }

  private applySort(field: string) {
    const direction = this.sortState[field];
    const sorted = [...this.dataSource.data].sort((a, b) => {
      const valueA = this.getSortValue(a, field);
      const valueB = this.getSortValue(b, field);

      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    this.dataSource.data = sorted;
  }

  private getSortValue(item: ApiVertrag, field: string): string | number {
    switch (field) {
      case 'vertragsname':
        return (item.vertragsname ?? '').toString().toLowerCase();
      case 'zusatz':
        return (item.vertragszusatz ?? '').toString().toLowerCase();
      case 'geplan':
        return parseFloat((item as any).stundenGeplant) || 0;
      case 'org-Einheit':
        return (item.vertragsverantwortlicher?.organisationseinheit?.kurzBezeichnung ?? '')
          .toString()
          .toLowerCase();
      case 'verbrauchtDate':
        return ((item as any).verbraucht ?? '').toString().toLowerCase();
      default:
        return ((item as Record<string, unknown>)[field] ?? '').toString().toLowerCase();
    }
  }

  filterData() {
    sessionStorage.setItem(VertragList2Component.SEARCH_KEY, this.searchTerm);
    const term = this.searchTerm.toLowerCase();
    const filtered = this.vertraege.filter((p) => {
      const matchesSearch =
        (p.vertragsname || '').toLowerCase().includes(term) ||
        (p.vertragszusatz || '').toLowerCase().includes(term) ||
        (p.vertragsverantwortlicher?.organisationseinheit?.kurzBezeichnung || '')
          .toLowerCase()
          .includes(term);
      const matchesActiveStatus = this.showInactive ? true : p.aktiv !== false;
      return matchesSearch && matchesActiveStatus;
    });
    this.dataSource.data = filtered;
    if (this.activeSortColumn) {
      this.applySort(this.activeSortColumn);
    }
  }

  onCheckboxChange() {
    sessionStorage.setItem(VertragList2Component.SHOW_INACTIVE_KEY, String(this.showInactive));
    this.filterData();
  }

  clearSearch() {
    this.searchTerm = '';
    this.filterData();
  }

  addProduct(): void {
    this.router.navigate(['/vertraege-2/new']);
  }

  selectRow(row: ApiVertrag): void {
    this.selectedRowId = row.id ?? null;
    if (row.id) {
      sessionStorage.setItem(VertragList2Component.LAST_ROW_KEY, row.id);
    }
  }

  goToDetails(row: ApiVertrag) {
    if (row.id) {
      sessionStorage.setItem(VertragList2Component.LAST_ROW_KEY, row.id);
    }
    this.selectedRowId = row.id ?? null;
    this.router.navigate(['/vertraege-2', row.id], {
      state: { produktData: row },
    });
  }

  private scrollToSelectedRow(): void {
    if (!this.selectedRowId) return;
    const id = this.selectedRowId;
    setTimeout(() => {
      const container = this.host.nativeElement.querySelector('.table-container') as HTMLElement | null;
      const row = this.host.nativeElement.querySelector(`[data-row-id="${id}"]`) as HTMLElement | null;
      if (!container || !row) return;
      const targetTop = row.offsetTop - (container.clientHeight - row.clientHeight) / 2;
      container.scrollTop = Math.max(0, targetTop);
    });
  }
}
