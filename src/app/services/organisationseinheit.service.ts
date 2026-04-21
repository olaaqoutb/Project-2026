import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable, of, tap, throwError} from 'rxjs';
 import { AppConstants } from '../models/app-constants';
import {ApiOrganisationseinheit} from '../models/ApiOrganisationseinheit';
import {GetitRest2Service} from './getit-rest-2.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrganisationseinheitService {

  constructor(private getitRestService : GetitRest2Service) { }

  getActiveData():  Observable<ApiOrganisationseinheit[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];
    console.log('Filtering organisations valid from today:', todayStr);


    // return this.getitRestService.getOrganisationsEinheiten();
    return this.getitRestService.getOrganisationsEinheiten().pipe(
      map(data =>{

        const filtered = data.filter(org => {
      //    if (org.deleted) return false;

          if (!org.gueltigBis) {
            console.warn('Excluded org (no gueltigbis):', org.kurzBezeichnung);
            return false;
          }

          const gueltigbisDate = new Date(org.gueltigBis);
          gueltigbisDate.setHours(0, 0, 0, 0);
          const isValid = gueltigbisDate.getTime() >= today.getTime();

          if (!isValid) {
            console.debug('Excluded expired org:', org.kurzBezeichnung,
              'gueltigbis:', org.gueltigBis, 'today:', todayStr);
          }
          return isValid;
        });

        console.log(`Filtered ${data.length} → ${filtered.length} active organisations`);
        return filtered.sort((a, b) =>
          (a.kurzBezeichnung ?? '').localeCompare(b.kurzBezeichnung ?? '')
        );

      }

      ),
      catchError(err => {
       // this.errorHandlingService.handleAppError(err);
        throw err; // Re-throw to prevent returning invalid data
      })
    );
  }

  getAllData():  Observable<ApiOrganisationseinheit[]> {
    // return this.getitRestService.getOrganisationsEinheiten();
    return this.getitRestService.getOrganisationsEinheiten().pipe(
      map(data =>
        data
           .sort((a, b) =>
            (a.kurzBezeichnung ?? '').localeCompare(b.kurzBezeichnung ?? '')
          )
      ),
      catchError(err => {
         throw err; // Re-throw to prevent returning invalid data
      })
    );

  }

  createOrganisation(newOrg: ApiOrganisationseinheit): Observable<ApiOrganisationseinheit> {
    console.log('NEW-ORG', newOrg);
    return this.getitRestService.createOrganisationseinheit(newOrg);
  }

  updateOrganisation(updated: ApiOrganisationseinheit):  Observable<ApiOrganisationseinheit>  {
    console.log('updated', updated);
    console.log('email', updated.email);

    if (updated.email && updated.email.length > 0 && Array.isArray(updated.email[0])) {
      updated.email = updated.email[0];
    } else {
      updated.email = []; // default to empty array
    }

    return this.getitRestService.updateOrganisationseinheit(updated.id!, updated).pipe(
      tap((response: ApiOrganisationseinheit) => {
        console.log('Updated', response);

      }),
      catchError((err) => {
        console.error('Error by updating Organisationseinheit: ', err);
        // Rethrow error to allow caller to handle it
        return throwError(() => err);
      })
    );
  }
}
