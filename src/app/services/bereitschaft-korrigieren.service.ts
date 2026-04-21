import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetitRestService } from './getit-rest.service';
import { ApiStempelzeit } from '../models/ApiStempelzeit';
import { ApiPerson } from '../models/ApiPerson';
import{GetitRest2Service} from './getit-rest-2.service';

@Injectable({
  providedIn: 'root'
})
export class BereitschaftKorrigierenService {

  constructor(
    //private getitRestService: GetitRestService,
    private getitRestService: GetitRest2Service,
  ) {}


  // CREATE
  createBereitschaft(
    personId: string,
    dto: ApiStempelzeit
  ): Observable<ApiStempelzeit[]> {

    console.log('createBereitschaft', dto);

    return this.getitRestService.createBereitschaft(dto, personId);
  }

  // DELETE
  deleteBereitschaft(id: string): Observable<void> {
    return this.getitRestService.deleteBereitschaft(id);
  }


  getPersonen( berechneteStunden?: string,
    nurNamen?: string,
    funktion?: string): Observable<ApiPerson[]> {
         return this.getitRestService.getPersonen(berechneteStunden, nurNamen, funktion);
      }

  /* getPersonen__(berechneteStunden: boolean = false, nurNamen: boolean = false): Observable<ApiPerson[] | null> {
      return null; //this.getitRestService.getPersonen(berechneteStunden, nurNamen);
   }

*/
   getPersonStempelzeitenNoAbwesenheit (
    personIdStr: string,
    loginAb?: string,
    loginBis?: string
  ): Observable<ApiStempelzeit[]> {
    console.log('Loading stempelzeiten for person:', personIdStr);
    console.log('parameters:', { loginAb, loginBis });
    return this.getitRestService.getPersonStempelzeitenNoAbwesenheit(personIdStr, loginAb, loginBis);
  }
}
