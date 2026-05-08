/**
 * User-facing strings for the Vertrag detail screen.
 * Kept in one place so the component carries no inline German text.
 */
export const VERTRAG_DETAIL_MESSAGES = {
  dialogTitles: {
    success:         'Erfolgreich',
    error:           'Fehler',
    validationError: 'Es sind Eingabefehler aufgetreten',
  },
  placeholders: {
    vertragsverantwortlicher: '< Vertragsverantwortlicher wählen >',
    person:                   '< Person wählen >',
    produkt:                  '< Produkt wählen >',
    produktposition:          '< Produktposition wählen >',
    bezugsart:                '< Bezugsart wählen >',
    vertragstyp:              '< Vertragstyp wählen >',
    verbrauchertyp:           '< Verbrauchertyp wählen >',
    rollenbez:                '< Rollenbez.Rahmenvertrag wählen >',
  },
  vertrag: {
    loadFailed:  'Vertrag konnte nicht geladen werden.',
    saveSuccess: 'Daten wurden erfolgreich gespeichert.',
    saveFailed:  'Fehler beim Speichern des Vertrags.',
  },
  position: {
    createFailed:  'Fehler beim Erstellen der Position.',
    saveFailed:    'Fehler beim Speichern der Position.',
    saveSuccess:   'Position erfolgreich gespeichert.',
    deleteSuccess: 'Position erfolgreich gelöscht.',
    deleteFailed:  'Fehler beim Löschen.',
  },
  verbraucher: {
    createFailed:  'Fehler beim Erstellen des Verbrauchers.',
    saveFailed:    'Fehler beim Speichern des Verbrauchers.',
    saveSuccess:   'Verbraucher erfolgreich gespeichert.',
    deleteSuccess: 'Verbraucher erfolgreich gelöscht.',
    deleteFailed:  'Fehler beim Löschen des Verbrauchers.',
  },
  stundenplanung: {
    createFailed:  'Fehler beim Erstellen der Stundenplanung.',
    saveFailed:    'Fehler beim Speichern der Stundenplanung.',
    saveSuccess:   'Stundenplanung erfolgreich gespeichert.',
    deleteSuccess: 'Stundenplanung erfolgreich gelöscht.',
    deleteFailed:  'Fehler beim Löschen der Stundenplanung.',
  },
} as const;
