import { Injectable } from '@angular/core';
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
  ANZAHL: '/anzahl',

  FREIGABE_POSITIONEN_ANZAHL: 'freigabePositionen/anzahl',
  FREIGABE_POSITIONEN_HISTORY: 'freigabePositionen/history',
  VERTRAEGE_VERTRAGSVERANTWORTLICHER: 'vertraege/vertragsverantwortlicher',
  PERSONEN_DURCHFUEHRUNGSVERANTWORTLICHER: 'personen/durchfuehrungsverantwortlicher',


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
  PERSONDETAILGRAD: 'persondetail',
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

import { Inject } from '@angular/core';
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
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import { ApiTrigger } from '../models/ApiTrigger';
import { ApiLkDetails } from '../models/ApiLkDetails';
import { ApiTaetigkeiten } from '../models/ApiTaetigkeiten';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GetitRest2Service {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient,
   // @Inject('BASE_URL') private baseUrl: string
  ) { }
// ========================================
// PERSON ENDPOINTS
// ========================================

createPerson(person: ApiPerson): Observable<ApiPerson> {
  return this.http.post<ApiPerson>(`personen`, person);
}

updatePerson(id: string, person: ApiPerson): Observable<ApiPerson> {
  return this.http.post<ApiPerson>(`personen/${id}`, person);
}

resetPerson(parentId: string): Observable<ApiPerson> {
  return this.http.post<ApiPerson>(`personen/${parentId}/reset`, null);
}

disablePortalPerson(id: string): Observable<ApiPerson> {
  return this.http.post<ApiPerson>(`personen/${id}/disable`, null);
}

getPerson(
  id: string,
  persondetail?: string,
  berechneteStunden?: boolean,
  addVertraege?: boolean
): Observable<ApiPerson> {

  let params = new HttpParams();
  if (persondetail) params = params.set('persondetailgrad', persondetail);
  if (berechneteStunden !== undefined) params = params.set('berechneteStunden', berechneteStunden.toString());
  if (addVertraege !== undefined) params = params.set('addVertraege', addVertraege.toString());

  console.log('+++++ getPerson()', this.baseUrl);

  return this.http.get<ApiPerson>(`personen/${id}`, { params });

  //return this.http.get<ApiPerson>(`personen/${id}`, { params });
}

/*
getPersonen1(
  berechneteStunden?: boolean,
  nurNamen?: boolean
): Observable<ApiPerson[]> {
  let params = new HttpParams();
  if (berechneteStunden !== undefined) params = params.set('berechneteStunden', berechneteStunden.toString());
  if (nurNamen !== undefined) params = params.set('nurNamen', nurNamen.toString());
  return this.http.get<ApiPerson[]>(`personen`, { params });
}

*/
getPersonen(
  berechneteStunden?: string,
  nurNamen?: string,
  funktion?: string
): Observable<ApiPerson[]> {
  let params = new HttpParams();
  if (berechneteStunden) params = params.set('berechneteStunden', berechneteStunden);
  if (nurNamen) params = params.set('nurNamen', nurNamen);
  if (funktion) params = params.set('funktion', funktion);
  return this.http.get<ApiPerson[]>(`personen`, { params });
}

  getPersonen1(
    berechneteStunden?: string,
    nurNamen?: string,
    funktion?: string
  ): Observable<HttpResponse<ApiPerson[]>> {
    let params = new HttpParams();
    if (berechneteStunden) params = params.set('berechneteStunden', berechneteStunden);
    if (nurNamen) params = params.set('nurNamen', nurNamen);
    if (funktion) params = params.set('funktion', funktion);


    return this.http.get<ApiPerson[]>(
      `personen`,
      {
        params,
        observe: 'response',
        responseType: 'json'
      }
    );

    //return this.http.get<ApiPerson[]>(`personen`, { params });
  }




  getPersonsAnwesend(): Observable<ApiPersonAnwesenheit[]> {
  return this.http.get<ApiPersonAnwesenheit[]>(`personen:anwesend`);
}

getPersonProdukte(
  parentId: string,
  filter: string,
  taetigkeitenAb?: string,
  taetigkeitenBis?: string,
  planungsjahr?: string
): Observable<ApiProdukt[]> {
  let params = new HttpParams().set('filter', filter);
  if (taetigkeitenAb) params = params.set('taetigkeitenAb', taetigkeitenAb);
  if (taetigkeitenBis) params = params.set('taetigkeitenBis', taetigkeitenBis);
  if (planungsjahr) params = params.set('planungsjahr', planungsjahr);
  return this.http.get<ApiProdukt[]>(`personen/${parentId}/produkte`, { params });
}

getPersonStempelzeiten(
  parentId: string,
  loginAb?: string,
  loginBis?: string
): Observable<ApiStempelzeit[]> {
  let params = new HttpParams();
  if (loginAb) params = params.set('loginAb', loginAb);
  if (loginBis) params = params.set('loginBis', loginBis);
  return this.http.get<ApiStempelzeit[]>(`personen/${parentId}/stempelzeiten`, { params });
}

getPersonStempelzeitenNoAbwesenheit(
  parentId: string,
  loginAb?: string,
  loginBis?: string
): Observable<ApiStempelzeit[]> {
  let params = new HttpParams();
  if (loginAb) params = params.set('loginAb', loginAb);
  if (loginBis) params = params.set('loginBis', loginBis);
  return this.http.get<ApiStempelzeit[]>(`personen/${parentId}/stempelzeiten`, { params });
}

getPersonMeStempelzeiten(loginAb?: string): Observable<ApiStempelzeit[]> {
  let params = new HttpParams();
  if (loginAb) params = params.set('loginAb', loginAb);
  return this.http.get<ApiStempelzeit[]>(`personen/me/stempelzeiten`, { params });
}

getPersonAbwesenheiten(id: string): Observable<ApiStempelzeit[]> {
  return this.http.get<ApiStempelzeit[]>(`personen/${id}/abwesenheiten`);
}

getPersonTeamleiter(parentId: string): Observable<ApiPerson[]> {
  return this.http.get<ApiPerson[]>(`personen/${parentId}/teamleiter`);
}

// ========================================
// STEMPELZEIT ENDPOINTS
// ========================================

createStempelzeit(
  dto: ApiStempelzeit,
  parentId: string,
  vorgang?: string
): Observable<ApiStempelzeit> {
  let params = new HttpParams();
  if (vorgang) params = params.set('vorgang', vorgang);
  return this.http.post<ApiStempelzeit>(`personen/${parentId}/stempelzeiten`, dto, { params });
}

  createStempelzeit1(
    dto: ApiStempelzeit,
    parentId: string,
    vorgang?: string
  ): Observable<HttpResponse<ApiStempelzeit>> {
    let params = new HttpParams();
    if (vorgang) params = params.set('vorgang', vorgang);

    return this.http.post<ApiStempelzeit>(
      `personen/${parentId}/stempelzeiten`,
      dto,
      {
        params,
        observe: 'response',
        responseType: 'json'
      }
    );
  }

updateStempelzeit(
  dto: ApiStempelzeit,
  id: string,
  vorgang?: string
): Observable<ApiStempelzeit> {
  let params = new HttpParams();
  if (vorgang) params = params.set('vorgang', vorgang);
  return this.http.post<ApiStempelzeit>(`stempelzeiten/${id}`, dto, { params });
}

  updateStempelzeit1(
    dto: ApiStempelzeit,
    id: string,
    vorgang?: string
  ): Observable<HttpResponse<ApiStempelzeit>> {
    let params = new HttpParams();
    if (vorgang) params = params.set('vorgang', vorgang);

    return this.http.post<ApiStempelzeit>(
      `stempelzeiten/${id}`,
      dto,
      {
        params,
        observe: 'response', // ✅ Fixed literal value
        responseType: 'json'  // ✅ Explicit JSON
      }
    );
  }


getStempelzeit(
  personIdStr?: string,
  zeitTypStr?: string,
  logoffAb?: string
): Observable<ApiStempelzeit[]> {
  let params = new HttpParams();
  if (personIdStr) params = params.set('personId', personIdStr);
  if (zeitTypStr) params = params.set('zeitTyp', zeitTypStr);
  if (logoffAb) params = params.set('logoffAb', logoffAb);
  return this.http.get<ApiStempelzeit[]>(`stempelzeiten`, { params });
}


  getStempelzeit1 (
    personIdStr?: string,
    zeitTypStr?: string,
    logoffAb?: string
  ): Observable<HttpResponse<ApiStempelzeit[]>> {
    let params = new HttpParams();
    if (personIdStr) params = params.set('personId', personIdStr);
    if (zeitTypStr) params = params.set('zeitTyp', zeitTypStr);
    if (logoffAb) params = params.set('logoffAb', logoffAb);

    return this.http.get<ApiStempelzeit[]>(`stempelzeiten`, {
      params,
      observe: 'response',
      responseType: 'json'
    });
  }

  getPersonAbschlussInfo(parentId: string): Observable<ApiAbschlussInfo> {
    return this.http.get<ApiAbschlussInfo>(`personen/${parentId}/abschluss/info`);
  }

getAbwesenheiten(
  personIdStr?: string,
  zeitTypStr?: string,
  logoffAb?: string
): Observable<ApiStempelzeit[]> {
  let params = new HttpParams();
  if (personIdStr) params = params.set('personId', personIdStr);
  if (zeitTypStr) params = params.set('zeitTyp', zeitTypStr);
  if (logoffAb) params = params.set('logoffAb', logoffAb);
  return this.http.get<ApiStempelzeit[]>(`stempelzeiten`, { params });
}

sendStempelzeitCalendar(id: string): Observable<void> {
  return this.http.post<void>(`stempelzeiten/sendCalendar/${id}`, null);
}

// ========================================
// ORGANISATIONSEINHEIT ENDPOINTS
// ========================================

createOrganisationseinheit(organisationseinheit: ApiOrganisationseinheit): Observable<ApiOrganisationseinheit> {
  return this.http.post<ApiOrganisationseinheit>(`organisationseinheiten`, organisationseinheit);
}

updateOrganisationseinheit(id: string, organisationseinheit: ApiOrganisationseinheit): Observable<ApiOrganisationseinheit> {
  return this.http.post<ApiOrganisationseinheit>(`organisationseinheiten/${id}`, organisationseinheit);
}

getOrganisationsEinheiten(): Observable<ApiOrganisationseinheit[]> {
  return this.http.get<ApiOrganisationseinheit[]>(`organisationseinheiten`);
}

// ========================================
// VERTRAG ENDPOINTS
// ========================================

getVertraege(
  berechneteStunden?: boolean,
  verbraucheStunden?: boolean
): Observable<ApiVertrag[]> {
  let params = new HttpParams();
  if (berechneteStunden !== undefined) params = params.set('berechneteStunden', berechneteStunden.toString());
  if (verbraucheStunden !== undefined) params = params.set('verbrauchteStunden', verbraucheStunden.toString());
  return this.http.get<ApiVertrag[]>(`vertraege`, { params });
}

getVertraege1(
  vertragDetailStr: string = 'Uebersicht',
  berechneteStunden?: string,
  verbraucheStunden?: string
): Observable<ApiVertrag[]> {
  let params = new HttpParams().set('vertragdetailgrad', vertragDetailStr);
  if (berechneteStunden) params = params.set('berechneteStunden', berechneteStunden);
  if (verbraucheStunden) params = params.set('verbrauchteStunden', verbraucheStunden);
  return this.http.get<ApiVertrag[]>(`vertraege`, { params });
}

getVertrag(
  id: string,
  berechneteStunden?: boolean
): Observable<ApiVertrag> {
  let params = new HttpParams();
  if (berechneteStunden !== undefined) params = params.set('berechneteStunden', berechneteStunden.toString());
  return this.http.get<ApiVertrag>(`vertraege/${id}`, { params });
}

createVertrag(vertrag: ApiVertrag): Observable<ApiVertrag> {
  return this.http.post<ApiVertrag>(`vertraege`, vertrag);
}

updateVertrag(id: string, vertrag: ApiVertrag): Observable<ApiVertrag> {
  return this.http.post<ApiVertrag>(`vertraege/${id}`, vertrag);
}

getVertraegeVerantwortlicher(): Observable<ApiVertrag[]> {
  return this.http.get<ApiVertrag[]>(`vertraege-vertragsverantwortlicher`);
}

// ========================================
// VERTRAG POSITION ENDPOINTS
// ========================================

createVertragPosition(
  position: ApiVertragPosition,
  vertragId: string
): Observable<ApiVertragPosition> {
  return this.http.post<ApiVertragPosition>(`vertraege/${vertragId}/vertrag-positionen`, position);
}

updateVertragPosition(
  id: string,
  position: ApiVertragPosition
): Observable<ApiVertragPosition> {
  return this.http.post<ApiVertragPosition>(`vertrag-positionen/${id}`, position);
}

resetVertragPosition(parentId: string): Observable<ApiVertragPosition> {
  return this.http.post<ApiVertragPosition>(`vertrag-positionen/${parentId}/reset`, null);
}

jahresuebertragVertragsposition(parentId: string): Observable<ApiVertragPosition> {
  return this.http.post<ApiVertragPosition>(`vertrag-positionen/${parentId}/jahresuebertrag`, null);
}

createVertragPositionVerbraucher(
  position: ApiVertragPositionVerbraucher,
  vertragPositionId: string
): Observable<ApiVertragPositionVerbraucher> {
  return this.http.post<ApiVertragPositionVerbraucher>(
    `vertrag-positionen/${vertragPositionId}/vertrag-position-verbraucher`,
    position
  );
}

createVertragPositionVerbraucher1(
  dto: ApiVertragPositionVerbraucher,
  vertragPositionId: string,
  personId?: string
): Observable<ApiVertragPositionVerbraucher> {
  let params = new HttpParams();
  if (personId) params = params.set('person', personId);
  return this.http.post<ApiVertragPositionVerbraucher>(
    `vertrag-positionen/${vertragPositionId}/vertrag-position-verbraucher`,
    dto,
    { params }
  );
}

updateVertragPositionVerbraucher(
  id: string,
  position: ApiVertragPositionVerbraucher
): Observable<ApiVertragPositionVerbraucher> {
  return this.http.post<ApiVertragPositionVerbraucher>(`vertrag-position-verbraucher/${id}`, position);
}

resetAndCopyVertragPositionVerbraucher(
  id: string,
  stundensatzNeu: string
): Observable<ApiVertragPositionVerbraucher> {
  let params = new HttpParams().set('stundensatzNeu', stundensatzNeu);
  return this.http.post<ApiVertragPositionVerbraucher>(
    `vertrag-position-verbraucher/${id}/reset-and-copy`,
    null,
    { params }
  );
}

getVertragPositionVerbraucherStundenplanung(id: string): Observable<ApiStundenplanung[]> {
  return this.http.get<ApiStundenplanung[]>(`vertrag-position-verbraucher/${id}`);
}

// ========================================
// TRIGGER ENDPOINTS
// ========================================

getTrigger(id: string): Observable<ApiTrigger> {
  return this.http.get<ApiTrigger>(`trigger/${id}`);
}

createTrigger(dto: ApiTrigger): Observable<ApiTrigger> {
  return this.http.post<ApiTrigger>(`trigger`, dto);
}

updateTrigger(id: string, dto: ApiTrigger): Observable<ApiTrigger> {
  return this.http.post<ApiTrigger>(`trigger/${id}`, dto);
}

getTriggerToVertrag(vertragId: string): Observable<ApiTrigger[]> {
  return this.http.get<ApiTrigger[]>(`vertraege/${vertragId}/trigger`);
}

// ========================================
// LKDETAILS ENDPOINTS
// ========================================

getLkDetails(vertragId: string): Observable<ApiLkDetails[]> {
  return this.http.get<ApiLkDetails[]>(`vertraege/${vertragId}/lkdetails`);
}

createLkDetails(
  dto: ApiLkDetails,
  vertragId: string
): Observable<ApiLkDetails> {
  return this.http.post<ApiLkDetails>(`vertraege/${vertragId}/lkdetails`, dto);
}

updateLkDetails(
  id: string,
  dto: ApiLkDetails
): Observable<ApiLkDetails> {
  return this.http.post<ApiLkDetails>(`lkdetails/${id}`, dto);
}

// ========================================
// PRODUKT ENDPOINTS
// ========================================

getProdukte(): Observable<ApiProdukt[]> {
  return this.http.get<ApiProdukt[]>(`produkte`);
}

getProdukte1(
  expandAllStr: string = 'false',
  filter?: string
): Observable<ApiProdukt[]> {
  let params = new HttpParams().set('expandAll', expandAllStr);
  if (filter) params = params.set('filter', filter);
  return this.http.get<ApiProdukt[]>(`produkte`, { params });
}

getProdukteFiltered(filter: string): Observable<ApiProdukt[]> {
  let params = new HttpParams().set('filter', filter);
  return this.http.get<ApiProdukt[]>(`produkte`, { params });
}

getProdukt(
  id: string,
  filter?: string
): Observable<ApiProdukt> {
  let params = new HttpParams();
  if (filter) params = params.set('filter', filter);
  return this.http.get<ApiProdukt>(`produkte/${id}`, { params });
}

createProdukt(produkt: ApiProdukt): Observable<ApiProdukt> {
  return this.http.post<ApiProdukt>(`produkte`, produkt);
}

updateProdukt(id: string, produkt: ApiProdukt): Observable<ApiProdukt> {
  return this.http.post<ApiProdukt>(`produkte/${id}`, produkt);
}

// ========================================
// PRODUKT POSITION ENDPOINTS
// ========================================

createProduktPosition(
  position: ApiProduktPosition,
  produktId: string
): Observable<ApiProduktPosition> {
  return this.http.post<ApiProduktPosition>(`produkte/${produktId}/produkt-positionen`, position);
}

updateProduktPosition(
  id: string,
  position: ApiProduktPosition
): Observable<ApiProduktPosition> {
  return this.http.post<ApiProduktPosition>(`produkt-positionen/${id}`, position);
}

createProduktPositionBuchungspunkt(
  position: ApiProduktPositionBuchungspunkt,
  produktPositionId: string
): Observable<ApiProduktPositionBuchungspunkt> {
  return this.http.post<ApiProduktPositionBuchungspunkt>(
    `produkt-positionen/${produktPositionId}/produkt-positionen-buchungspunkte`,
    position
  );
}

resetProduktPosition(id: string): Observable<ApiProduktPosition> {
  return this.http.post<ApiProduktPosition>(`produkt-positionen/${id}/reset`, null);
}

updateProduktPositionBuchungspunkt(
  id: string,
  position: ApiProduktPositionBuchungspunkt
): Observable<ApiProduktPositionBuchungspunkt> {
  return this.http.post<ApiProduktPositionBuchungspunkt>(
    `produkt-positionen-buchungspunkte/${id}`,
    position
  );
}

// ========================================
// STUNDENPLANUNG ENDPOINTS
// ========================================

getStundenplanungByVerbraucher(id: string): Observable<ApiStundenplanung[]> {
  return this.http.get<ApiStundenplanung[]>(`vertrag-position-verbraucher/${id}`);
}

getStundenplanung(id: string): Observable<ApiStundenplanung> {
  return this.http.get<ApiStundenplanung>(`stundenplanung/${id}`);
}

createStundenplanung(
  object: ApiStundenplanung,
  produktPositionId: string,
  verbraucherId: string
): Observable<ApiStundenplanung> {
  let params = new HttpParams().set('verbraucher', verbraucherId);
  return this.http.post<ApiStundenplanung>(
    `produkt-positionen/${produktPositionId}/stundenplanung`,
    object,
    { params }
  );
}

updateStundenplanung(
  id: string,
  object: ApiStundenplanung
): Observable<ApiStundenplanung> {
  return this.http.post<ApiStundenplanung>(`stundenplanung/${id}`, object);
}

// ========================================
// TAETIGKEITSBUCHUNG ENDPOINTS
// ========================================

createTaetigkeitsbuchung(
  dto: ApiTaetigkeitsbuchung,
  produktPositionBuchungspunktId: string,
  personId: string,
  vorgang?: string
): Observable<ApiTaetigkeitsbuchung> {
  let params = new HttpParams().set('personId', personId);
  if (vorgang) params = params.set('vorgang', vorgang);
  return this.http.post<ApiTaetigkeitsbuchung>(
    `produkt-positionen-buchungspunkte/${produktPositionBuchungspunktId}/taetigkeitsbuchungen`,
    dto,
    { params }
  );
}

updateTaetigkeitsbuchung(
  id: string,
  dto: ApiTaetigkeitsbuchung,
  vorgang?: string
): Observable<ApiTaetigkeitsbuchung> {
  let params = new HttpParams();
  if (vorgang) params = params.set('vorgang', vorgang);
  return this.http.post<ApiTaetigkeitsbuchung>(
    `taetigkeitsbuchungen/${id}`,
    dto,
    { params }
  );
}

// ========================================
// ABSCHLUSS ENDPOINTS
// ========================================

abschlussTag(datum: string, aufheben?: boolean): Observable<void> {
  let params = new HttpParams();
  if (aufheben !== undefined) params = params.set('aufheben', aufheben.toString());
  return this.http.post<void>(`abschluss-tag/${datum}`, null, { params });
}

abschlussMonat(datum: string): Observable<void> {
  return this.http.post<void>(`abschluss-monat/${datum}`, null);
}

abschlussInfo(parentId: string): Observable<ApiAbschlussInfo> {
  return this.http.get<ApiAbschlussInfo>(`personen/${parentId}/abschluss-info`);
}

// ========================================
// BEREITSCHAFT ENDPOINTS
// ========================================

createBereitschaft(
  dto: ApiStempelzeit,
  parentId: string
): Observable<ApiStempelzeit[]> {
  return this.http.post<ApiStempelzeit[]>(`personen/${parentId}/bereitschaft`, dto);
}

createBereitschaft1(
  dto: ApiStempelzeit,
  parentId: string,
  vorgangStr?: string
): Observable<ApiStempelzeit[]> {
  let params = new HttpParams();
  if (vorgangStr) params = params.set('vorgang', vorgangStr);
  return this.http.post<ApiStempelzeit[]>(
    `personen/${parentId}/bereitschaft`,
    dto,
    { params }
  );
}

deleteBereitschaft(id: string): Observable<void> {
  return this.http.delete<void>(`bereitschaft/${id}`);
}

deleteBereitschaft1(
  id: string,
  vorgangStr?: string
): Observable<void> {
  let params = new HttpParams();
  if (vorgangStr) params = params.set('vorgang', vorgangStr);
  return this.http.delete<void>(`bereitschaft/${id}`, { params });
}

// ========================================
// MISC ENDPOINTS
// ========================================

feiertage(): Observable<ApiFeiertage> {
  return this.http.get<ApiFeiertage>(`feiertage`);
}

createZivildienerUrlaubKrank(
  dto: ApiStempelzeit,
  parentId: string
): Observable<ApiStempelzeit[]> {
  return this.http.post<ApiStempelzeit[]>(`personen/${parentId}/zivi-urlaubkrank`, dto);
}

getInfo(): Observable<ApiInfo> {
  return this.http.get<ApiInfo>(`info`);
}

// ========================================
// PERSONENVERANTWORTLICHER ENDPOINTS
// ========================================

getPersonPersonenverantwortlicher(
  parentId: string,
  personenDetailStr?: string
): Observable<ApiPerson[]> {
  let params = new HttpParams();
  if (personenDetailStr) params = params.set('persondetailgrad', personenDetailStr);
  return this.http.get<ApiPerson[]>(`personen/${parentId}/personenverantwortliche`, { params });
}

getPersonDurchfuehrungsverantwortlicher(jahrStr?: string): Observable<ApiPerson[]> {
  let params = new HttpParams();
  if (jahrStr) params = params.set('jahr', jahrStr);
  return this.http.get<ApiPerson[]>(`personen-durchfuehrungsverantwortlicher`, { params });
}

// ========================================
// GEPLANT GEBUCHT ENDPOINTS
// ========================================

getPersonGeplantGebucht(
  parentId: string,
  positionIdStr?: string,
  planungsjahrStr?: string
): Observable<ApiGeplantGebucht> {
  let params = new HttpParams();
  if (positionIdStr) params = params.set('produktPosition', positionIdStr);
  if (planungsjahrStr) params = params.set('planungsjahr', planungsjahrStr);
  return this.http.get<ApiGeplantGebucht>(`personen/${parentId}/geplant-gebucht`, { params });
}

getPersonGeplantGebucht1(
  parentId: string,
  positionIdStr?: string,
  planungsjahrStr?: string,
  addGebucht?: boolean,
  nurAktiv?: boolean
): Observable<ApiGeplantGebucht> {
  let params = new HttpParams();
  if (positionIdStr) params = params.set('produktPosition', positionIdStr);
  if (planungsjahrStr) params = params.set('planungsjahr', planungsjahrStr);
  if (addGebucht !== undefined) params = params.set('addGebucht', addGebucht.toString());
  if (nurAktiv !== undefined) params = params.set('nurAktiv', nurAktiv.toString());
  return this.http.get<ApiGeplantGebucht>(`personen/${parentId}/geplant-gebucht`, { params });
}

getPersonGeplant(
  parentId: string,
  planungsjahrStr?: string,
  addGebucht?: boolean,
  nurAktiv?: boolean
): Observable<ApiGeplantGebucht> {
  let params = new HttpParams();
  if (planungsjahrStr) params = params.set('planungsjahr', planungsjahrStr);
  if (addGebucht !== undefined) params = params.set('addGebucht', addGebucht.toString());
  if (nurAktiv !== undefined) params = params.set('nurAktiv', nurAktiv.toString());
  return this.http.get<ApiGeplantGebucht>(`personen/${parentId}/geplant`, { params });
}

// ========================================
// FREIGABE POSITION ENDPOINTS
// ========================================

getFreigabePositionen(funktion?: string): Observable<ApiFreigabePosition[]> {
  let params = new HttpParams();
  if (funktion) params = params.set('funktion', funktion);
  return this.http.get<ApiFreigabePosition[]>(`freigabe-positionen`, { params });
}

getFreigabePositionenHistory(ab: string, bis: string): Observable<ApiFreigabePosition[]> {
  let params = new HttpParams()
    .set('ab', ab)
    .set('bis', bis);
  return this.http.get<ApiFreigabePosition[]>(`freigabePositionen/history`, { params });
}

getFreigabePositionTaetigkeitsbuchungen(id: string): Observable<ApiTaetigkeitsbuchung[]> {
  return this.http.get<ApiTaetigkeitsbuchung[]>(`freigabe-positionen/${id}/taetigkeitsbuchungen`);
}

updateFreigabePositionen(
  dto: ApiFreigabePosition[],
  buchungsIds?: string[]
): Observable<ApiFreigabePosition[]> {
  let params = new HttpParams();
  if (buchungsIds && buchungsIds.length > 0) {
    buchungsIds.forEach(id => params = params.append('buchungId', id));
  }
  return this.http.post<ApiFreigabePosition[]>(`freigabe-positionen`, dto, { params });
}

getFreigabePositionenAnzahl(): Observable<ApiFreigabePositionAnzahl> {
  return this.http.get<ApiFreigabePositionAnzahl>(`freigabe-positionen-anzahl`);
}

getFreigabeGruppen(): Observable<ApiProduktPosition[]> {
  return this.http.get<ApiProduktPosition[]>(`freigabe-gruppen`);
}

// ========================================
// PERSONENVERMERK ENDPOINTS
// ========================================

getPersonVermerke(
  parentId: string,
  ab: string,
  bis: string
): Observable<ApiPersonenvermerk[]> {
  let params = new HttpParams()
    .set('ab', ab)
    .set('bis', bis);
  return this.http.get<ApiPersonenvermerk[]>(`personen/${parentId}/personenvermerke`, { params });
}

createPersonVermerk(
  dto: ApiPersonenvermerk,
  parentId: string
): Observable<ApiPersonenvermerk> {
  return this.http.post<ApiPersonenvermerk>(`personen/${parentId}/personenvermerke`, dto);
}

updatePersonVermerk(
  id: string,
  dto: ApiPersonenvermerk
): Observable<ApiPersonenvermerk> {
  return this.http.post<ApiPersonenvermerk>(`personenvermerke/${id}`, dto);
}

deletePersonVermerk(id: string): Observable<void> {
  return this.http.delete<void>(`personenvermerke/${id}`);
}

// ========================================
// STATIC DATA ENDPOINTS
// ========================================

getAlleAktuellenTeamzuordnungen(): Observable<ApiTeamzuordnungen> {
  return this.http.get<ApiTeamzuordnungen>(`teamzuordnungen`);
}

getAlleAktuellenVertragsparter(): Observable<ApiVertragspartnerListe> {
  return this.http.get<ApiVertragspartnerListe>(`vertragspartner`);
}

getAlleAktuellenGeschaeftszahlen(): Observable<ApiGeschaeftszahlenListe> {
  return this.http.get<ApiGeschaeftszahlenListe>(`geschaeftszahlen`);
}

getAlleAktuellenRollenbezeichnungen(): Observable<ApiRollenbezeichnungsListe> {
  return this.http.get<ApiRollenbezeichnungsListe>(`rollenbezeichnungen`);
}

getAlleAktuellenLeistungskategorien(): Observable<ApiLeistungskategorien> {
  return this.http.get<ApiLeistungskategorien>(`leistungskategorien`);
}

taetigkeiten(): Observable<ApiTaetigkeiten> {
  return this.http.get<ApiTaetigkeiten>(`taetigkeiten`);
}

// produktPositionen(): Observable<ApiProduktPositionen> {
//   return this.http.get<ApiProduktPositionen>(`produkt-positionen`);
// }

// ========================================
// INFO PDF ENDPOINTS
// ========================================

mussInfoPdfLesen(): Observable<ApiMussPdfLesen> {
  return this.http.get<ApiMussPdfLesen>(`infopdf/musslesen`);
}

hatInfoPdfGelesen(): Observable<void> {
  return this.http.post<void>(`infopdf/hatgelesen`, null);
}

createPdfVermerke(): Observable<void> {
  return this.http.post<void>(`infopdf/createpdfvermerke`, null);
}

// ========================================
// PDF UPLOAD/RETRIEVE ENDPOINTS
// ========================================

uploadInformationsPdf(file: File): Observable<string> {
  const formData = new FormData();
  formData.append('file', file);
  return this.http.post(`infopdf-upload`, formData, { responseType: 'text' });
}

uploadInteressenskonfliktPdf(file: File): Observable<string> {
  const formData = new FormData();
  formData.append('file', file);
  return this.http.post(`interessenskonfliktpdf-upload`, formData, { responseType: 'text' });
}

getInfoPdf(): Observable<Blob> {
  return this.http.get(`infopdf`, { responseType: 'blob' });
}

uploadTelefonliste(file: File): Observable<string> {
  const formData = new FormData();
  formData.append('file', file);
  return this.http.post(`telefonliste`, formData, { responseType: 'text' });
}



getTelefonlistePdf(): Observable<Blob> {
  return this.http.get(`telefonliste`, { responseType: 'blob' });
}

// ========================================
// HEALTH/MONITORING ENDPOINTS
// ========================================

// health(): Observable<ApiHealth> {
//   return this.http.get<ApiHealth>(`health`);
// }

// monitoring(): Observable<ApiHealth> {
//   return this.http.get<ApiHealth>(`monitoring`);
// }

verify(): Observable<string> {
  return this.http.get(`verify`, { responseType: 'text' });
}

// ========================================
// TEST ENDPOINTS
// ========================================

// test(): Observable<ApiTest> {
//   return this.http.get<ApiTest>(`test`);
}
