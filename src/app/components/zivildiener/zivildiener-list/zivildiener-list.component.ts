import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  HttpClientModule } from '@angular/common/http';
 import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { Person } from "../../../models/person";
import { MatCellDef, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatHeaderRowDef } from "@angular/material/table";
import { ZivildienerService } from '../../../services/zivildiener.service';
import { ApiPerson } from '../../../models/ApiPerson';
import { ApiMitarbeiterart } from '../../../models/ApiMitarbeiterart';

@Component({
  selector: 'app-zivildiener-list',
  imports: [
    MatCellDef,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatHeaderRowDef,
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
    HttpClientModule],
  templateUrl: './zivildiener-list.component.html',
  styleUrl: './zivildiener-list.component.scss'
})
export class ZivildienerListComponent {

  displayedColumns: string[] = [
    'icon',
    'nachname',
    'vorname',
    'mitarbeiterart',
  ];

  attendanceData: ApiPerson [] = [];
  filteredData: ApiPerson[] = [];
  dataSource = new MatTableDataSource<ApiPerson>();
  searchTerm: string = '';
  showInactive: boolean = false;
  showSideMenu: boolean = false;
  sideMenuType: 'phone' | 'info' | null = null;
  selectedEmployee: ApiPerson | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  sortState: { [key: string]: 'asc' | 'desc' } = {
    nachname: 'asc',        // changed from famName
    vorname: 'asc',         // changed from vorName
    mitarbeiterart: 'asc'
  };


  constructor(
    private renderer: Renderer2,
    private router: Router,
    private zivildienerService: ZivildienerService

  ) { }

  ngOnInit(): void {
 //   this.loadDataFromJson();
      this.loadDataFromServer();
  }

  loadDataFromServer(): void {
    this.isLoading = true;
    this.errorMessage = '';

    console.log('loadDataFromServer()');

        this.zivildienerService.getZivildiener().subscribe({
      next: (data : ApiPerson[]) => {
        console.log('data-length', data.length);
        console.log('data', data);

        data = data.filter( person => person.mitarbeiterart === ApiMitarbeiterart.ZIVILDIENSTLEISTENDER.toUpperCase());
        console.log('data-length-after', data.length);
        console.log('data-after', data);

        this.attendanceData = data ;//  this.transformData(data);
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

    this.zivildienerService.getZivildiener().subscribe({
      next: (data) => {
        console.log('data-length', data.length);
        this.attendanceData = data;// this.transformData(data);
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


  /*
  private transformData(data: ApiPerson[]): ApiPerson[] {
    return data.map(item => {
      const vorname = item.vorname || item.vorname  ;
      const nachname =  item.nachname ;
      const mitarbeiterart =  item.mitarbeiterart  ;

      return {
        id: item.id || Math.random().toString(),
        // New property names
        vorname: vorname,
        nachname: nachname,
        mitarbeiterart: mitarbeiterart,
        // Old property names (required by Person interface)
        vorName: vorname,
        famName: nachname,
        mita: mitarbeiterart,
        // Additional required properties
        rolle: item.rolle || '-',
        aktiv: item.aktiv !== undefined ? item.aktiv : true,
        anwesend: item.anwesend || 'active',
        logoff: item.logoff,
        abwesenheitVorhanden: item.abwesenheitVorhanden || false
      };
    });
  }
  */

  ngOnDestroy(): void { }



  onCheckboxChange(): void {
    console.log('onCheckboxChange-this.showInactive', this.showInactive);
    this.applyFilter();
  }

  filterdata(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    let filtered = [...this.attendanceData];

    console.log('filtered-size-before', filtered.length);
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

  getRowClass(row: Person): string {
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

  private getSortValue(item: any, field: string): string {
    let value = '';

    switch (field) {
      case 'nachname':          // changed from 'famName'
        value = (item.nachname || '').toString();
        break;
      case 'vorname':           // changed from 'vorName'
        value = (item.vorname || '').toString();
        break;
      case 'mitarbeiterart':    // changed from 'mita'
        value = (item.mitarbeiterart || '').toString();
        break;
      default:
        value = (item[field] || '').toString();
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

  compare(a: string | number | boolean, b: string | number | boolean, isAsc: boolean): number {
    const aStr = String(a || '').toLowerCase();
    const bStr = String(b || '').toLowerCase();

    if (aStr < bStr) return isAsc ? -1 : 1;
    if (aStr > bStr) return isAsc ? 1 : -1;
    return 0;
  }

  goToDetails(row: ApiPerson): void {
    console.log('Navigate to details:', row);

    if (row.id) {
      sessionStorage.setItem('selectedPerson', JSON.stringify(row));
     // this.router.navigate(['/zivildiener', row.id]);
      this.router.navigate(['/zivildiener', row.id], { state: { rowData: row } });
    } else {
      console.error('civilian ID is missing');
    }
  }

  openDetailDialog(employee: ApiPerson): void {
    console.log('openDetailDialog', employee);
  }

  toggleSideMenu(type: 'phone' | 'info'): void {
    if (this.showSideMenu && this.sideMenuType === type) {
      this.showSideMenu = false;
      this.sideMenuType = null;
      this.selectedEmployee = null;
    } else {
      this.showSideMenu = true;
      this.sideMenuType = type;
    }
  }

  getStatusClass(status?: string): string {
    if (!status) return '';
    switch (status) {
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      case 'special':
        return 'status-special';
      default:
        return '';
    }
  }

  getIconClass(entry: ApiPerson): string {
    if (!entry) return 'user-active';
    /*
    if (entry.anwesend === 'ABWESEND') return 'user-inactive';
    if (entry.anwesend === 'inactive') return 'user-inactive';
    if (entry.anwesend === 'special') return 'user-special'; */
    return 'user-active';
  }

  getMitarbeiterart(mitarbeiterart: string) {
    return mitarbeiterart;
  }

  /*
  createColumnAbwesendBis(person: ApiPerson) {
    if (!person) return '';
    if (person.logoff) {
      try {
        const date = new Date(person.logoff);
        return isNaN(date.getTime()) ? '' : date.toLocaleString();
      } catch {
        return '';
      }
    } else {
      if (person.abwesenheitVorhanden) {
        return 'Ende der Abwesenheit unbekannt';
      } else {
        return '';
      }
    }
  }
  */

  callEmployee(employee: ApiPerson, event?: Event): void {
    const previousCallingElements = document.querySelectorAll('.phone-list-item.calling');
    previousCallingElements.forEach((element) => {
      this.renderer.removeClass(element, 'calling');
    });

    if (event) {
      const element = event.currentTarget as HTMLElement;
      this.renderer.addClass(element, 'calling');
      setTimeout(() => {
        this.renderer.removeClass(element, 'calling');
      }, 2000);
    }

    this.selectedEmployee = employee;
  }

}
