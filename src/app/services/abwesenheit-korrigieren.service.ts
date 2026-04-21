import { Injectable } from '@angular/core';
import {ApiPerson} from '../models/ApiPerson';
import {Observable, ReplaySubject} from 'rxjs';
import {GetitRest2Service} from './getit-rest-2.service';
import {ApiStempelzeit} from '../models/ApiStempelzeit';
import {DateUtilsService} from './utils/date-utils.service';
import {getEnumKeyByValue} from './utils/enum.utils';
import {ApiZeitTyp} from '../models/ApiZeitTyp';
import {PersonService} from './person.service';
import {HttpResponse} from '@angular/common/http';
import {GetitRest3Service} from './getit-rest-3.service';

@Injectable({
  providedIn: 'root'
})
export class
AbwesenheitKorrigierenService {

  private refreshSubject = new ReplaySubject<void>(1);

  refresh$ = this.refreshSubject.asObservable();

  constructor(private personService: PersonService,
              private getitRestService: GetitRest2Service,
              private getitRestService_: GetitRest3Service) { }


  triggerRefresh() {
    this.refreshSubject.next();
  }

  fetchPersons(): Observable<ApiPerson[]> {

    //   private apiUrl = 'http://localhost:29200/at.gv.bmi.getit3-d/srv/v1/personen?berechneteStunden=false&nurNamen=true'; // 'https://your-api.com/Persons'; // Replace with actual API URL
    return this.getitRestService.getPersonen('false', 'true');
   }

   /*
  getPersonAbwesenheitsListe(personId: string): Observable<ApiStempelzeit[]> {
    let currentDay = DateUtilsService.getFirstDayOfLastMonth();//  .getCurrentDay();
    return this.getitRestService.getStempelzeit(personId, getEnumKeyByValue(ApiZeitTyp, ApiZeitTyp.ABWESENHEIT), currentDay);
  }*/

  getPersonAbwesenheitsListe(personId: string,
                             options?: {
                                observe?: 'body' | 'response';
                              }): Observable<HttpResponse<ApiStempelzeit[]>> {
    let currentDay = DateUtilsService.getFirstDayOfLastMonth();//  .getCurrentDay();
    return this.getitRestService.getStempelzeit1(personId, getEnumKeyByValue(ApiZeitTyp, ApiZeitTyp.ABWESENHEIT), currentDay, );
  }

  createAbwesenheit(personId: string, stempelzeit : ApiStempelzeit): Observable<ApiStempelzeit> {
    return this.getitRestService.createStempelzeit(stempelzeit, personId, 'AbwesenheitsverwaltungPO' );
  }


  createAbwesenheit_(personId: string, stempelzeit : ApiStempelzeit): Observable<HttpResponse<ApiStempelzeit>> {
    return this.getitRestService_.createStempelzeit(stempelzeit, personId, 'AbwesenheitsverwaltungPO' );
  }


  /*updateAbwesenheit(personId: string, stempelzeit : ApiStempelzeit): Observable<ApiStempelzeit> {
    return this.getitRestService.updateStempelzeit(stempelzeit, personId, 'AbwesenheitsverwaltungPO' );
  }*/

  updateAbwesenheit(personId: string, stempelzeit : ApiStempelzeit): Observable<HttpResponse<ApiStempelzeit>> {
    return this.getitRestService_.updateStempelzeit(stempelzeit, personId, 'AbwesenheitsverwaltungPO' );
  }
}
