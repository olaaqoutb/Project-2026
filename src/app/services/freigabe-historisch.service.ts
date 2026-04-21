import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConstants } from '../models/app-constants';
import { ApiTaetigkeitsbuchung } from '../models/ApiTaetigkeitsbuchung';
import {GetitRest2Service} from './getit-rest-2.service';
import {DateUtilsService} from './utils/date-utils.service';
import {ApiFreigabePosition} from '../models/ApiFreigabePosition';
@Injectable({
  providedIn: 'root'
})
export class FreigabeHistorischService {

  constructor(private http: HttpClient,
              private getitRestService : GetitRest2Service) { }

  getFreigabePositionen(selectedMonth : string): Observable<ApiFreigabePosition[]> {
    let ab  = DateUtilsService.getFirstDayOfMonth(selectedMonth);
    let bis = DateUtilsService.getLastDayOfMonth(selectedMonth);

    console.log('selectedMonth', this.convertMonthYear(selectedMonth));

    return this.getitRestService.getFreigabePositionenHistory(ab, bis);

   // return this.http.get<any[]>(AppConstants.API_URL_FREIGABE_POSITIONEN + '/history?' + this.convertMonthYear(selectedMonth)); //?ab=2025-08-01&bis=2025-08-31');
  }


  getFreigabePositionenDetail(id : string): Observable<ApiTaetigkeitsbuchung[]> {
    console.log('id', id);
    return this.http.get<ApiTaetigkeitsbuchung[]>(AppConstants.API_URL_FREIGABE_POSITIONEN + '/' + id + '/taetigkeitsbuchungen');
  }

  convertMonthYear(value: string): string {
    // value is expected as "MM-YYYY"
    const [monthStr, yearStr] = value.split('-');

    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);

    // Build "ab" (first day of month)
    const ab = `${year}-${month.toString().padStart(2, '0')}-01`;

    // Calculate last day of month
    const lastDay = new Date(year, month, 0).getDate();
    const bis = `${year}-${month.toString().padStart(2, '0')}-${lastDay}`;

    return `ab=${ab}&bis=${bis}`;
  }
}
