import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { GetitRestService } from './getit-rest.service';
import{GetitRest2Service} from './getit-rest-2.service';
import { ApiStempelzeit } from '../models/ApiStempelzeit';
import { ApiPerson } from '../models/ApiPerson';
import { ApiAbschlussInfo } from '../models/ApiAbschlussInfo';

@Injectable({
  providedIn: 'root'
})
export class BereitschaftszeitenService {

  constructor(
    private getitRestService: GetitRest2Service,
  ) {}



  // DELETE
  deleteBereitschaft(id: string): Observable<void> {
    return this.getitRestService.deleteBereitschaft(id);
  }

   getPersonen( berechneteStunden?: string,
  nurNamen?: string,
  funktion?: string): Observable<ApiPerson[]> {
      return this.getitRestService.getPersonen(berechneteStunden, nurNamen, funktion);
    }


    getPersonStempelzeitenNoAbwesenheit(
    personId: string,
    loginAb?: string,
    loginBis?: string
  ): Observable<ApiStempelzeit[]> {
    return this.getitRestService.getPersonStempelzeitenNoAbwesenheit(personId, loginAb, loginBis);
  }


  createBereitschaft(
    personId: string,
    dto: ApiStempelzeit,
    vorgang?: string
  ): Observable<ApiStempelzeit[]> {
    return this.getitRestService.createBereitschaft(dto, personId);
  }

   getPersonAbschlussInfo(personIdStr: string): Observable<ApiAbschlussInfo> {
    return this.getitRestService.getPersonAbschlussInfo(personIdStr);
  }
}
