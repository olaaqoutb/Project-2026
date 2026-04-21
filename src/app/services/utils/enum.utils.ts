export function getEnumKeyByValue<T extends Record<string, string>>(
  enumObj: T,
  value: string
): keyof T | undefined {
  return (Object.keys(enumObj) as (keyof T)[]).find(
    key => enumObj[key] === value
  );
}


export function transformEnum<T extends string>(
  enumValue: string | null | undefined,
  enumObj: any,
  getDisplayValues: () => { key: T, value: string }[],
  fallback: string = 'N/A'
): string {
  if (!enumValue) {
    return fallback;
  }

  // Convert enum key to value (e.g., "EXTERN" → "extern")
  const enumValueConverted = enumObj[enumValue] || enumValue;

  // Find the display value
  const displayValues = getDisplayValues();
  const found = displayValues.find(item => item.key === enumValueConverted);

  return found?.value || String(enumValue);
}
