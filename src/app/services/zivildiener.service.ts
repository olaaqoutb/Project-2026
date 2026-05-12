import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable, catchError, throwError, tap, of, delay } from 'rxjs';
import { ApiPerson } from '../models/ApiPerson';
import { ApiStempelzeit } from '../models/ApiStempelzeit';
import { GetitRest3Service } from './getit-rest-3.service';

@Injectable({
  providedIn: 'root'
})
export class ZivildienerService {

  constructor(private getitRest3Service: GetitRest3Service) {}

  /////list//////
  getZivildiener(): Observable<HttpResponse<ApiPerson[]>> {
    return this.getitRest3Service.getPersonen();
  }

  ////details////////
  getZivildienerById(id: string): Observable<HttpResponse<ApiPerson>> {
    return this.getitRest3Service.getPerson(id);
  }

  ////stempelzeiten for the detail tree////////
  getZivildienerStempelzeiten(id: string): Observable<HttpResponse<ApiStempelzeit[]>> {
    return this.getitRest3Service.getPersonStempelzeiten(id);
  }

  createZivildiener(person: ApiPerson): Observable<HttpResponse<ApiPerson>> {
    return this.getitRest3Service.createPerson(person);
  }

  updateZivildiener(id: string, person: ApiPerson): Observable<HttpResponse<ApiPerson>> {
    return this.getitRest3Service.updatePerson(id, person);
  }

  //// Stempelzeit CRUD for the zivildiener detail screen ////
  // SIMULATED — no backend call. Returns the same entry wrapped in an
  // HttpResponse so the component's existing subscribe handlers work
  // unchanged. New entries get a generated id.
  saveStempelzeit(
    stempelzeit: ApiStempelzeit,
    personId: string,
    isCreating: boolean,
    stempelzeitId?: string
  ): Observable<HttpResponse<ApiStempelzeit>> {
    const saved: ApiStempelzeit = isCreating
      ? { ...stempelzeit, id: `sz-${Date.now()}` }
      : { ...stempelzeit, id: stempelzeitId || stempelzeit.id };

    console.log('[SIMULATED] saveStempelzeit:', { isCreating, saved });
    return of(new HttpResponse({ status: 200, body: saved })).pipe(delay(0));
  }

  // SIMULATED soft-delete — does not call the backend, just returns ok.
  deleteStempelzeit(
    stempelzeit: ApiStempelzeit,
    stempelzeitId?: string
  ): Observable<HttpResponse<ApiStempelzeit>> {
    const payload: ApiStempelzeit = {
      ...stempelzeit,
      id: stempelzeitId || stempelzeit.id,
      deleted: true,
    };

    console.log('[SIMULATED] deleteStempelzeit:', payload);
    return of(new HttpResponse({ status: 200, body: payload })).pipe(delay(0));
  }
}
