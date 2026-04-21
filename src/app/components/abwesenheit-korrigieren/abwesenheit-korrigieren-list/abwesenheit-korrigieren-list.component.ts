import {Component} from '@angular/core';
import {MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {CommonModule} from '@angular/common';

import {MatDialogModule} from '@angular/material/dialog';
import {FlexLayoutModule} from '@angular/flex-layout';

import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {ApiPerson} from '../../../models/ApiPerson';

import {Router} from '@angular/router';
import {DummyService} from '../../../services/dummy.service';
import {EnumService} from '../../../services/utils/enum.service';
import {PersonenService} from '../../../services/personen.service';
import {ApiMitarbeiterart} from '../../../models/ApiMitarbeiterart';
import {getEnumKeyByValue} from '../../../services/utils/enum.utils';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ApiPersonAnwesenheit} from '../../../models/ApiPersonAnwesenheit';
import {StatusPanelService} from '../../../services/utils/status-panel-status.service';
import {AppConstants} from '../../../models/app-constants';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {NavigationRefreshService} from '../../../services/navigation-refresh.service';
import {filter, startWith} from 'rxjs/operators';
import {Subject, takeUntil} from 'rxjs';
import {AbwesenheitKorrigierenService} from '../../../services/abwesenheit-korrigieren.service';


@Component({
  selector: 'app-abwesenheit-korrigieren-list',
  imports: [
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatCheckboxModule,
    MatDialogModule,
    CommonModule,
    FlexLayoutModule
  ],
  templateUrl: './abwesenheit-korrigieren-list.component.html',
  styleUrl: './abwesenheit-korrigieren-list.component.scss'
})
export class AbwesenheitKorrigierenListComponent {
  private destroy$ = new Subject<void>();

  protected readonly EnumService = EnumService;
  displayedColumns: string[] = [
    'icon',
    'nachname',
    'vorname',
    'mitarbeiterart',
  ];
  persons: ApiPerson[] = [];
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

  private static readonly LAST_ROW_KEY = 'abwkor.lastRowId';
  selectedRowId: string | null = null;

  constructor(
    private enumService: EnumService,
    private personenService : PersonenService,
    private router: Router,
    private statusPanelService : StatusPanelService,
    private navigationRefreshService: NavigationRefreshService,
    private abwesenheitKorrigierenService : AbwesenheitKorrigierenService
   ) {}

  ngOnInit(): void {
    this.loadDataFromServer();
    this.navigationRefreshService.refresh$
      .pipe(
        filter(route => route === '/abwesenheit-korrigieren'),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.loadDataFromServer();
      });
  }
  ngOnDestroy(): void {
    console.log('ngOnDestroy called', new Date().toISOString());

    this.destroy$.next();
    this.destroy$.complete();
  }


  ngOnInit__(): void {
    this.navigationRefreshService.refresh$
      .pipe(
        filter(route => route.includes('abwesenheit-korrigieren')),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.abwesenheitKorrigierenService.triggerRefresh();
        this.abwesenheitKorrigierenService.refresh$
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => this.loadDataFromServer());
      });
    //this.loadDataFromServer();
  }

  loadDataFromServer() {
    this.isLoading = true;
    this.errorMessage = '';
    const startTime = Date.now();
    console.log('**** loadDataFromServer()');


    this.personenService.getAllPersons__('true', 'false').subscribe({
      next: (response: HttpResponse<ApiPerson[]>) => {
        const duration = Date.now() - startTime;
        this.persons = this.applySorting(response.body!);
        this.applyFilter();
        this.isLoading = false;
        this.restoreAndScrollToLastRow();
        this.statusPanelService.addMessageRequest(
          AppConstants.MSG_PERSONEN_LOADED_SUCCESS, 'GET', duration, response
        );
      },
      error: (error) => {
        const duration = Date.now() - startTime;
        this.errorMessage = 'Fehler beim Laden der Daten';
        this.isLoading = false;
        this.statusPanelService.addMessageRequest(
          AppConstants.MSG_PERSONEN_LOADED_ERROR, 'GET', duration, error
        );
      }
    });
    /*
    this.personenService.getPersons_().subscribe({
      next: (response : HttpResponse<ApiPerson[]>) => {
        const duration = Date.now() - startTime;
        this.persons = this.applySorting(response.body!); // this.transformData(data);
        this.applyFilter();
        this.isLoading = false;
        this.statusPanelService.addMessageRequest(AppConstants.MSG_PERSONEN_LOADED_SUCCESS, 'GET', duration, response);
      },
      error: (error) => {
        const duration = Date.now() - startTime;
        console.error('Error loading data from JSON:', error);
        this.errorMessage = 'Fehler beim Laden der Daten';
        this.isLoading = false;
        this.statusPanelService.addMessageRequest(AppConstants.MSG_PERSONEN_LOADED_ERROR, 'GET', duration, error);
      }
    });
    */
  }

  onInklInaktivCheckboxChange(): void {
    console.log('This.showInactive', this.showInactive);
    this.applyFilter();
  }

  filterdata(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    let filtered = [...this.persons];
    filtered = filtered.filter(person => person.portalUser);

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

    // Apply current sort to the filtered data
    this.filteredData = this.applySorting(filtered);
    this.dataSource.data = this.filteredData;
  }

  private applySorting(data: ApiPerson[]): ApiPerson[] {
    const sortedField = Object.keys(this.sortState).find(field =>
      this.sortState[field] === 'asc' || this.sortState[field] === 'desc'
    );

    if (!sortedField) {
       return data;
    }
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
    return row.aktiv === false ? 'inactive-row' : 'active-row';
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

  onRowClick(row: ApiPerson): void {
    this.selectedRowId = row.id ?? null;
  }

  goToDetails(row: ApiPerson): void {
    if (!row.id) {
      console.error('Person ID is missing', row);
      return;
    }
    this.selectedRowId = row.id;
    sessionStorage.setItem(AbwesenheitKorrigierenListComponent.LAST_ROW_KEY, row.id);
    this.router.navigate(['/abwesenheit-korrigieren', row.id], { state: { selectedPerson : row } });
  }

  private restoreAndScrollToLastRow(): void {
    const lastId = sessionStorage.getItem(AbwesenheitKorrigierenListComponent.LAST_ROW_KEY);
    if (!lastId) return;
    this.selectedRowId = lastId;
    // Wait for the next render so the row exists in the DOM.
    setTimeout(() => {
      const el = document.querySelector(`[data-row-id="${lastId}"]`) as HTMLElement | null;
      el?.scrollIntoView({ behavior: 'auto', block: 'center' });
    }, 0);
  }

}
