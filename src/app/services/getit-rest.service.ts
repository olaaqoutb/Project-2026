import {environment} from '../../environments/environment';

export const PathConst = {
  PERSONEN: 'personen',
  ORGANISATIONSEINHEITEN: 'organisationseinheiten',
  VERTRAEGE: 'vertraege',
  VERTRAG_POSITIONEN: 'vertragPositionen',
  VERTRAG_POSITION_VERBRAUCHER: 'vertragPositionVerbraucher',
  PRODUKTE: 'produkte',
  PRODUKT_POSITIONEN: 'produktPositionen',
  PRODUKT_POSITIONEN_BUCHUNGSPUNKTE: 'produktPositionBuchungspunkte',
  STUNDENPLANUNG: 'stundenplanung',
  TAETIGKEITSBUCHUNGEN: 'taetigkeitsbuchungen',
  STEMPELZEITEN: 'stempelzeiten',
  PERSONENVERMERKE: 'personenvermerke',
  FREIGABE_POSITIONEN: 'freigabePositionen',
  FREIGABE_GRUPPEN: 'freigabeGruppen',
  BEREITSCHAFT: 'bereitschaft',
  ZIVI_URLAUBKRANK: 'ziviUrlaubKrank',
  INFO: 'info',
  ME: 'me',
  ABSCHLUSS_TAG: 'abschluss/tag',
  ABSCHLUSS_MONAT: 'abschluss/monat',
  ABSCHLUSS_INFO: 'abschluss/info',
  TEAMZUORDNUNGEN: 'teamzuordnungen',
  LEISTUNGSKATEGORIEN: 'leistungskategorien',
  VERTRAGSPARTNER: 'vertragspartner',
  GESCHAEFZSZAHLEN: 'geschaeftszahlen',
  ROLLENBEZEICHNUNGEN: 'rollenbezeichnungen',
  FEIERTAGE: 'feiertage',
  INFOPDF_MUSSLESEN: 'infopdf/musslesen',
  INFOPDF_HATGELESEN: 'infopdf/hatgelesen',
  GEPLANT_GEBUCHT: 'geplantGebucht',
  PERSONENVERANTWORTLICHE: 'personenverantwortliche',
  DURCHFUEHRUNGSVERANTWORTLICHER: 'durchfuehrungsverantwortlicher',
  ID: 'id',
  PARENT_ID: 'parentId',
  DATUM: 'datum',
  RESET: 'reset',
  DISABLE: 'disable',
  RESET_AND_COPY: 'resetAndCopy',
  STEMPELN: 'stempeln',
  ANZAHL : '/anzahl',

  FREIGABE_POSITIONEN_ANZAHL: 'freigabePositionen/anzahl',
  FREIGABE_POSITIONEN_HISTORY: 'freigabePositionen/history',
  VERTRAEGE_VERTRAGSVERANTWORTLICHER : 'vertraege/vertragsverantwortlicher',
  PERSONEN_DURCHFUEHRUNGSVERANTWORTLICHER : 'personen/durchfuehrungsverantwortlicher',



  AUSWERTUNGEN: '/auswertungen',
  AUSWERTUNGEN_EV: '/auswertungen/ev',
  AUSWERTUNGEN_DV: '/auswertungen/dv',
  AUSWERTUNGEN_SM: '/auswertungen/sm',
  AUSWERTUNGEN_HISTORY: '/auswertungen/history',
  AUSWERTUNGEN_VERTRAGPARTNER: '/auswertungen/vertragspartner',
  AUSWERTUNGEN_FREIGABEGRUPPE: '/auswertungen/freigabegruppe',
  AUSWERTUNGEN_STEMPELZEITKORREKTUR: '/auswertungen/stempelzeitkorrektur',
  AUSWERTUNGEN_UEBERFAELLIGEBUCHUNGEN: '/auswertungen/ueberfaellige-buchungen',
  AUSWERTUNGEN_NACHGETRAGENEREMOTEBUCHUNGEN: '/auswertungen/nachgetragene-remote-buchungen',
  AUSWERTUNGEN_ABWESENHEITEN: '/auswertungen/abwesenheiten',
  PERSONEN_DETAILLISTE: '/personen/detailliste',
  PERSONEN_ORGLEITER: '/personen/orgleiter',
  ZIVI_ANWESEND: '/zivi-anwesend',
  JAHRESAUSWERTUNG: '/jahresauswertung',
  AUSWERTUNG: 'auswertung',
  AUSNUETZUNG: 'ausnuetzung',
  KOSTEN: 'kosten',
} as const;

//export const ANZAHL = "/anzahl";
//export const HISTORY = "/history";


//export const FREIGABE_POSITIONEN_ANZAHL = PathConst.FREIGABE_POSITIONEN + ANZAHL;
//export const FREIGABE_POSITIONEN_HISTORY = PathConst.FREIGABE_POSITIONEN + HISTORY;

export const QueryConst = {
  PERSONDETAILGRAD: 'persondetailgrad',
  BERECHNETE_STUNDEN: 'berechneteStunden',
  ADD_VERTRAEGE: 'addVertraege',
  NUR_NAMEN: 'nurNamen',
  FILTER: 'filter',
  TAETIGKEITEN_AB: 'taetigkeitenAb',
  TAETIGKEITEN_BIS: 'taetigkeitenBis',
  PLANUNGSJAHR: 'planungsjahr',
  LOGIN_AB: 'loginAb',
  LOGIN_BIS: 'loginBis',
  PERSON_ID: 'personId',
  ZEITTYP: 'zeitTyp',
  LOGOFF_AB: 'logoffAb',
  VERBRAUCHTE_STUNDEN: 'verbrauchteStunden',
  VORGANG: 'vorgang',
  VERBRAUCHER: 'verbraucher',
  AUFHEBEN: 'aufheben',
  PRODUKTPOSITION: 'produktPosition',
  ADD_GEBUCHT: 'addGebucht',
  NUR_AKTIV: 'nurAktiv',
  FUNKTION: 'funktion',
  AB: 'ab',
  BIS: 'bis',
  BUCHUNG_ID: 'buchungId',
  JAHR: 'jahr',
  STUNDENSATZ_NEU: 'stundensatzNeu'
} as const;

import { Injectable } from '@angular/core';
// Adjust path as needed
import { Observable, from } from 'rxjs'


import { ApiPerson } from '../models/ApiPerson';
import { ApiStempelzeit } from '../models/ApiStempelzeit';
import { ApiOrganisationseinheit } from '../models/ApiOrganisationseinheit';
import { ApiVertrag } from '../models/ApiVertrag';
import { ApiVertragPosition } from '../models/ApiVertragPosition';
import { ApiVertragPositionVerbraucher } from '../models/ApiVertragPositionVerbraucher';
import { ApiProdukt } from '../models/ApiProdukt';
import { ApiProduktPosition } from '../models/ApiProduktPosition';
import { ApiProduktPositionBuchungspunkt } from '../models/ApiProduktPositionBuchungspunkt';
import { ApiStundenplanung } from '../models/ApiStundenplanung';
import { ApiTaetigkeitsbuchung } from '../models/ApiTaetigkeitsbuchung';
import { ApiPersonAnwesenheit } from '../models/ApiPersonAnwesenheit';
import { ApiAbschlussInfo } from '../models/ApiAbschlussInfo';
import { ApiFeiertage } from '../models/ApiFeiertage';
import { ApiInfo } from '../models/ApiInfo';
import { ApiGeplantGebucht } from '../models/ApiGeplantGebucht';
import { ApiTeamzuordnungen } from '../models/ApiTeamzuordnungen';
import { ApiVertragspartnerListe } from '../models/ApiVertragspartnerListe';
import { ApiFreigabePosition } from '../models/ApiFreigabePosition';
import { ApiFreigabePositionAnzahl } from '../models/ApiFreigabePositionAnzahl';
import { ApiPersonenvermerk } from '../models/ApiPersonenvermerk';
import { ApiMussPdfLesen } from '../models/ApiMussPdfLesen';
import { ApiGeschaeftszahlenListe } from '../models/ApiGeschaeftszahlenListe';
import { ApiRollenbezeichnungsListe } from '../models/ApiRollenbezeichnungsListe';
import { ApiLeistungskategorien } from '../models/ApiLeistungskategorien';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../models/app-constants';
import { HttpError } from '../models/HttpError';

 @Injectable({
  providedIn: 'root'
})
export class GetitRestService {
   private baseUrl = environment.apiUrl;

  private baseUrl2: string = 'http://127.0.0.1:8888/getitgui/proxy/v1';
/*
  constructor(baseUrl: string) {
//    this.baseUrl = baseUrl;
  }

  */
  constructor(private http : HttpClient ) {
    //    this.baseUrl = baseUrl;
      }
  private  request__<T>(path: string, options: RequestInit = {}): Observable<T> {
    const url = `${this.baseUrl}/${path}`;
    const request = fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }).then(response => {
      if (!response.ok) {

        let errorBody: any;
        try {
          errorBody =   response.text() ;
        } catch {
          errorBody =   response.text();
        }

        throw new HttpError(response.status, response.statusText, errorBody, url);

       // throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    });

    return from(request);
  }


  private request<T>(path: string, options: RequestInit = {}): Observable<T> {
    const url = `${this.baseUrl}/${path}`;

    // Only add Content-Type when there's a body (avoids polluting GET/DELETE)
    const headers = new Headers(options.headers || {});
    if (options.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const fetchOptions: RequestInit = {
      ...options,
      headers
    };

    const promise = fetch(url, fetchOptions).then(response => {
      if (response.ok) {
        // Handle 204 No Content
        return response.status === 204 ? (null as T) : response.json();
      }

      //  Read body ONCE as text (body stream can only be consumed once!)
      return response.text().then(text => {
        let errorBody: any;

        // Try to parse as JSON, fall back to raw text if invalid
        try {
          errorBody = text.trim() ? JSON.parse(text) : null;
        } catch {
          errorBody = text; // Keep raw text (e.g., "Durch diese Aktion...")
        }

        // Throw custom error with full details
        throw new HttpError(response.status, response.statusText, errorBody, url);
      });
    }).catch(error => {
      // Handle network errors (no response received)
      if (error instanceof HttpError) {
        throw error; // Re-throw our custom errors
      }
      // Network error (DNS failure, no internet, etc.)
      throw new HttpError(0, error.message, null, url);
    });

    return from(promise);
  }

  // Person methods
  createPerson(person: ApiPerson): Observable<ApiPerson> {
    return this.request<ApiPerson>(PathConst.PERSONEN, {
      method: 'POST',
      body: JSON.stringify(person)
    });
  }

  updatePerson(person: ApiPerson, id: string): Observable<ApiPerson> {
    return this.request<ApiPerson>(`${PathConst.PERSONEN}/${id}`, {
      method: 'POST',
      body: JSON.stringify(person)
    });
  }

  resetPerson(id: string): Observable<ApiPerson> {
    return this.request<ApiPerson>(`${PathConst.PERSONEN}/${id}/${PathConst.RESET}`, {
      method: 'POST'
    });
  }

  disablePortalPerson(id: string): Observable<ApiPerson> {
    return this.request<ApiPerson>(`${PathConst.PERSONEN}/${id}/${PathConst.DISABLE}`, {
      method: 'POST'
    });
  }

  getPerson(id: string, persondetail?: string, berechneteStunden: boolean = false, addVertraege?: boolean): Observable<ApiPerson> {
    const params = new URLSearchParams();
    if (persondetail) params.append(QueryConst.PERSONDETAILGRAD, persondetail);
    params.append(QueryConst.BERECHNETE_STUNDEN, berechneteStunden.toString());
    if (addVertraege !== undefined) params.append(QueryConst.ADD_VERTRAEGE, addVertraege.toString());

    const queryString = params.toString();
    const path = queryString ? `${PathConst.PERSONEN}/${id}?${queryString}` : `${PathConst.PERSONEN}/${id}`;

    console.log('Path', path);
    return this.request<ApiPerson>(path);
  }

  getPersonWithBerechneteStunden(id: string, berechneteStunden: boolean = false, addVertraege?: boolean): Observable<ApiPerson> {
    const params = new URLSearchParams();
    params.append(QueryConst.BERECHNETE_STUNDEN, berechneteStunden.toString());
    if (addVertraege !== undefined) params.append(QueryConst.ADD_VERTRAEGE, addVertraege.toString());

    const queryString = params.toString();
    const path = queryString ? `${PathConst.PERSONEN}/${id}?${queryString}` : `${PathConst.PERSONEN}/${id}`;

    return this.request<ApiPerson>(path);
  }

  getPersonen(berechneteStunden: boolean = false, nurNamen: boolean = false): Observable<ApiPerson[]> {
    const params = new URLSearchParams();
    params.append(QueryConst.BERECHNETE_STUNDEN, berechneteStunden.toString());
    params.append(QueryConst.NUR_NAMEN, nurNamen.toString());

    const queryString = params.toString();
    const path = queryString ? `${PathConst.PERSONEN}?${queryString}` : PathConst.PERSONEN;

    return this.request<ApiPerson[]>(path);
  }

  getAnwesenheit(): Observable<ApiPersonAnwesenheit[]> {
    return this.request<ApiPersonAnwesenheit[]>(`${PathConst.PERSONEN}:anwesend`);
  }

  getPersonProdukte(
    personId: string,
    filter?: string,
    taetigkeitenAb?: string,
    taetigkeitenBis?: string,
    planungsjahr?: string
  ): Observable<ApiProdukt[]> {
    const params = new URLSearchParams();
    if (filter) params.append(QueryConst.FILTER, filter);
    if (taetigkeitenAb) params.append(QueryConst.TAETIGKEITEN_AB, taetigkeitenAb);
    if (taetigkeitenBis) params.append(QueryConst.TAETIGKEITEN_BIS, taetigkeitenBis);
    if (planungsjahr) params.append(QueryConst.PLANUNGSJAHR, planungsjahr);

    const queryString = params.toString();
    const path = queryString
      ? `${PathConst.PERSONEN}/${personId}/${PathConst.PRODUKTE}?${queryString}`
      : `${PathConst.PERSONEN}/${personId}/${PathConst.PRODUKTE}`;

    return this.request<ApiProdukt[]>(path);
  }

  getPersonStempelzeiten(
    personId: string,
    loginAb?: string,
    loginBis?: string
  ): Observable<ApiStempelzeit[]> {
    const params = new URLSearchParams();
    if (loginAb) params.append(QueryConst.LOGIN_AB, loginAb);
    if (loginBis) params.append(QueryConst.LOGIN_BIS, loginBis);

    const queryString = params.toString();
    const path = queryString
      ? `${PathConst.PERSONEN}/${personId}/${PathConst.STEMPELZEITEN}?${queryString}`
      : `${PathConst.PERSONEN}/${personId}/${PathConst.STEMPELZEITEN}`;

    return this.request<ApiStempelzeit[]>(path);
  }


  getPersonStempelzeitenNoAbwesenheit(
    personId: string,
    loginAb?: string,
    loginBis?: string
  ): Observable<ApiStempelzeit[]> {
    const params = new URLSearchParams();
    if (loginAb) params.append(QueryConst.LOGIN_AB, loginAb);
    if (loginBis) params.append(QueryConst.LOGIN_BIS, loginBis);

    const queryString = params.toString();
    const path = AppConstants.BASE_URL + '/' + queryString
      ? `${PathConst.PERSONEN}/${personId}/${PathConst.STEMPELZEITEN}?${queryString}`
      : `${PathConst.PERSONEN}/${personId}/${PathConst.STEMPELZEITEN}`;


      console.log('PATH', path);
    return this.request<ApiStempelzeit[]>(path);
  }



  getPersonMeStempelzeiten(loginAb?: string): Observable<ApiStempelzeit[]> {
    const params = new URLSearchParams();
    if (loginAb) params.append(QueryConst.LOGIN_AB, loginAb);

    const queryString = params.toString();
    const path = queryString
      ? `${PathConst.PERSONEN}/${PathConst.ME}/${PathConst.STEMPELZEITEN}?${queryString}`
      : `${PathConst.PERSONEN}/${PathConst.ME}/${PathConst.STEMPELZEITEN}`;

      console.log('path', path);

    return this.request<ApiStempelzeit[]>(path);
  }





  createStempelzeit(dto: ApiStempelzeit, personId: string, vorgang?: string): Observable<ApiStempelzeit> {
    const params = new URLSearchParams();
    if (vorgang) params.append(QueryConst.VORGANG, vorgang);

    const queryString = params.toString();
    const path = queryString
      ? `${PathConst.PERSONEN}/${personId}/${PathConst.STEMPELZEITEN}?${queryString}`
      : `${PathConst.PERSONEN}/${personId}/${PathConst.STEMPELZEITEN}`;

    return this.request<ApiStempelzeit>(path, {
      method: 'POST',
      body: JSON.stringify(dto)
    });
  }

  updateStempelzeit(dto: ApiStempelzeit, id: string, vorgang?: string): Observable<ApiStempelzeit> {
    const params = new URLSearchParams();
    if (vorgang) params.append(QueryConst.VORGANG, vorgang);

    const queryString = params.toString();
    const path = queryString
      ? `${PathConst.STEMPELZEITEN}/${id}?${queryString}`
      : `${PathConst.STEMPELZEITEN}/${id}`;

      console.log('path', path);
      console.log('params', params);

    return this.request<ApiStempelzeit>(path, {
      method: 'POST',
      body: JSON.stringify(dto)
    });
  }

  getStempelzeit(
    personIdStr?: string,
    zeitTypStr?: string,
    loginAb?: string
  ): Observable<ApiStempelzeit[]> {
    const params = new URLSearchParams();
    if (personIdStr) params.append(QueryConst.PERSON_ID, personIdStr);
    if (zeitTypStr) params.append(QueryConst.ZEITTYP, zeitTypStr);
    if (loginAb) params.append(QueryConst.LOGIN_AB, loginAb);

    const queryString = params.toString();
    const path = queryString
      ? `${PathConst.STEMPELZEITEN}?${queryString}`
      : PathConst.STEMPELZEITEN;

    return this.request<ApiStempelzeit[]>(path);
  }

  getAbwesenheiten(
    personIdStr?: string,
    zeitTypStr?: string,
    logoffAb?: string
  ): Observable<ApiStempelzeit[]> {
    const params = new URLSearchParams();
    if (personIdStr) params.append(QueryConst.PERSON_ID, personIdStr);
    if (zeitTypStr) params.append(QueryConst.ZEITTYP, zeitTypStr);
    if (logoffAb) params.append(QueryConst.LOGOFF_AB, logoffAb);

    const queryString = params.toString();
    const path = queryString
      ? `${PathConst.STEMPELZEITEN}?${queryString}`
      : PathConst.STEMPELZEITEN;

    return this.request<ApiStempelzeit[]>(path);
  }

  // Organisationseinheit methods
  createOrganisationseinheit(organisationseinheit: ApiOrganisationseinheit): Observable<ApiOrganisationseinheit> {
    return this.request<ApiOrganisationseinheit>(PathConst.ORGANISATIONSEINHEITEN, {
      method: 'POST',
      body: JSON.stringify(organisationseinheit)
    });
  }

  updateOrganisationseinheit(organisationseinheit: ApiOrganisationseinheit, id: string): Observable<ApiOrganisationseinheit> {
    return this.request<ApiOrganisationseinheit>(`${PathConst.ORGANISATIONSEINHEITEN}/${id}`, {
      method: 'POST',
      body: JSON.stringify(organisationseinheit)
    });
  }

  getOrganisationsEinheiten(): Observable<ApiOrganisationseinheit[]> {
    return this.request<ApiOrganisationseinheit[]>(PathConst.ORGANISATIONSEINHEITEN);
  }

  // Vertrag methods
  getVertraege(berechneteStunden: boolean = false, verbraucheStunden: boolean = false): Observable<ApiVertrag[]> {
    const params = new URLSearchParams();
    params.append(QueryConst.BERECHNETE_STUNDEN, berechneteStunden.toString());
    params.append(QueryConst.VERBRAUCHTE_STUNDEN, verbraucheStunden.toString());

    const queryString = params.toString();
    const path = queryString ? `${PathConst.VERTRAEGE}?${queryString}` : PathConst.VERTRAEGE;

    return this.request<ApiVertrag[]>(path);
  }

  getVertrag(id: string, berechneteStunden: boolean = false): Observable<ApiVertrag> {
    const params = new URLSearchParams();
    params.append(QueryConst.BERECHNETE_STUNDEN, berechneteStunden.toString());

    const queryString = params.toString();
    const path = queryString ? `${PathConst.VERTRAEGE}/${id}?${queryString}` : `${PathConst.VERTRAEGE}/${id}`;

    return this.request<ApiVertrag>(path);
  }

  createVertrag(vertrag: ApiVertrag): Observable<ApiVertrag> {
    return this.request<ApiVertrag>(PathConst.VERTRAEGE, {
      method: 'POST',
      body: JSON.stringify(vertrag)
    });
  }

  updateVertrag(vertrag: ApiVertrag, id: string): Observable<ApiVertrag> {
    return this.request<ApiVertrag>(`${PathConst.VERTRAEGE}/${id}`, {
      method: 'POST',
      body: JSON.stringify(vertrag)
    });
  }

  // Vertrag Position methods
  createVertragPosition(position: ApiVertragPosition, vertragId: string): Observable<ApiVertragPosition> {
    return this.request<ApiVertragPosition>(`${PathConst.VERTRAEGE}/${vertragId}/${PathConst.VERTRAG_POSITIONEN}`, {
      method: 'POST',
      body: JSON.stringify(position)
    });
  }

  updateVertragPosition(position: ApiVertragPosition, id: string): Observable<ApiVertragPosition> {
    return this.request<ApiVertragPosition>(`${PathConst.VERTRAG_POSITIONEN}/${id}`, {
      method: 'POST',
      body: JSON.stringify(position)
    });
  }

  resetVertragPosition(id: string): Observable<ApiVertragPosition> {
    return this.request<ApiVertragPosition>(`${PathConst.VERTRAG_POSITIONEN}/${id}/${PathConst.RESET}`, {
      method: 'POST'
    });
  }

  createVertragPositionVerbraucher(position: ApiVertragPositionVerbraucher, vertragPositionId: string): Observable<ApiVertragPositionVerbraucher> {
    return this.request<ApiVertragPositionVerbraucher>(`${PathConst.VERTRAG_POSITIONEN}/${vertragPositionId}/${PathConst.VERTRAG_POSITION_VERBRAUCHER}`, {
      method: 'POST',
      body: JSON.stringify(position)
    });
  }

  updateVertragPositionVerbraucher(position: ApiVertragPositionVerbraucher, id: string): Observable<ApiVertragPositionVerbraucher> {
    return this.request<ApiVertragPositionVerbraucher>(`${PathConst.VERTRAG_POSITION_VERBRAUCHER}/${id}`, {
      method: 'POST',
      body: JSON.stringify(position)
    });
  }

  resetAndCopyVertragPositionVerbraucher(position: ApiVertragPositionVerbraucher, id: string, stundensatzNeu?: string): Observable<ApiVertragPositionVerbraucher> {
    const params = new URLSearchParams();
    if (stundensatzNeu) params.append(QueryConst.STUNDENSATZ_NEU, stundensatzNeu);

    const queryString = params.toString();
    const path = queryString
      ? `${PathConst.VERTRAG_POSITION_VERBRAUCHER}/${id}/${PathConst.RESET_AND_COPY}?${queryString}`
      : `${PathConst.VERTRAG_POSITION_VERBRAUCHER}/${id}/${PathConst.RESET_AND_COPY}`;

    return this.request<ApiVertragPositionVerbraucher>(path, {
      method: 'POST',
      body: JSON.stringify(position)
    });
  }

  // Produkt methods
  getProdukte(filter?: string): Observable<ApiProdukt[]> {
    const params = new URLSearchParams();
    if (filter) params.append(QueryConst.FILTER, filter);

    const queryString = params.toString();
    const path = queryString ? `${PathConst.PRODUKTE}?${queryString}` : PathConst.PRODUKTE;

    return this.request<ApiProdukt[]>(path);
  }

  getProdukt(id: string, filter?: string): Observable<ApiProdukt> {
    const params = new URLSearchParams();
    if (filter) params.append(QueryConst.FILTER, filter);

    const queryString = params.toString();
    const path = queryString ? `${PathConst.PRODUKTE}/${id}?${queryString}` : `${PathConst.PRODUKTE}/${id}`;

    return this.request<ApiProdukt>(path);
  }

  createProdukt(produkt: ApiProdukt): Observable<ApiProdukt> {
    return this.request<ApiProdukt>(PathConst.PRODUKTE, {
      method: 'POST',
      body: JSON.stringify(produkt)
    });
  }

  updateProdukt(produkt: ApiProdukt, id: string): Observable<ApiProdukt> {
    return this.request<ApiProdukt>(`${PathConst.PRODUKTE}/${id}`, {
      method: 'POST',
      body: JSON.stringify(produkt)
    });
  }

  // Additional methods would follow the same pattern...

  getStundenplanungByVerbraucher(id: string): Observable<ApiStundenplanung[]> {
    return this.request<ApiStundenplanung[]>(`${PathConst.VERTRAG_POSITION_VERBRAUCHER}/${id}`);
  }

  getStundenplanung(id: string): Observable<ApiStundenplanung> {
    return this.request<ApiStundenplanung>(`${PathConst.STUNDENPLANUNG}/${id}`);
  }

  createStundenplanung(object: ApiStundenplanung, produktPositionId: string, verbraucherId?: string): Observable<ApiStundenplanung> {
    const params = new URLSearchParams();
    if (verbraucherId) params.append(QueryConst.VERBRAUCHER, verbraucherId);

    const queryString = params.toString();
    const path = queryString
      ? `${PathConst.PRODUKT_POSITIONEN}/${produktPositionId}/${PathConst.STUNDENPLANUNG}?${queryString}`
      : `${PathConst.PRODUKT_POSITIONEN}/${produktPositionId}/${PathConst.STUNDENPLANUNG}`;

    return this.request<ApiStundenplanung>(path, {
      method: 'POST',
      body: JSON.stringify(object)
    });
  }

  updateStundenplanung(object: ApiStundenplanung, id: string): Observable<ApiStundenplanung> {
    return this.request<ApiStundenplanung>(`${PathConst.STUNDENPLANUNG}/${id}`, {
      method: 'POST',
      body: JSON.stringify(object)
    });
  }

  createTaetigkeitsbuchung(dto: ApiTaetigkeitsbuchung, produktPositionBuchungspunktId: string, personId?: string, vorgang?: string): Observable<ApiTaetigkeitsbuchung> {
    const params = new URLSearchParams();
    if (personId) params.append(QueryConst.PERSON_ID, personId);
    if (vorgang) params.append(QueryConst.VORGANG, vorgang);

    const queryString = params.toString();
    const path = queryString
      ? `${PathConst.PRODUKT_POSITIONEN_BUCHUNGSPUNKTE}/${produktPositionBuchungspunktId}/${PathConst.TAETIGKEITSBUCHUNGEN}?${queryString}`
      : `${PathConst.PRODUKT_POSITIONEN_BUCHUNGSPUNKTE}/${produktPositionBuchungspunktId}/${PathConst.TAETIGKEITSBUCHUNGEN}`;

    return this.request<ApiTaetigkeitsbuchung>(path, {
      method: 'POST',
      body: JSON.stringify(dto)
    });
  }

  updateTaetigkeitsbuchung(dto: ApiTaetigkeitsbuchung, id: string, vorgang?: string): Observable<ApiTaetigkeitsbuchung> {
    const params = new URLSearchParams();
    if (vorgang) params.append(QueryConst.VORGANG, vorgang);

    const queryString = params.toString();
    const path = queryString
      ? `${PathConst.TAETIGKEITSBUCHUNGEN}/${id}?${queryString}`
      : `${PathConst.TAETIGKEITSBUCHUNGEN}/${id}`;

    return this.request<ApiTaetigkeitsbuchung>(path, {
      method: 'POST',
      body: JSON.stringify(dto)
    });
  }

  abschlussTag(datum: string, aufheben: boolean = false): Observable<void> {
    const params = new URLSearchParams();
    params.append(QueryConst.AUFHEBEN, aufheben.toString());

    const queryString = params.toString();
    const path = queryString
      ? `${PathConst.ABSCHLUSS_TAG}/${datum}?${queryString}`
      : `${PathConst.ABSCHLUSS_TAG}/${datum}`;

    return this.request<void>(path, {
      method: 'POST'
    });
  }

  abschlussMonat(datum: string): Observable<void> {
    return this.request<void>(`${PathConst.ABSCHLUSS_MONAT}/${datum}`, {
      method: 'POST'
    });
  }

  abschlussInfo(personIdStr: string): Observable<ApiAbschlussInfo> {
    return this.request<ApiAbschlussInfo>(`${PathConst.PERSONEN}/${personIdStr}/${PathConst.ABSCHLUSS_INFO}`);
  }

  createBereitschaft(dto: ApiStempelzeit, personIdStr: string): Observable<ApiStempelzeit[]> {
    console.log('DTO', dto);
    return this.request<ApiStempelzeit[]>(`${PathConst.PERSONEN}/${personIdStr}/${PathConst.BEREITSCHAFT}`, {
      method: 'POST',
      body: JSON.stringify(dto)
    });
  }

  deleteBereitschaft(id: string): Observable<void> {
    return this.request<void>(`${PathConst.BEREITSCHAFT}/${id}`, {
      method: 'DELETE'
    });
  }

  feiertage(): Observable<ApiFeiertage> {
    return this.request<ApiFeiertage>(PathConst.FEIERTAGE);
  }

  createZivildienerUrlaubKrank(dto: ApiStempelzeit, personIdStr: string): Observable<ApiStempelzeit[]> {
    return this.request<ApiStempelzeit[]>(`${PathConst.PERSONEN}/${personIdStr}/${PathConst.ZIVI_URLAUBKRANK}`, {
      method: 'POST',
      body: JSON.stringify(dto)
    });
  }

  getInfo(): Observable<ApiInfo> {
    return this.request<ApiInfo>(PathConst.INFO);
  }

  getPersonPersonenverantwortlicher(personalverantwortlicherid: string, personenDetailStr?: string): Observable<ApiPerson[]> {
    const params = new URLSearchParams();
    if (personenDetailStr) params.append(QueryConst.PERSONDETAILGRAD, personenDetailStr);

    const queryString = params.toString();
    const path = queryString
      ? `${PathConst.PERSONEN}/${personalverantwortlicherid}/${PathConst.PERSONENVERANTWORTLICHE}?${queryString}`
      : `${PathConst.PERSONEN}/${personalverantwortlicherid}/${PathConst.PERSONENVERANTWORTLICHE}`;

    return this.request<ApiPerson[]>(path);
  }

  getPersonGeplantGebucht(personIdStr: string, positionIdStr?: string, planungsjahrStr?: string): Observable<ApiGeplantGebucht> {
    const params = new URLSearchParams();
    if (positionIdStr) params.append(QueryConst.PRODUKTPOSITION, positionIdStr);
    if (planungsjahrStr) params.append(QueryConst.PLANUNGSJAHR, planungsjahrStr);

    const queryString = params.toString();
    const path = queryString
      ? `${PathConst.PERSONEN}/${personIdStr}/${PathConst.GEPLANT_GEBUCHT}?${queryString}`
      : `${PathConst.PERSONEN}/${personIdStr}/${PathConst.GEPLANT_GEBUCHT}`;

    return this.request<ApiGeplantGebucht>(path);
  }

  getPersonGeplant(personIdStr: string, planungsjahrStr?: string, addGebucht?: boolean, nurAktiv?: boolean): Observable<ApiGeplantGebucht> {
    const params = new URLSearchParams();
    if (planungsjahrStr) params.append(QueryConst.PLANUNGSJAHR, planungsjahrStr);
    if (addGebucht !== undefined) params.append(QueryConst.ADD_GEBUCHT, addGebucht.toString());
    if (nurAktiv !== undefined) params.append(QueryConst.NUR_AKTIV, nurAktiv.toString());

    const queryString = params.toString();
    const path = queryString
      ? `${PathConst.PERSONEN}/${personIdStr}/${PathConst.GEPLANT_GEBUCHT}?${queryString}`
      : `${PathConst.PERSONEN}/${personIdStr}/${PathConst.GEPLANT_GEBUCHT}`;

    return this.request<ApiGeplantGebucht>(path);
  }

  getAlleAktuellenTeamzuordnungen(): Observable<ApiTeamzuordnungen> {
    return this.request<ApiTeamzuordnungen>(PathConst.TEAMZUORDNUNGEN);
  }

  getAlleAktuellenVertragsparter(): Observable<ApiVertragspartnerListe> {
    return this.request<ApiVertragspartnerListe>(PathConst.VERTRAGSPARTNER);
  }

  getFreigabePositionen(funktion?: string): Observable<ApiFreigabePosition[]> {
    const params = new URLSearchParams();
    if (funktion) params.append(QueryConst.FUNKTION, funktion);

    const queryString = params.toString();
    const path = queryString ? `${PathConst.FREIGABE_POSITIONEN}?${queryString}` : PathConst.FREIGABE_POSITIONEN;

    return this.request<ApiFreigabePosition[]>(path);
  }

  getFreigabePositionenHistory(ab?: string, bis?: string): Observable<ApiFreigabePosition[]> {
    const params = new URLSearchParams();
    if (ab) params.append(QueryConst.AB, ab);
    if (bis) params.append(QueryConst.BIS, bis);

    const queryString = params.toString();
    const path = queryString ? `${PathConst.FREIGABE_POSITIONEN_HISTORY}?${queryString}` : PathConst.FREIGABE_POSITIONEN_HISTORY;

    return this.request<ApiFreigabePosition[]>(path);
  }

  getFreigabePositionTaetigkeitsbuchungen(id: string): Observable<ApiTaetigkeitsbuchung[]> {
    return this.request<ApiTaetigkeitsbuchung[]>(`${PathConst.FREIGABE_POSITIONEN}/${id}/${PathConst.TAETIGKEITSBUCHUNGEN}`);
  }

  updateFreigabePositionen(dto: ApiFreigabePosition[], buchungsIds?: string[]): Observable<ApiFreigabePosition[]> {
    const params = new URLSearchParams();
    if (buchungsIds) {
      buchungsIds.forEach(id => params.append(`${QueryConst.BUCHUNG_ID}`, id));
    }

    const queryString = params.toString();
    const path = queryString ? `${PathConst.FREIGABE_POSITIONEN}?${queryString}` : PathConst.FREIGABE_POSITIONEN;

    return this.request<ApiFreigabePosition[]>(path, {
      method: 'POST',
      body: JSON.stringify(dto)
    });
  }

  getFreigabePositionenAnzahl(): Observable<ApiFreigabePositionAnzahl> {
    return this.request<ApiFreigabePositionAnzahl>(PathConst.FREIGABE_POSITIONEN_ANZAHL);
  }

  getFreigabeGruppen(): Observable<ApiProduktPosition[]> {
    return this.request<ApiProduktPosition[]>(PathConst.FREIGABE_GRUPPEN);
  }

  getPersonVermerke(personIdStr: string, ab?: string, bis?: string): Observable<ApiPersonenvermerk[]> {
    const params = new URLSearchParams();
    if (ab) params.append(QueryConst.AB, ab);
    if (bis) params.append(QueryConst.BIS, bis);

    const queryString = params.toString();
    const path = queryString
      ? `${PathConst.PERSONEN}/${personIdStr}/${PathConst.PERSONENVERMERKE}?${queryString}`
      : `${PathConst.PERSONEN}/${personIdStr}/${PathConst.PERSONENVERMERKE}`;

    return this.request<ApiPersonenvermerk[]>(path);
  }

  createPersonVermerk(dto: ApiPersonenvermerk, personIdStr: string): Observable<ApiPersonenvermerk> {
    return this.request<ApiPersonenvermerk>(`${PathConst.PERSONEN}/${personIdStr}/${PathConst.PERSONENVERMERKE}`, {
      method: 'POST',
      body: JSON.stringify(dto)
    });
  }

  updatePersonVermerk(dto: ApiPersonenvermerk, id: string): Observable<ApiPersonenvermerk> {
    return this.request<ApiPersonenvermerk>(`${PathConst.PERSONENVERMERKE}/${id}`, {
      method: 'POST',
      body: JSON.stringify(dto)
    });
  }

  deletePersonVermerk(id: string): Observable<void> {
    return this.request<void>(`${PathConst.PERSONENVERMERKE}/${id}`, {
      method: 'DELETE'
    });
  }

  getPersonDurchfuehrungsverantwortlicher(jahrStr?: string): Observable<ApiPerson[]> {
    const params = new URLSearchParams();
    if (jahrStr) params.append(QueryConst.JAHR, jahrStr);

    const queryString = params.toString();
    const path = queryString
      ? `${PathConst.PERSONEN_DURCHFUEHRUNGSVERANTWORTLICHER}?${queryString}`
      : PathConst.PERSONEN_DURCHFUEHRUNGSVERANTWORTLICHER;

    return this.request<ApiPerson[]>(path);
  }

  getVertraegeVerantwortlicher(): Observable<ApiVertrag[]> {
    return this.request<ApiVertrag[]>(PathConst.VERTRAEGE_VERTRAGSVERANTWORTLICHER);
  }

  mussInfoPdfLesen(): Observable<ApiMussPdfLesen> {
    return this.request<ApiMussPdfLesen>(PathConst.INFOPDF_MUSSLESEN);
  }

  hatInfoPdfGelesen(): Observable<void> {
    return this.request<void>(PathConst.INFOPDF_HATGELESEN, {
      method: 'POST'
    });
  }

  sendStempelzeitCalendar(id: string): Observable<void> {
    return this.request<void>(`${PathConst.STEMPELZEITEN}/sendCalendar/${id}`, {
      method: 'POST'
    });
  }

  getAlleAktuellenGeschaeftszahlen(): Observable<ApiGeschaeftszahlenListe> {
    return this.request<ApiGeschaeftszahlenListe>(PathConst.GESCHAEFZSZAHLEN);
  }

  getAlleAktuellenRollenbezeichnungen(): Observable<ApiRollenbezeichnungsListe> {
    return this.request<ApiRollenbezeichnungsListe>(PathConst.ROLLENBEZEICHNUNGEN);
  }

  getAlleAktuellenLeistungskategorien(): Observable<ApiLeistungskategorien> {
    return this.request<ApiLeistungskategorien>(PathConst.LEISTUNGSKATEGORIEN);
  }
}
