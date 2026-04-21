import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AbwesenheitListComponent } from '../abwesenheit-list/abwesenheit-list.component';
import { AbwesenheitDetailComponent } from '../abwesenheit-detail/abwesenheit-detail.component';
import {ApiStempelzeit} from '../../../models/ApiStempelzeit';
import {AbwesenheitService} from '../../../services/abwesenheit.service';
import {Subject, takeUntil} from 'rxjs';
import {NavigationRefreshService} from '../../../services/navigation-refresh.service';
import {filter} from 'rxjs/operators';
import {MatTooltipModule} from '@angular/material/tooltip';


@Component({
  selector: 'app-abwesenheit',
  imports: [
    CommonModule,
    AbwesenheitListComponent,
    AbwesenheitDetailComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './abwesenheit.component.html',
  styleUrl: './abwesenheit.component.scss'
})
export class AbwesenheitComponent implements OnInit{

  private destroy$ = new Subject<void>();

  @ViewChild(AbwesenheitListComponent) absenceTable!: AbwesenheitListComponent;
  @ViewChild(AbwesenheitDetailComponent) absenceForm!: AbwesenheitDetailComponent;

  selectedAbwesenheitId: string | null = null;
  selectedAbwesenheit: ApiStempelzeit | null = null;
  private isEditing: boolean = false;

  constructor( private abwesenheitService : AbwesenheitService,
               private navigationRefreshService: NavigationRefreshService) {}


  ngOnInit(): void {
    this.navigationRefreshService.refresh$
      .pipe(
        filter(route => route === '/abwesenheit'),
    takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.selectedAbwesenheitId = null;   // ← clear selection
        this.selectedAbwesenheit = null;
        this.abwesenheitService.triggerRefresh();
      });

   }


  onAbsenceSelected(event: { id: string; row? : ApiStempelzeit; editMode?: boolean }): void {
    this.selectedAbwesenheitId = event.id;
    this.selectedAbwesenheit = event.row?? null;

    // If editMode is true, tell the form to enter edit mode
    if (event.editMode && this.absenceForm) {
      // Wait for the form to load the data, then enter edit mode
      setTimeout(() => {
        this.absenceForm.enterEditMode();
      }, 100);
    }
  }


  onFormSaved(): void {
    // Clear the selection and refresh the table
    console.log('onFormSaved',   this.selectedAbwesenheitId);

    this.selectedAbwesenheitId = null;
    if (this.absenceTable) {
      this.absenceTable.loadAbwesenheiten();
    }
  }

  onFormCancelled(): void {
    // Just clear the selection, form will stay visible
    this.selectedAbwesenheitId = null;
  }


  createNewAbsence(): void {
    this.selectedAbwesenheitId = 'new';
    this.selectedAbwesenheit = null;
    this.isEditing = true;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }



}
