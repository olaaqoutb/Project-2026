import { Component, ElementRef, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { ApiPerson } from "../../../models/ApiPerson";
import { TaetigkeitenHistorischService } from '../../../services/taetigkeiten-historisch.service';
import { TaetigkeitenKorrigierenService } from '../../../services/taetigkeiten-korrigieren.service';

@Component({
  selector: 'app-taetigkeiten-korrigieren-list',
  imports: [ FormsModule,
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
    MatCheckboxModule],
  templateUrl: './taetigkeiten-korrigieren-list.component.html',
  styleUrl: './taetigkeiten-korrigieren-list.component.scss'
})
export class TaetigkeitenKorrigierenListComponent {

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

   selectedRowId: string | null = null;
   activeSortColumn: string | null = null;

   constructor(
     private renderer: Renderer2,
     private router: Router,
     private host: ElementRef<HTMLElement>,
     private taetigkeitenKorrigierenService: TaetigkeitenKorrigierenService,
   ) {}

   ngOnInit(): void {
     window.scrollTo(0, 0);
     // Beim Klick auf den "Zurück"-Pfeil in den Details bekommt diese Liste die
     // zuletzt geöffnete Person-ID via History-State zurück. So bleibt die
     // Markierung erhalten, ohne dass wir sessionStorage benötigen. Beim Klick
     // aus dem Seitenmenü oder von einer anderen Komponente fehlt der State
     // und die Liste startet wie gewünscht frisch.
     const restoreId = (history.state && history.state.restoreRowId) as string | undefined;
     if (restoreId) {
       this.selectedRowId = restoreId;
     }
     this.loadDataFromServer();
   }

   loadDataFromServer(): void {
     this.isLoading = true;
     this.errorMessage = '';

     this.taetigkeitenKorrigierenService.getPersonen('true', 'false').subscribe({
       next: (response) => {
         const data = response.body ?? [];
         this.attendanceData = this.transformData(data);
         this.applyFilter();
         this.isLoading = false;
         if (this.selectedRowId) {
           this.scrollToSelectedRow();
         }
       },
       error: (error: any) => {
         console.error('Error loading persons:', error);
         this.errorMessage = 'Fehler beim Laden der Daten';
         this.isLoading = false;
       }
     });
   }

   /** Scrollt die zuletzt ausgewählte Zeile innerhalb des Tabellen-Containers
    *  in die Mitte, ohne die ganze Seite zu verschieben. */
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

   onRowClick(row: ApiPerson): void {
     this.selectedRowId = row.id ?? null;
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
   const sortedField = this.activeSortColumn;
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
   if (this.activeSortColumn === field) {
     this.sortState[field] = this.sortState[field] === 'asc' ? 'desc' : 'asc';
   }
   this.activeSortColumn = field;

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
     return this.sortState[column] === 'desc' ? 'mdi-chevron-down' : 'mdi-chevron-up';
   }

  goToDetails(row: ApiPerson): void {
   if (!row.id) {
     console.error('Person ID is missing', row);
     return;
   }

   this.selectedRowId = row.id;
   this.router.navigate(['/edit-activities', row.id]);
 }

 }
