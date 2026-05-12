import { Component, OnInit, OnDestroy, Renderer2, ElementRef } from '@angular/core';
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
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Person } from "../../../models/person";
import { MatCellDef, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatHeaderRowDef } from "@angular/material/table";
import { ZivildienerService } from '../../../services/zivildiener.service';
import { NavigationRefreshService } from '../../../services/navigation-refresh.service';
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
export class ZivildienerListComponent implements OnInit, OnDestroy {

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

  selectedRowId: string | null = null;
  activeSortColumn: string | null = null;

  sortState: { [key: string]: 'asc' | 'desc' } = {
    aktiv: 'asc',
    nachname: 'asc',
    vorname: 'asc',
    mitarbeiterart: 'asc'
  };

  /**
   * In-memory state preserved across detail-back navigation. Static so it
   * survives this component's destroy/recreate when navigating to
   * /zivildiener/:id and back. Cleared via Router events when leaving the
   * route, and via NavigationRefreshService on sidebar refresh.
   */
  private static savedState: {
    searchTerm: string;
    showInactive: boolean;
    activeSortColumn: string | null;
    sortState: { [key: string]: 'asc' | 'desc' };
    selectedRowId: string | null;
  } | null = null;
  private static routerSubInstalled = false;
  private refreshSub?: Subscription;

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private zivildienerService: ZivildienerService,
    private host: ElementRef<HTMLElement>,
    private refreshService: NavigationRefreshService,
  ) {
    if (!ZivildienerListComponent.routerSubInstalled) {
      ZivildienerListComponent.routerSubInstalled = true;
      this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe((e) => {
          if (!/^\/zivildiener(?:\/|$)/.test(e.urlAfterRedirects)) {
            ZivildienerListComponent.savedState = null;
          }
        });
    }

    const saved = ZivildienerListComponent.savedState;
    if (saved) {
      this.searchTerm = saved.searchTerm;
      this.showInactive = saved.showInactive;
      this.activeSortColumn = saved.activeSortColumn;
      this.sortState = { ...this.sortState, ...saved.sortState };
      this.selectedRowId = saved.selectedRowId;
    }

    this.refreshSub = this.refreshService.refresh$.subscribe((route) => {
      if (route === '/zivildiener') {
        this.resetAndReload();
      }
    });
  }

  ngOnInit(): void {
    this.loadDataFromServer();
  }

  loadDataFromServer(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.zivildienerService.getZivildiener().subscribe({
      next: (response) => {
        const data = (response.body ?? []).filter(
          person => person.mitarbeiterart === ApiMitarbeiterart.ZIVILDIENSTLEISTENDER
        );
        this.attendanceData = data;
        this.applyFilter();
        this.isLoading = false;
        this.scrollToSelectedRow();
      },
      error: (error) => {
        console.error('Error loading zivildiener:', error);
        this.errorMessage = 'Fehler beim Laden der Daten';
        this.isLoading = false;
      }
    });
  }

  private resetAndReload(): void {
    this.searchTerm = '';
    this.showInactive = false;
    this.activeSortColumn = null;
    this.sortState['nachname'] = 'asc';
    this.selectedRowId = null;
    ZivildienerListComponent.savedState = null;
    this.loadDataFromServer();
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

  ngOnDestroy(): void {
    ZivildienerListComponent.savedState = {
      searchTerm: this.searchTerm,
      showInactive: this.showInactive,
      activeSortColumn: this.activeSortColumn,
      sortState: { ...this.sortState },
      selectedRowId: this.selectedRowId,
    };
    this.refreshSub?.unsubscribe();
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

    // Default sort: Familienname A→Z. A user-selected column takes precedence,
    // except 'aktiv' when only active rows are shown — that sort has no effect
    // and we keep the data on the default Familienname order instead.
    let sortField = this.activeSortColumn ?? 'nachname';
    if (sortField === 'aktiv' && !this.showInactive) {
      sortField = 'nachname';
    }
    this.filteredData = this.applySorting(filtered, sortField);
    this.dataSource.data = this.filteredData;
  }

  private applySorting(data: ApiPerson[], field: string): ApiPerson[] {
    const direction = this.sortState[field];
    return [...data].sort((a, b) => {
      const valueA = this.getSortValue(a, field);
      const valueB = this.getSortValue(b, field);
      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  toggleSort(field: string) {
    if (this.activeSortColumn === field) {
      this.sortState[field] = this.sortState[field] === 'asc' ? 'desc' : 'asc';
    }
    this.activeSortColumn = field;

    // Aktiv sort only re-orders rows when inactive rows are also visible.
    // When hidden, we still toggle the icon direction but skip the resort.
    if (field === 'aktiv' && !this.showInactive) return;

    this.filteredData = this.applySorting(this.filteredData, field);
    this.dataSource.data = this.filteredData;
  }

  private getSortValue(item: any, field: string): string {
    let value = '';

    switch (field) {
      case 'aktiv':
        // asc → active (1) before inactive (0); desc flips it.
        value = item.aktiv ? '0' : '1';
        break;
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
    return this.sortState[column] === 'desc' ? 'mdi-chevron-down' : 'mdi-chevron-up';
  }

  compare(a: string | number | boolean, b: string | number | boolean, isAsc: boolean): number {
    const aStr = String(a || '').toLowerCase();
    const bStr = String(b || '').toLowerCase();

    if (aStr < bStr) return isAsc ? -1 : 1;
    if (aStr > bStr) return isAsc ? 1 : -1;
    return 0;
  }

  selectRow(row: ApiPerson): void {
    this.selectedRowId = row.id ?? null;
  }

  goToDetails(row: ApiPerson): void {
    if (row.id) {
      this.selectedRowId = row.id;
      this.router.navigate(['/zivildiener', row.id]);
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
