import { ApiZeitTyp } from "../models/ApiZeitTyp";


export interface FormDataStempelzeit {
    datum: string;
    zeittyp: ApiZeitTyp | string;
    anmeldezeit: { stunde: number; minuten: number };
    abmeldezeit: { stunde: number; minuten: number };
    anmerkung: string;
}

