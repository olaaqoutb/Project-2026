export enum ApiFreigabeStatus {
  PRUEFEN_DV = "PRUEFEN_DV",
  PRUEFEN_EV = "PRUEFEN_EV",
  ABGELEHNT = "ABGELEHNT",
  FREIGEGEBEN = "FREIGEGEBEN",
  FREIGEGEBEN_AUTO = "FREIGEGEBEN_AUTO",
}

export function getApiFreigabeStatusDisplayValues(): { key: ApiFreigabeStatus, value: string }[] {
  return [
    { key: ApiFreigabeStatus.PRUEFEN_DV, value: "PruefenDV" },
    { key: ApiFreigabeStatus.PRUEFEN_EV, value: "PruefenEV" },
    { key: ApiFreigabeStatus.ABGELEHNT, value: "Abgelehnt" },
    { key: ApiFreigabeStatus.FREIGEGEBEN, value: "Freigegeben" },
    { key: ApiFreigabeStatus.FREIGEGEBEN_AUTO, value: "FreigegebenAuto" },
  ];
}
