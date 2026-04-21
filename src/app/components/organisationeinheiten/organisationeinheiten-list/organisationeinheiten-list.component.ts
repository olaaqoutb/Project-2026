import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
//import { Datalistorganizationanc } from '../../../models/datalistorganizationanc';
import { Router } from '@angular/router';
// import { SharedDataServiceService } from '../services/shareddataservice';
 import { ErrorHandlingService } from '../../../services/error-handling.service';
import {OrganisationseinheitService} from '../../../services/organisationseinheit.service';
import {ApiOrganisationseinheit} from '../../../models/ApiOrganisationseinheit';

@Component({
  selector: 'app-organisationeinheiten-list',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatMenuModule,
  ],
  templateUrl: './organisationeinheiten-list.component.html',
  styleUrl: './organisationeinheiten-list.component.scss'
})
export class OrganisationeinheitenListComponent {


  @Output() organisationseinheitSelected = new EventEmitter<string>();
  dataSource: MatTableDataSource<ApiOrganisationseinheit> = new MatTableDataSource();
  includeInactive: boolean = false;
  displayedColumns: string[] = [
    'kurzbezeichnung',
    'bezeichnung',
    'leitung',
    'uebergeordneteEinheit',
    'gueltigVon',
    'gueltigBis',
  ];
  searchTerm: string = '';
  isWhiteBg: boolean = true;
  datalistoftaple: ApiOrganisationseinheit[] = [];
  selectedRows: ApiOrganisationseinheit[] = [];

  constructor(
    private OrganisationseinheitService: OrganisationseinheitService,
    private router: Router,
    private errorHandlingService : ErrorHandlingService,
  //  private sharedDataService: SharedDataServiceService
  ) { }

  ngOnInit(): void {
    this.OrganisationseinheitService.getActiveData().subscribe({
      next: (data) => {
       /* const sortedData = data.sort((a, b) => {
          // Handle null/undefined by sorting them to the end
          if (!a.kurzBezeichnung && !b.kurzBezeichnung) return 0;
          if (!a.kurzBezeichnung) return 1;
          if (!b.kurzBezeichnung) return -1;

          // Case-insensitive comparison
          const nameA = a.kurzBezeichnung.toLowerCase();
          const nameB = b.kurzBezeichnung.toLowerCase();

          return nameA.localeCompare(nameB);
        });

        */

        this.dataSource.data = data;
        console.log('Sorted data:', data.length);
      },
      error: (err) => {
        this.errorHandlingService.handleAppError(err);
      }
    });

/*
    this.dataSource.filterPredicate = (data: ApiOrganisationseinheit, filter: string) => {
      return (
        data.kurzBezeichnung?.toLowerCase().includes(filter) ||
        data.bezeichnung?.toLowerCase().includes(filter)
      );
    };


 */
    this.dataSource.filterPredicate = (data: ApiOrganisationseinheit, filter: string) => {
      const filterLower = filter.trim().toLowerCase();

      // Safely handle null/undefined properties with nullish coalescing
      const matchesKurz = (data.kurzBezeichnung ?? '').toLowerCase().includes(filterLower);
      const matchesBez = (data.bezeichnung ?? '').toLowerCase().includes(filterLower);

      return matchesKurz || matchesBez;
    };
    //  this.reloadData();
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  resetFilter(): void {
    this.searchTerm = '';
    this.applyFilter();
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('de-AT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  createOrganisationseinheit(): void {
    this.router.navigate(['/organisationseinheiten/new']);
  }

  toggleInactive(): void {

    if (this.includeInactive) {
      //   this.dataSource.data = this.dataoforganizationlistService.getAllData();

      this.OrganisationseinheitService.getAllData().subscribe(data => {
        this.dataSource.data = data;
        console.log('Active data:', data.length);

      });

    } else {
      //this.dataSource.data = this.dataoforganizationlistService.getActiveData();
      this.OrganisationseinheitService.getActiveData().subscribe(data => {
        this.dataSource.data = data;
        console.log('Inactive data:', data.length);

      });
    }

    this.applyFilter();
  }







  reloadData() {
    // this.dataSource.data = this.dataoforganizationlistService.getActiveData();

    this.OrganisationseinheitService.getActiveData().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (err) => {
        this.errorHandlingService.handleAppError(err);
      }
    });
  }

  selectRow(row: ApiOrganisationseinheit): void {
    this.selectedRows = [row]; // Clear previous selections and select only the current row
    console.log('Selected-Org', row);
    this.router.navigate(['/organisationseinheiten', row.id], {
      state: { selectedOrganisation: row }
    });
  }

  getStatusClass(row?: ApiOrganisationseinheit): string {

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const gueltigbisDate = new Date(row?.gueltigBis!);
    gueltigbisDate.setHours(0, 0, 0, 0);
    const isValid = gueltigbisDate.getTime() >= today.getTime();

    if(isValid){
      return 'status-active';
    }else{
      return 'status-inactive';
    }


  }

}
