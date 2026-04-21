import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
//import { Vertrag } from '../models/vertrag';
import { AppConstants } from '../models/app-constants';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
 import { GetitRest2Service } from './getit-rest-2.service';
import { ApiVertrag } from '../models/ApiVertrag';

@Injectable({
  providedIn: 'root'
})
export class VertragService {
  private vertrageDetailUrl = '1_json_personen_dropdownlist_response.json';

  constructor(private getitRestService : GetitRest2Service,
     private http: HttpClient) { }


  getVetraegeData(): Observable<ApiVertrag[]> {
    return this.http.get<ApiVertrag[]>(AppConstants.API_URL_VERTRAEGE + '?vertragdetailgrad=Uebersicht&berechneteStunden=true&verbrauchteStunden=false');
  }

  getVetraegeData1(): Observable<ApiVertrag[]> {
    return this.getitRestService.getVertraege(true, false);
   }

   getVertragDetails(id: string) : Observable<ApiVertrag>{
    return this.getitRestService.getVertrag(id, true);
   }

  loadVertragDetails(id : string): Observable<ApiVertrag> {
    console.log(AppConstants.API_URL_VERTRAEGE);
    let url = AppConstants.API_URL_VERTRAEGE + '/' + id + '?berechneteStunden=true';
    return this.http.get<ApiVertrag>(url);
  }


  getVertrageDetails(): Observable<any> {
    return this.http.get<any>(this.vertrageDetailUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Reusable error handler
  private handleError(error: HttpErrorResponse) {
    let userMessage = 'Ein unbekannter Fehler ist aufgetreten!';

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      console.error('Ein clientseitiger Fehler ist aufgetreten:', error.error.message);
      userMessage = `Netzwerkfehler: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      console.error(
        `Backend gab Fehlercode ${error.status} zurück, ` +
        `Body war:`, error.error);

      if (error.status === 404) {
        userMessage = 'Die angeforderten Vertragsdaten konnten nicht gefunden werden (Fehler 404). Bitte überprüfen Sie den Dateipfad.';
      } else if (error.status === 500) {
        userMessage = 'Es gab einen Serverfehler (Fehler 500). Bitte versuchen Sie es später erneut.';
      } else {
        userMessage = `Fehler: ${error.statusText} (Code: ${error.status})`;
      }
    }
    return throwError(() => userMessage);
  }

}
