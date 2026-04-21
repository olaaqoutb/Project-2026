import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { VertragService } from '../../../services/vertrag.service';

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
  ],
  templateUrl: './vertrag-list-2.component.html',
  styleUrl: './vertrag-list-2.component.scss'
})
export class VertragList2Component {
  dataSource = new MatTableDataSource<any>([]);

  produkte: any[] = [];
  searchTerm = '';
  showInactive = false;
  displayedColumns: string[] = ['verbraucht-werte-laden', 'zusatz', 'geplan', 'org-Einheit', 'verbrauchtDate'];

  // Custom sorting state - changed to match the first example
  sortState: { [key: string]: 'asc' | 'desc' } = {
    'verbraucht-werte-laden': 'asc',
    zusatz: 'asc',
    geplan: 'desc',
    'org-Einheit': 'desc',
    verbrauchtDate: 'desc'
  };

  constructor(private vertragservice : VertragService,
              private router: Router) {
    this.loadData();
  }

  loadData() {
    this.vertragservice.getVetraegeData1().subscribe({
      next: (data) => {
        console.log('Successfully fetched data:', data);
        this.produkte = data;
        this.filterData();
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.produkte = [];
        this.filterData();
      },
    });
  }



  // Custom sort function - updated to match the first example
  toggleSort(field: string) {
    // Toggle direction
    this.sortState[field] = this.sortState[field] === 'asc' ? 'desc' : 'asc';

    const direction = this.sortState[field];

    const sorted = [...this.dataSource.data].sort((a, b) => {
      let valueA = this.getSortValue(a, field);
      let valueB = this.getSortValue(b, field);

      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    this.dataSource.data = sorted;
  }

  // Helper method to get the correct value for sorting
  private getSortValue(item: any, field: string): any {
    switch (field) {
      case 'verbraucht-werte-laden':
        return (item.vertragsname || '').toString().toLowerCase();
      case 'zusatz':
        return (item.vertragszusatz || '').toString().toLowerCase();
      case 'geplan':
        return parseFloat(item.stundenGeplant) || 0;
      case 'org-Einheit':
        return (item.vertragsverantwortlicher?.organisationseinheit?.kurzBezeichnung || '').toString().toLowerCase();
      case 'verbrauchtDate':
        // Add your date parsing logic here if needed
        return (item[field] || '').toString().toLowerCase();
      default:
        return (item[field] || '').toString().toLowerCase();
    }
  }

  // Get sort icon based on column state
  getSortIcon(column: string): string {
    if (this.sortState[column] === 'asc') {
      return 'keyboard_arrow_up';
    } else if (this.sortState[column] === 'desc') {
      return 'keyboard_arrow_down';
    }
    return 'swap_vert'; // Default icon
  }

  filterData() {
    const term = this.searchTerm.toLowerCase();
    const filtered = this.produkte.filter(p => {
      const matchesSearch =
        (p.vertragsname || '').toLowerCase().includes(term) ||
        (p.vertragszusatz || '').toLowerCase().includes(term) ||
        (p.vertragsverantwortlicher?.organisationseinheit?.kurzBezeichnung || '').toLowerCase().includes(term);
      const matchesActiveStatus = this.showInactive ? true : p.aktiv !== false;
      return matchesSearch && matchesActiveStatus;
    });

    this.dataSource.data = filtered;

    // Re-apply sorting if any column is sorted
    const sortedColumns = Object.keys(this.sortState).filter(key =>
      this.sortState[key] !== 'desc' // Only reapply if a column has a specific sort
    );

    if (sortedColumns.length > 0) {
      // Reapply the first sorted column's sort
      this.toggleSort(sortedColumns[0]);
      // Toggle again to get back to the original direction
      this.toggleSort(sortedColumns[0]);
    }
  }

  onCheckboxChange() {
    this.filterData();
  }

  // clearSearch() {
  //   this.searchTerm = '';
  //   this.filterData();
  // }

  addProduct() {
    alert('Added');
  }

  goToDetails(row: any) {
    this.router.navigate(['/vertraege-2', row.id], {
      state: { produktData: row }
    });
  }
}
