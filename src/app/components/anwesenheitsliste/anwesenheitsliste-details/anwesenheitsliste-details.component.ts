import {Component, inject, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { AnwesenheitenlisteService } from '../../../services/anwesenheitenliste.service';

import { DateUtilsService } from '../../../services/utils/date-utils.service';
import {ApiStempelzeit} from '../../../models/ApiStempelzeit';
import {ApiPersonAnwesenheit} from '../../../models/ApiPersonAnwesenheit';
import {HttpResponse} from '@angular/common/http';
import {AppConstants} from '../../../models/app-constants';
import {StatusPanelService} from '../../../services/utils/status-panel-status.service';

@Component({
  selector: 'app-anwesenheitsliste-details',
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
  ],
  templateUrl: './anwesenheitsliste-details.component.html',
  styleUrl: './anwesenheitsliste-details.component.scss'
})

export class AnwesenheitslisteDetailsComponent {
  statusPanelService = inject(StatusPanelService);
  anwesenheitenlisteService= inject(AnwesenheitenlisteService);

  person: ApiPersonAnwesenheit;
  abwesenheitenPeriods: ApiStempelzeit[] = [];
  displayedColumns: string[] = ['beginn', 'ende', 'tage'];

  constructor(private dateUtilsService: DateUtilsService,
              private dialogRef: MatDialogRef<AnwesenheitslisteDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { employee: ApiPersonAnwesenheit },
  ) {
    this.person = data.employee;
  }

  ngOnInit(): void {
    this.loadAbwesenheitenPeriods();
  }

  loadAbwesenheitenPeriods(): void {
    const startTime = Date.now();
     this.anwesenheitenlisteService.getPersonAnwersenheitsListe_( this.person.personId!).subscribe({
      next : (response : HttpResponse<ApiStempelzeit[]>) => {
        const duration = Date.now() - startTime;
        console.log('anwesenheitenlisteService-Response', response);
        this.abwesenheitenPeriods = response.body!;
        const now = new Date();

        this.abwesenheitenPeriods = response.body!.filter(item => {
          if (!item.logoff) return true;
          const logoffDate = new Date(item.logoff);
          return logoffDate.toString() !== 'Invalid Date' && logoffDate > now;
        });

        this.statusPanelService.addMessageRequest(AppConstants.MSG_ABWESENHEITEN_LOADED_SUCCESS, 'GET', duration, response);
      },
      error :(err: any) => {
        const duration = Date.now() - startTime;
        console.error('Error occurred during save:', err);
        this.statusPanelService.addMessageRequest(AppConstants.MSG_ABWESENHEITEN_LOADED_ERROR, 'GET', duration, err);

      }
    })

  }

  close(): void {
    this.dialogRef.close();
  }

  formatDate(date: string): string {
    return this.dateUtilsService.formatDate(date, 'EE dd.MM.yyyy - HH:mm');
  }

  calculateTage(row : ApiStempelzeit) : string{


    if(row.login === undefined || row.logoff === undefined ){
      return '';
    }else{
      const days = this.anwesenheitenlisteService.calculateDays(new Date(row.login!), new Date(row.logoff!));
   //   console.log("Days: " + days);
      if (days == null) {
        return '';
      }
      return days.toString();
    }
  }
}
