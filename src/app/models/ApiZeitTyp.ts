export enum ApiZeitTyp {
  ARBEITSZEIT = "Arbeitszeit",
  REMOTEZEIT = "Remotezeit",
  BEREITSCHAFT = "BEREITSCHAFT",
  URLAUB = "Urlaub",
  ZEITAUSGLEICH = "Zeitausgleich",
  KRANKENSTAND = "Krankenstand",
  GUTSCHRIFT = "Gutschrift",
  ABWESENHEIT = "Abwesenheit",
  TELEARBEIT = "Telearbeit",
}

export function getApiZeitTypDisplayValues(): { key: ApiZeitTyp, value: string }[] {
  return [
    { key: ApiZeitTyp.ARBEITSZEIT, value: "Arbeitszeit" },
    { key: ApiZeitTyp.REMOTEZEIT, value: "Remotezeit" },
    { key: ApiZeitTyp.BEREITSCHAFT, value: "BEREITSCHAFT" },
    { key: ApiZeitTyp.URLAUB, value: "Urlaub" },
    { key: ApiZeitTyp.ZEITAUSGLEICH, value: "Zeitausgleich" },
    { key: ApiZeitTyp.KRANKENSTAND, value: "Krankenstand" },
    { key: ApiZeitTyp.GUTSCHRIFT, value: "Gutschrift" },
    { key: ApiZeitTyp.ABWESENHEIT, value: "Abwesenheit" },
    { key: ApiZeitTyp.TELEARBEIT, value: "Telearbeit" },
  ];
}

export function createZeitTypToBackendKeyMapping(): Record<ApiZeitTyp, string> {
  return Object.entries(ApiZeitTyp).reduce(
    (acc, [key, value]) => {
      acc[value as ApiZeitTyp] = key;
      return acc;
    },
    {} as Record<ApiZeitTyp, string>
  );
}
export function zeitTypToBackendKey(zeitTyp: ApiZeitTyp): string {
  const mapping = Object.entries(ApiZeitTyp).reduce(
    (acc, [key, value]) => {
      acc[value as ApiZeitTyp] = key;
      return acc;
    },
    {} as Record<ApiZeitTyp, string>
  );

  return mapping[zeitTyp] || zeitTyp;
}






