import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject, Input,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';


import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
 import { MatGridListModule } from '@angular/material/grid-list';

//import { StempelzeitDto } from '../../../models/person';
import { AbwesenheitService } from '../../../services/abwesenheit.service';
import { FlexLayoutModule } from '@angular/flex-layout';
//import { DeleteConfirmDialogComponent } from '../../delete-confirm-dialog/delete-confirm-dialog.component';
import { AbsenceService } from '../../../services/absence.service';
import { AbsenceTableDto } from '../../../models/absence.interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {ApiStempelzeit} from '../../../models/ApiStempelzeit';
import {PersonenService} from '../../../services/personen.service';
import {HttpResponse} from '@angular/common/http';
import {AppConstants} from '../../../models/app-constants';
import {StatusPanelService} from '../../../services/utils/status-panel-status.service';
import {InfoDialogComponent} from '../../dialogs/info-dialog/info-dialog.component';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import { filter } from 'rxjs/operators';
import {Subject, takeUntil} from 'rxjs';
import {MatTooltipModule} from '@angular/material/tooltip';
import {DateUtilsService} from '../../../services/utils/date-utils.service';

@Component({
  selector: 'app-abwesenheit-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatGridListModule,
    MatProgressSpinnerModule,

    CommonModule,
    FlexLayoutModule,
    MatTooltipModule,

  ],
  templateUrl: './abwesenheit-list.component.html',
  styleUrl: './abwesenheit-list.component.scss'
 })
export class AbwesenheitListComponent{
  private destroy$ = new Subject<void>();

  @Output() abwesenheitSelected = new EventEmitter<{
    id: string;
    row?: ApiStempelzeit;
    editMode?: boolean;
  }>();

  displayedColumns: string[] = ['beginn', 'ende', 'actions'];
  dataSource: ApiStempelzeit[] = [];
  loading: boolean = false;
   totalAbsences: number = 0;

  //selectedAbwesenheitId: string | null = null;
  selectedAbwesenheit: ApiStempelzeit | null = null;
  // Delete operation state
  deleting: { [key: string]: boolean } = {};
  currentUser : string = '';
  @Input() selectedAbwesenheitId!: string | null;
  constructor(
              private abwesenheitService : AbwesenheitService,
              private personenService : PersonenService,
              private statusPanelService : StatusPanelService,
              private dialog: MatDialog,
            //  private router: Router,
            //  private route: ActivatedRoute,


  ) {}

  ngOnInit(): void {
    this.currentUser = this.personenService.getCurrentUser()?.vorname + ' ' + this.personenService.getCurrentUser()?.nachname;
    this.loadAbwesenheiten();

    this.abwesenheitService.refresh$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadAbwesenheiten());

  }

  loadAbwesenheiten(): void {
    const startTime = Date.now();
    this.abwesenheitService.getAbwesenheitsListe().subscribe({
     next: (response : HttpResponse<ApiStempelzeit[]>) => {
        const duration = Date.now() - startTime;
        this.dataSource  = response.body!;
        this.statusPanelService.addMessageRequest(AppConstants.MSG_ABWESENHEITEN_LOADED_SUCCESS, 'POST', duration, response);
      },
      error: (err) => {
        const duration = Date.now() - startTime;
        this.statusPanelService.addMessageRequest(AppConstants.MSG_ABWESENHEITEN_LOADED_ERROR, 'POST', duration, err);
      }});
  }

  selectAbwesenheit(id: string, row: ApiStempelzeit): void {
    this.selectedAbwesenheitId = row.id!;
    this.selectedAbwesenheitId = String( row.id!);
    this.selectedAbwesenheit = row;
    this.abwesenheitSelected.emit({  id:  row.id! , row:row });
  }

  sendEmail(id: string, row : ApiStempelzeit){
    console.log('send-Email', id, row);
     this.abwesenheitService.sendCalendar(id)
      .subscribe({
        next: (response : HttpResponse<void>) => {
          console.log('Calendar sent successfully', response);

          this.dialog.open(InfoDialogComponent, {
            data: {
              title: 'Erfolgreich exportiert',
              detail: AppConstants.MSG_ABWESENHEITEN_SEND_CALENDAR_SUCCESS
            },
            panelClass: 'custom-dialog-width',
          });
        },
        error: (error) => {
          console.error('Error sending calendar', error);
        },
        complete: () => {
          console.log('Request completed');
        }
      });
  }
  createAbwesenheit(): void {
    this.abwesenheitSelected.emit({ id: 'new', row : undefined });
  }




  getRowDateStatus(element: ApiStempelzeit): string {
    const now = new Date(); // current date and time
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const beginn = element.login ? new Date(element.login) : null;
    const ende = element.logoff ? new Date(element.logoff) : null;

    // row-past: ende (with full time) is before now
    if (ende && ende < now) {
      return 'row-past';
    }

    // row-today: beginn or ende falls on today (date only)
    const beginnDateOnly = beginn ? new Date(beginn.setHours(0, 0, 0, 0)) : null;
    const endeDateOnly = ende ? new Date(new Date(element.logoff!).setHours(0, 0, 0, 0)) : null;

    if (
      (beginnDateOnly && beginnDateOnly.getTime() === today.getTime()) ||
      (endeDateOnly && endeDateOnly.getTime() === today.getTime())
    ) {
      return 'row-today';
    }

    return 'row-today';
  }

  getRowDateStatus_(element: ApiStempelzeit): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const now = new Date(); // Current date AND time

    const beginn = element.login ? new Date(element.login) : null;
    const ende = element.logoff ? new Date(element.logoff) : null;

    // Normalize to date only
    if (beginn) beginn.setHours(0, 0, 0, 0);
    if (ende) ende.setHours(0, 0, 0, 0);

    const todayTime = today.getTime();

    if ((beginn && beginn <= now) && (ende && ende <= now)) {
      return 'row-past';
    }

    if (ende && ende.getTime() === todayTime) {
      return 'row-today';
    }

     if (beginn && beginn.getTime() === todayTime) {
      return 'row-today';
    }

    return 'row-today';
  }

  formatDateTimeEnde(dateString: string | undefined): string {
    if (!dateString) {
      return '-';
    }
    return  DateUtilsService.formatDateTimeWithoutSeconds(new Date(dateString));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}


