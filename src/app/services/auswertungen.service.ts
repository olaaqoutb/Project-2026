import { Injectable } from '@angular/core';
 import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {PathConst} from './getit-rest.service';
import {ApiAuswertungsart} from '../models/ApiAuswertungsart';

@Injectable({ providedIn: 'root' })
@Injectable({
  providedIn: 'root'
})
export class AuswertungenService {

  private readonly baseUrl = '/api';

  constructor(private http: HttpClient) {}

  ergebnisverantwortlicheAuswertung(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}${PathConst.AUSWERTUNGEN_EV}`, { responseType: 'blob' });
  }

  durchfuehrungsverantwortlicheAuswertung(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}${PathConst.AUSWERTUNGEN_DV}`, { responseType: 'blob' });
  }

  servicemanagerAuswertung(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}${PathConst.AUSWERTUNGEN_SM}`, { responseType: 'blob' });
  }

  auswertung(
    jahrStr?: string,
    monatStr?: string,
    art?: ApiAuswertungsart | string,
    produktIdsStr?: string,
    produktPositionIdsStr?: string,
    personenStr?: string,
    useVerrechnetDate: string = 'true'
  ): Observable<Blob> {
    let params = new HttpParams();
    if (jahrStr) params = params.set('jahr', jahrStr);
    if (monatStr) params = params.set('monat', monatStr);
    if (art) params = params.set('art', typeof art === 'string' ? art : JSON.stringify(art));
    if (produktIdsStr) params = params.set('produkte', produktIdsStr);
    if (produktPositionIdsStr) params = params.set('produktPositionen', produktPositionIdsStr);
    if (personenStr) params = params.set('personen', personenStr);
    params = params.set('useVerrechnetDate', useVerrechnetDate);

    return this.http.get(`${this.baseUrl}${PathConst.AUSWERTUNGEN}`, { params, responseType: 'blob' });
  }

  historyAuswertung(id?: number, artStr: string = ''): Observable<Blob> {
    let params = new HttpParams().set('art', artStr);
    if (id !== undefined) params = params.set('id', String(id));
    return this.http.get(`${this.baseUrl}${PathConst.AUSWERTUNGEN_HISTORY}`, { params, responseType: 'blob' });
  }

  vertragspartnerAuswertung(vertragspartner: string, jahrStr?: string, monatStr?: string): Observable<Blob> {
    let params = new HttpParams().set('vertragspartner', vertragspartner);
    if (jahrStr) params = params.set('jahr', jahrStr);
    if (monatStr) params = params.set('monat', monatStr);
    return this.http.get(`${this.baseUrl}${PathConst.AUSWERTUNGEN_VERTRAGPARTNER}`, {params, responseType: 'blob'});
  }


  freigabegruppeAuswertung(freigabegruppeStr: string, jahrStr?: string, monatStr?: string): Observable<Blob> {
    let params = new HttpParams().set('freigabegruppe', freigabegruppeStr);
    if (jahrStr) params = params.set('jahr', jahrStr);
    if (monatStr) params = params.set('monat', monatStr);
    return this.http.get(`${this.baseUrl}${PathConst.AUSWERTUNGEN_FREIGABEGRUPPE}`, { params, responseType: 'blob' });
  }

  stempelzeitkorrekturListe(monatStr?: string, jahrStr?: string): Observable<Blob> {
    let params = new HttpParams();
    if (monatStr) params = params.set('monat', monatStr);
    if (jahrStr) params = params.set('jahr', jahrStr);
    return this.http.get(`${this.baseUrl}${PathConst.AUSWERTUNGEN_STEMPELZEITKORREKTUR}`, { params, responseType: 'blob' });
  }

  ueberfaelligeBuchungen(tageStr?: string): Observable<Blob> {
    let params = new HttpParams();
    if (tageStr) params = params.set('tage', tageStr);
    return this.http.get(`${this.baseUrl}${PathConst.AUSWERTUNGEN_UEBERFAELLIGEBUCHUNGEN}`, { params, responseType: 'blob' });
  }

  nachgetrageneRemotebuchungen(tageNachgetragenStr?: string, tageZeitraumStr?: string): Observable<Blob> {
    let params = new HttpParams();
    if (tageNachgetragenStr) params = params.set('tageNachgetragen', tageNachgetragenStr);
    if (tageZeitraumStr) params = params.set('tageZeitraum', tageZeitraumStr);
    return this.http.get(`${this.baseUrl}${PathConst.AUSWERTUNGEN_NACHGETRAGENEREMOTEBUCHUNGEN}`, { params, responseType: 'blob' });
  }

  abwesenheiten(personenStr?: string, art?: ApiAuswertungsart | string): Observable<Blob> {
    let params = new HttpParams();
    if (personenStr) params = params.set('personen', personenStr);
    if (art) params = params.set('art', typeof art === 'string' ? art : JSON.stringify(art));
    return this.http.get(`${this.baseUrl}${PathConst.AUSWERTUNGEN_ABWESENHEITEN}`, { params, responseType: 'blob' });
  }

  getJahresauswertung(jahrStr?: string): Observable<Blob> {
    let params = new HttpParams();
    if (jahrStr) params = params.set('jahr', jahrStr);
    return this.http.get(`${this.baseUrl}${PathConst.JAHRESAUSWERTUNG}`, { params, responseType: 'blob' });
  }

  getPersonenDetail(nurAktive: boolean = true): Observable<Blob> {
    const params = new HttpParams().set('nurAktiv', String(nurAktive));
    return this.http.get(`${this.baseUrl}${PathConst.PERSONEN_DETAILLISTE}`, { params, responseType: 'blob' });
  }

  getPersonenOrgleiter(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}${PathConst.PERSONEN_ORGLEITER}`, { responseType: 'blob' });
  }

  // PDF Methods
  getProduktAuswertung(produktId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}${PathConst.PRODUKTE}/${produktId}/${PathConst.AUSWERTUNG}`, { responseType: 'blob' });
  }

  getPersonAuswertung(personIdStr: string, jahrStr?: string, dvString?: string): Observable<Blob> {
    let params = new HttpParams();
    if (jahrStr) params = params.set('jahr', jahrStr);
    if (dvString) params = params.set('dv', dvString);
    return this.http.get(`${this.baseUrl}${PathConst.PERSONEN}/${personIdStr}/${PathConst.AUSWERTUNG}`, { params, responseType: 'blob' });
  }

  getPersonAusnuetzungAuswertung(personIdStr: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}${PathConst.PERSONEN}/${personIdStr}/${PathConst.AUSNUETZUNG}`, { responseType: 'blob' });
  }

  getVertragAusnuetzungAuswertung(vertragIdStr: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}${PathConst.VERTRAEGE}/${vertragIdStr}/${PathConst.AUSNUETZUNG}`, { responseType: 'blob' });
  }

  getVertragAusnuetzungAuswertungLpPunkte(vertragIdStr: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}${PathConst.VERTRAEGE}/${vertragIdStr}/${PathConst.AUSNUETZUNG}LpPunkte`, { responseType: 'blob' });
  }

  getProduktPositionKostenAuswertung(produktpositionId: string, jahrStr?: string): Observable<Blob> {
    let params = new HttpParams();
    if (jahrStr) params = params.set('jahr', jahrStr);
    return this.http.get(`${this.baseUrl}${PathConst.PRODUKT_POSITIONEN}/${produktpositionId}/${PathConst.KOSTEN}`, { params, responseType: 'blob' });
  }

  getZivildienerAnwesenheiten(personId: string, jahrStr?: string, monatStr?: string): Observable<Blob> {
    let params = new HttpParams();
    if (jahrStr) params = params.set('jahr', jahrStr);
    if (monatStr) params = params.set('monat', monatStr);
    return this.http.get(`${this.baseUrl}${PathConst.ZIVI_ANWESEND}/${personId}`, { params, responseType: 'blob' });
  }

}
