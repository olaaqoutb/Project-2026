import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConstants } from '../models/app-constants';
import { Observable } from 'rxjs';
import { ApiTaetigkeitsbuchung } from '../models/ApiTaetigkeitsbuchung';

@Injectable({
  providedIn: 'root'
})
export class FreigabeService {

  constructor(private http: HttpClient) { }

  getFreigabePositionen(): Observable<any[]> {
    return this.http.get<any[]>(AppConstants.API_URL_FREIGABE_POSITIONEN + '?funktion=DV');
  }


  getFreigabePositionenDetail(id : string): Observable<ApiTaetigkeitsbuchung[]> {
    console.log('id', id);
    return this.http.get<ApiTaetigkeitsbuchung[]>(AppConstants.API_URL_FREIGABE_POSITIONEN + '/' + id + '/taetigkeitsbuchungen');
  }
}
