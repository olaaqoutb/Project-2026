import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
 import {GetitRest2Service} from './getit-rest-2.service';
import {ApiPersonAnwesenheit} from '../models/ApiPersonAnwesenheit';
 import {ApiZeitTyp} from '../models/ApiZeitTyp';
import {DateUtilsService} from './utils/date-utils.service';
import {ApiStempelzeit} from '../models/ApiStempelzeit';
import {getEnumKeyByValue} from './utils/enum.utils';
import {GetitRest3Service} from './getit-rest-3.service';

@Injectable({
  providedIn: 'root',
})
export class AnwesenheitenlisteService {
  private apiUrl = '/api/attendance'; // Adjust this URL to your backend endpoint

  constructor(private http: HttpClient,
              private getitRestService : GetitRest2Service,
              private getitRestService_ : GetitRest3Service,
              ) {}

  /*
  getPersonenAnweesnd(): Observable<ApiPersonAnwesenheit[]> {
   return  this.getitRestService.getPersonsAnwesend()
  }
  */

  getPersonenAnweesnd_(): Observable<HttpResponse<ApiPersonAnwesenheit[]>> {
    return  this.getitRestService_.getPersonsAnwesend()
  }

  getPersonAnwersenheitsListe(personId : string): Observable<ApiStempelzeit[]> {
    return this.getitRestService.getStempelzeit(personId,  getEnumKeyByValue(ApiZeitTyp,  ApiZeitTyp.ABWESENHEIT),  DateUtilsService.getCurrentDay())
  }


  getPersonAnwersenheitsListe_(personId : string): Observable<HttpResponse<ApiStempelzeit[]>> {
    return this.getitRestService_.getStempelzeit(personId,  getEnumKeyByValue(ApiZeitTyp,  ApiZeitTyp.ABWESENHEIT),  DateUtilsService.getCurrentDay())
  }

  getTelefonListePdf(){
    this.getitRestService.getTelefonlistePdf().subscribe({
      next: (blob: Blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');

        // Clean up after 30 seconds
        setTimeout(() => {
          window.URL.revokeObjectURL(blobUrl);
        }, 30000);
      },
      error: (err) => {
        console.error('Failed to open PDF', err);
        alert('Fehler beim Öffnen der Telefonliste.');
      }
    });

  }


  getInfoPdf(){
    this.getitRestService.getInfoPdf().subscribe({
      next: (blob: Blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');

        // Clean up after 30 seconds
        setTimeout(() => {
          window.URL.revokeObjectURL(blobUrl);
        }, 30000);
      },
      error: (err) => {
        console.error('Failed to open PDF', err);
        alert('Fehler beim Öffnen der Info-PDF.');
      }
    });

  }


  uploadTelefonliste(file: File): Observable<string> {
    return this.getitRestService.uploadTelefonliste(file);
  }



  calculateDays(login: Date | null, logoff: Date | null): string | null {
    if (logoff && login) {
      const diff = logoff.getTime() - login.getTime();
      const totalHours = diff / 1000 / 60 / 60;
      const remainingHours = totalHours % 24;
      const fullDays = (totalHours - remainingHours) / 24;

      let days = fullDays;
      if (remainingHours >= 8.0) {
        days += 1;
      }

      return `${days}`;
    } else {
      return null;
    }
  }

}
