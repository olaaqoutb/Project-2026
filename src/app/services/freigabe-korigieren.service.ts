import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiFreigabePosition } from '../models/ApiFreigabePosition';
import { ApiTaetigkeitsbuchung } from '../models/ApiTaetigkeitsbuchung';
import { GetitRest3Service } from './getit-rest-3.service';

@Injectable({
  providedIn: 'root'
})
export class FreigabeKorigierenService {

  constructor(private getitRest3Service: GetitRest3Service) { }

  getFreigabePositionen(): Observable<HttpResponse<ApiFreigabePosition[]>> {
    return this.getitRest3Service.getFreigabePositionen('PO');
  }

  getFreigabePositionenDetail(id: string): Observable<HttpResponse<ApiTaetigkeitsbuchung[]>> {
    return this.getitRest3Service.getFreigabePositionTaetigkeitsbuchungen(id);
  }

  updateFreigabePositionen(dto: ApiFreigabePosition[]): Observable<HttpResponse<ApiFreigabePosition[]>> {
    return this.getitRest3Service.updateFreigabePositionen(dto);
  }
}
