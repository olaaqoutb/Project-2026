import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiFreigabePosition } from '../models/ApiFreigabePosition';
import { ApiTaetigkeitsbuchung } from '../models/ApiTaetigkeitsbuchung';
import { GetitRest3Service } from './getit-rest-3.service';
import { DateUtilsService } from './utils/date-utils.service';

@Injectable({
  providedIn: 'root'
})
export class FreigabeHistorischService {

  constructor(private getitRest3Service: GetitRest3Service) { }

  getFreigabePositionen(selectedMonth: string): Observable<HttpResponse<ApiFreigabePosition[]>> {
    const ab = DateUtilsService.getFirstDayOfMonth(selectedMonth);
    const bis = DateUtilsService.getLastDayOfMonth(selectedMonth);
    return this.getitRest3Service.getFreigabePositionenHistory(ab, bis);
  }

  getFreigabePositionenDetail(id: string): Observable<HttpResponse<ApiTaetigkeitsbuchung[]>> {
    return this.getitRest3Service.getFreigabePositionTaetigkeitsbuchungen(id);
  }
}
