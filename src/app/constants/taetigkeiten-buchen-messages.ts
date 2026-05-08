/**
 * User-facing strings, magic values, and field display labels for the
 * Tätigkeiten-Buchen screen. Pulled out of the component so the component
 * carries no inline German text or sentinel values.
 */

export const TAETIGKEITEN_BUCHEN_MESSAGES = {
  dialogTitles: {
    success:                 'Erfolgreich',
    error:                   'Fehler',
    invalidDate:             'Ungültiges Datum',
    invalidDuration:         'Ungültige Dauer',
    invalidTime:             'Ungültige Zeitangaben',
    missingFields:           'Pflichtfelder fehlen',
    missingSelection:        'Fehlende Auswahl',
    validationError:         'Validierungsfehler',
    bookingLimit:            'Buchungslimit',
    deleteEntry:             'Löschen einer Tätigkeitsbuchung',
    closedMonth:             'Monat ist geschlossen',
    closedDay:               'Tag ist geschlossen',
    closedDayBlocker:        'Tag kann nicht geschlossen werden',
    closedRange:             'Zeitraum abgeschlossen',
    deleteFailed:            'Fehler beim Löschen',
    createFailed:            'Fehler beim Erstellen',
  },
  vertrag: {
    createSuccess:           'Die Tätigkeitsbuchung wurde erfolgreich erstellt!',
    createFailed:            'Die Tätigkeitsbuchung konnte nicht erstellt werden.',
    deleteSuccess:           'Die Tätigkeitsbuchung wurde erfolgreich gelöscht!',
    deleteFailed:            'Die Tätigkeitsbuchung konnte nicht gelöscht werden.',
    deleteIdMissing:         'Keine ID zum Löschen gefunden.',
    saveSuccessChanges:      'Änderungen wurden gespeichert.',
    saveSuccessMonth:        'Monatsänderungen wurden gespeichert.',
    saveSuccessDay:          'Tagesänderungen wurden gespeichert.',
    deleteConfirm:           'Wollen Sie die Tätigkeitsbuchung löschen?',
  },
  errors: {
    invalidDuration:         'Bitte geben Sie eine gültige Dauer ein.',
    invalidTime:             'Die Zeitangaben sind ungültig.',
    invalidDate:             'Das angegebene Datum ist ungültig.',
    pickBuchungspunkt:       'Bitte Buchungspunkt auswählen.',
    closedMonthForBookings:  'Dieser Monat ist abgeschlossen. Bitte öffnen Sie den Monat, bevor Sie Buchungen anlegen.',
    closedMonthCurrent:      'Der aktuelle Monat ist abgeschlossen. Bitte öffnen Sie den Monat, bevor Sie Buchungen anlegen.',
    closedMonthSelected:     'Der ausgewählte Monat ist abgeschlossen. Bitte öffnen Sie den Monat, bevor Sie Buchungen anlegen.',
    closedMonthForDayToggle: 'Der zugehörige Monat ist abgeschlossen. Bitte öffnen Sie zuerst den Monat, bevor Sie Tage öffnen oder schließen.',
    closedDayForDeletion:    'Dieser Tag ist abgeschlossen. Bitte öffnen Sie den Tag, bevor Sie Einträge löschen.',
    bookingLimitWarning:     'Sie überschreiten das Buchungslimit von 10 Stunden pro Tag. Wenn Sie trotzdem buchen möchten, bitte eine Begründung eingeben.',
    bookingLimitLabel:       'Begründung für mehr als 10 Std./Tag:',
    confirm:                 'Buchen',
    cancel:                  'Abbrechen',
    rangeClosedTemplate:     (date: string) => `Dieser Zeitraum ist bereits abgeschlossen. Frühestens ab ${date} buchbar.`,
    pickPreviousDayTemplate: (dayName: string) => `Bitte schließen Sie zuerst den vorherigen offenen Tag (${dayName}). Tage müssen in chronologischer Reihenfolge abgeschlossen werden.`,
    pflichtfelderTemplate:   (fields: string[]) => `Bitte füllen Sie folgende Pflichtfelder aus: ${fields.join(', ')}.`,
  },
  monthDayInfo: {
    monthClosed:             'Der Monat wurde geschlossen.',
    monthOpened:             'Der Monat wurde geöffnet.',
    dayClosed:               'Der Tag wurde geschlossen.',
    dayOpened:               'Der Tag wurde geöffnet.',
  },
  fieldDisplay: {
    datum:               'Datum',
    buchungsart:         'Buchungsart',
    produkt:             'Produkt',
    produktposition:     'Produktposition',
    buchungspunkt:       'Buchungspunkt',
    taetigkeit:          'Tätigkeit',
    anmeldezeitStunde:   'Anmeldezeit Stunde',
    anmeldezeitMinuten:  'Anmeldezeit Minuten',
    abmeldezeitStunde:   'Abmeldezeit Stunde',
    abmeldezeitMinuten:  'Abmeldezeit Minuten',
    anmerkung:           'Anmerkung',
    jiraTicket:          'Jira-Ticket',
  } as { readonly [key: string]: string },
} as const;

export const TAETIGKEITEN_BUCHEN_CONSTANTS = {
  defaultPersonId:        'p-me',
  deleteVorgang:          'delete',
  produktFilterKorrektur: 'KORREKTUR',
  personDetailMode:       'FullPvTlName',
  jiraTicketMaxLength:    30,
  bookingLimitHours:      10,
  yearDropdownLookbackYears: 6,
} as const;

export function buildYearDropdownOptions(
  lookback: number = TAETIGKEITEN_BUCHEN_CONSTANTS.yearDropdownLookbackYears,
): string[] {
  const current = new Date().getFullYear();
  return Array.from({ length: lookback + 1 }, (_, i) => String(current - i));
}
