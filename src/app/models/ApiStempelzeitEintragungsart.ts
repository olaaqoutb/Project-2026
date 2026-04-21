export enum ApiStempelzeitEintragungsart {
  NORMAL = "NORMAL",
  SELBST = "Selbst",
}

export function getApiStempelzeitEintragungsartDisplayValues(): { key: ApiStempelzeitEintragungsart, value: string }[] {
  return [
    { key: ApiStempelzeitEintragungsart.NORMAL, value: "NORMAL" },
    { key: ApiStempelzeitEintragungsart.SELBST, value: "Selbst" },
  ];
}
