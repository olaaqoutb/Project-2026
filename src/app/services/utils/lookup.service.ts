import { Injectable } from '@angular/core';
import { BUCHER_TYPEN, DIENSTVERWENDUNG_TYPEN,  FREIGABEGRUPPE_TYPEN, GESCHLECHT_TYPEN, GETITROLLE_TYPEN, MITARBEITER_TYPEN, POSITION_TYPEN, PRODUKT_TYPEN } from '../../models/app-constants';

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  constructor() { }

  getPositionTypen() {
    return POSITION_TYPEN;
  }

  getProduktTypen() {
    return PRODUKT_TYPEN;
  }

  getGeschlechtTypen() {
    return GESCHLECHT_TYPEN;
  }

  getMitarbeiterartTypen() {
    return MITARBEITER_TYPEN;
  }


 

  getGetItRolleTypen(){
    return GETITROLLE_TYPEN;
  }

  getBucherTypen(){
    return BUCHER_TYPEN;
  }

  getDienstVerwendungTypen(){
    return DIENSTVERWENDUNG_TYPEN;
  }

  getFreigabeGruppeTypen(){
    return FREIGABEGRUPPE_TYPEN;
  }
}

 
