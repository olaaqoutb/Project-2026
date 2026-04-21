import { Injectable } from '@angular/core';
import {ApiMitarbeiterart, getApiMitarbeiterartDisplayValues} from '../../models/ApiMitarbeiterart';
import {transformEnum} from './enum.utils';
import {ApiRolle, getApiRolleDisplayValues} from '../../models/ApiRolle';
import {ApiBucher, getApiBucherDisplayValues} from '../../models/ApiBucher';
import {ApiZeitTyp, getApiZeitTypDisplayValues} from '../../models/ApiZeitTyp';

@Injectable({
  providedIn: 'root'
})
export class EnumService {

  constructor() { }


 public static  transformMitarbeiterArt(mitarbeiterArt : ApiMitarbeiterart | null | undefined) : string{
    const display = transformEnum(
      mitarbeiterArt,
      ApiMitarbeiterart,
      getApiMitarbeiterartDisplayValues,
      ''
    );

    return display;
  }

  public static transformMitarbeiterRolle(rolle : ApiRolle | null | undefined) : string{
    const display = transformEnum(
      rolle,
      ApiRolle,
      getApiRolleDisplayValues,
      'N/A'
    );

    return display;
  }

  public static transformMitarbeiterBucher(bucher : ApiBucher | null | undefined) : string{
    const display = transformEnum(
      bucher,
      ApiBucher,
      getApiBucherDisplayValues,
      'N/A'
    );

    return display;
  }


  public static transformZeitTyp(zeitTyp : ApiZeitTyp | null | undefined) : string{
    const display = transformEnum(
      zeitTyp,
      ApiZeitTyp,
      getApiZeitTypDisplayValues,
      'N/A'
    );

    return display;
  }

}
