import { AfterViewInit, Component, inject, Renderer2, ViewChild } from '@angular/core';
 import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DummyService } from '../../../services/dummy.service';
import { BereitschaftKorrigierenService } from '../../../services/bereitschaft-korrigieren.service';
import { ApiPerson } from '../../../models/ApiPerson';
import { MatCheckboxModule } from '@angular/material/checkbox';
@Component({
  selector: 'app-bereitschaft-korrigieren-list',
  imports: [
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatDialogModule,
    CommonModule,
    FlexLayoutModule,
    MatCheckboxModule,
   ],
  templateUrl: './bereitschaft-korrigieren-list.component.html',
  styleUrl: './bereitschaft-korrigieren-list.component.scss'
})
export class BereitschaftKorrigierenListComponent {

  displayedColumns: string[] = [
    'icon',
    'nachname',
    'vorname',
    'mitarbeiterart',
  ];

  attendanceData: ApiPerson[] = [];
  filteredData: ApiPerson[] = [];
  dataSource = new MatTableDataSource<ApiPerson>();
  searchTerm: string = '';
  showInactive: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  sortState: { [key: string]: 'asc' | 'desc' } = {
    nachname: 'asc',
    vorname: 'asc',
    mitarbeiterart: 'asc'
  };

  constructor(
    private router: Router,
    private dummyService: DummyService,
    private bereitschaftKorrigierenService  : BereitschaftKorrigierenService
  ) {}

  ngOnInit(): void {
    //this.loadDataFromJson();
    this.loadPersonenData();
  }

  loadPersonenData(){
    this.isLoading = true;
    this.errorMessage = '';

    this.bereitschaftKorrigierenService.getPersonen().subscribe({
      next: (data) => {
        console.log('DATA', data);
        this.attendanceData = this.transformData(data);
        this.applyFilter();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading data from JSON:', error);
        this.errorMessage = 'Fehler beim Laden der Daten';
        this.isLoading = false;
      }
    });
  }

  loadDataFromJson(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.dummyService.getPersonen().subscribe({
      next: (data) => {
        this.attendanceData = this.transformData(data);
        this.applyFilter();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading data from JSON:', error);
        this.errorMessage = 'Fehler beim Laden der Daten';
        this.isLoading = false;
      }
    });
  }

 private transformData(data: ApiPerson[]): ApiPerson[] {
  return data.map(item => ({
    ...item,
    vorname: item.vorname ?? undefined,
    nachname: item.nachname ?? undefined,
    mitarbeiterart: item.mitarbeiterart ?? undefined,
    rolle: item.rolle ?? undefined
  }));
}


  ngOnDestroy(): void {}
  onCheckboxChange(): void {
    this.applyFilter();
  }

  filterdata(): void {
    this.applyFilter();
  }

 applyFilter(): void {
    let filtered = [...this.attendanceData];

    if (this.searchTerm) {
      const filterValue = this.searchTerm.toLowerCase();
      filtered = filtered.filter((item: ApiPerson) =>
        (item.nachname || '').toString().toLowerCase().includes(filterValue) ||
        (item.vorname || '').toString().toLowerCase().includes(filterValue) ||
        (item.mitarbeiterart || '').toString().toLowerCase().includes(filterValue)
      );
    }

    if (!this.showInactive) {
      filtered = filtered.filter(item => item.aktiv === true);
    }

    this.filteredData = this.applySorting(filtered);
    this.dataSource.data = this.filteredData;
  }
private applySorting(data: ApiPerson[]): ApiPerson[] {
  const sortedField = Object.keys(this.sortState).find(field =>
    this.sortState[field] === 'asc' || this.sortState[field] === 'desc'
  );

  if (!sortedField) return data;

  const direction = this.sortState[sortedField];

  return [...data].sort((a, b) => {
    let valueA = this.getSortValue(a, sortedField);
    let valueB = this.getSortValue(b, sortedField);

    if (valueA < valueB) return direction === 'asc' ? -1 : 1;
    if (valueA > valueB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}
  getRowClass(row: ApiPerson): string {
    return row.aktiv === false ? 'inactive-row' : '';
  }
 toggleSort(field: string) {
  this.sortState[field] = this.sortState[field] === 'asc' ? 'desc' : 'asc';

  const direction = this.sortState[field];
  const sorted = [...this.filteredData].sort((a, b) => {
    let valueA = this.getSortValue(a, field);
    let valueB = this.getSortValue(b, field);

    if (valueA < valueB) return direction === 'asc' ? -1 : 1;
    if (valueA > valueB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
  this.filteredData = sorted;
  this.dataSource.data = this.filteredData;
}


  private getSortValue(item:ApiPerson, field: string): string {
  let value = '';

  switch (field) {
    case 'nachname':
      value = (item.nachname || '').toString();
      break;
    case 'vorname':
      value = (item.vorname || '').toString();
      break;
    case 'mitarbeiterart':
      value = (item.mitarbeiterart || '').toString();
      break;
    default:
     value = '';
  }

  return value.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ä/g, 'a')
    .replace(/ß/g, 'ss');
}


 getSortIcon(column: string): string {
    if (this.sortState[column] === 'asc') {
      return 'keyboard_arrow_up';
    } else if (this.sortState[column] === 'desc') {
      return 'keyboard_arrow_down';
    }
    return 'swap_vert';
  }

  goToDetails(row: ApiPerson): void {
   // uiIndex is used because backend does not provide a unique identifier
  console.log('Navigate to details:', row);

    this.router.navigate(['/bereitschaftkorrigieren', row.id]);
}
}
