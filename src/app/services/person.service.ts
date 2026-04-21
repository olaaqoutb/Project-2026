import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, ReplaySubject, tap, throwError} from 'rxjs';
import {AppConstants} from '../models/app-constants';
import {environment} from '../../environments/environment';
import {ApiPerson} from '../models/ApiPerson';
import {GetitRest2Service} from './getit-rest-2.service';

@Injectable({
  providedIn: 'root'
})
export class PersonService {


 // private currentUserSubject = new ReplaySubject<ApiPerson>(1);
 // private allPersonsSubject = new ReplaySubject<ApiPerson[]>(1);

 // public currentUser$: Observable<ApiPerson> = this.currentUserSubject.asObservable();
  // public allPersons$: Observable<ApiPerson[]> = this.allPersonsSubject.asObservable();

  private allPersonsLoaded : boolean = false;


  private loaded = false;
  private loading = false;

  constructor(private getitRestService: GetitRest2Service) {
  }

 /* loadAllPersons(): Observable<ApiPerson[]> {
    console.log(AppConstants.API_URL_PERSONEN);
    return this.getitRestService.getPersonen();
  }
*/
}
