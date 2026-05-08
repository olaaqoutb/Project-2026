import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { GetitRest3Service } from './getit-rest-3.service';
import { ApiVertrag } from '../models/ApiVertrag';
import { ApiVertragPosition } from '../models/ApiVertragPosition';
import { ApiVertragPositionVerbraucher } from '../models/ApiVertragPositionVerbraucher';
import { ApiStundenplanung } from '../models/ApiStundenplanung';
import { ApiGeschaeftszahlenListe } from '../models/ApiGeschaeftszahlenListe';
import { ApiRollenbezeichnungsListe } from '../models/ApiRollenbezeichnungsListe';
import { ApiPerson } from '../models/ApiPerson';
import { ApiProdukt } from '../models/ApiProdukt';

@Injectable({
  providedIn: 'root'
})
export class VertragService {

  constructor(private getitRest3Service: GetitRest3Service) {}

  getPersonen1(): Observable<HttpResponse<ApiPerson[]>> {
    return this.getitRest3Service.getPersonen();
  }

  getVertraege(
    berechneteStunden?: boolean,
    verbraucheStunden?: boolean
  ): Observable<HttpResponse<ApiVertrag[]>> {
    return this.getitRest3Service.getVertraege(berechneteStunden, verbraucheStunden);
  }

  getVertrag(
    id: string,
    berechneteStunden?: boolean
  ): Observable<HttpResponse<ApiVertrag>> {
    return this.getitRest3Service.getVertrag(id, berechneteStunden);
  }

  createVertrag(vertrag: ApiVertrag): Observable<HttpResponse<ApiVertrag>> {
    return this.getitRest3Service.createVertrag(vertrag);
  }

  updateVertrag(id: string, vertrag: ApiVertrag): Observable<HttpResponse<ApiVertrag>> {
    return this.getitRest3Service.updateVertrag(id, vertrag);
  }

  getAlleAktuellenGeschaeftszahlen(): Observable<HttpResponse<ApiGeschaeftszahlenListe>> {
    return this.getitRest3Service.getAlleAktuellenGeschaeftszahlen();
  }

  getAlleAktuellenRollenbezeichnungen(): Observable<HttpResponse<ApiRollenbezeichnungsListe>> {
    return this.getitRest3Service.getAlleAktuellenRollenbezeichnungen();
  }

  getProdukte(): Observable<HttpResponse<ApiProdukt[]>> {
    return this.getitRest3Service.getProdukte();
  }

  getProdukt(id: string, filter?: string): Observable<HttpResponse<ApiProdukt>> {
    return this.getitRest3Service.getProdukt(id, filter);
  }

  createVertragPosition(
    position: ApiVertragPosition,
    vertragId: string
  ): Observable<HttpResponse<ApiVertragPosition>> {
    return this.getitRest3Service.createVertragPosition(position, vertragId);
  }

  updateVertragPosition(
    id: string,
    position: ApiVertragPosition
  ): Observable<HttpResponse<ApiVertragPosition>> {
    return this.getitRest3Service.updateVertragPosition(id, position);
  }

  createVertragPositionVerbraucher(
    position: ApiVertragPositionVerbraucher,
    vertragPositionId: string
  ): Observable<HttpResponse<ApiVertragPositionVerbraucher>> {
    return this.getitRest3Service.createVertragPositionVerbraucher(position, vertragPositionId);
  }

  updateVertragPositionVerbraucher(
    id: string,
    position: ApiVertragPositionVerbraucher
  ): Observable<HttpResponse<ApiVertragPositionVerbraucher>> {
    return this.getitRest3Service.updateVertragPositionVerbraucher(id, position);
  }

  createStundenplanung(
    object: ApiStundenplanung,
    produktPositionId: string,
    verbraucherId: string
  ): Observable<HttpResponse<ApiStundenplanung>> {
    return this.getitRest3Service.createStundenplanung(object, produktPositionId, verbraucherId);
  }

  updateStundenplanung(
    id: string,
    object: ApiStundenplanung
  ): Observable<HttpResponse<ApiStundenplanung>> {
    return this.getitRest3Service.updateStundenplanung(id, object);
  }
}
