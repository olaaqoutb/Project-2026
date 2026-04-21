export const ABWESENHEIT_FORM_ERRORS: Record<string, { title: string; detail: string }> = {
  startDateAfterEndDateKorrigieren: {
    title: 'Es sind Eingabefehler aufgetreten',
    detail: "Das Feld 'Start' muss kleiner sein als 'Ende'"
  },
  startDateAfterEndDate: {
    title: 'Es sind Eingabefehler aufgetreten',
    detail: "Das Feld 'Start' muss kleiner sein als 'Ende' \n Das Feld 'Ende' darf nicht vor dem aktuellen Zeitpunkt liegen"
  },
  startDateAndEndDateInPast: {
    title: 'Es sind Eingabefehler aufgetreten',
    detail: "Das Feld 'Start' und 'Ende' dürfen nicht in der Vergangenheit liegen"
  },
  endDateInPast: {
    title: 'Ungültige Eingabe',
    detail: 'Das Enddatum darf nicht in der Vergangenheit liegen'
  },
  endTimeInPast: {
    title: 'Es sind Fehler aufgetreten',
    detail: "Das Feld 'Ende' darf nicht in der Vergangenheit liegen"
  },
  startDateInPast: {
    title: 'Ungültige Eingabe',
    detail: 'Das Startdatum darf nicht in der Vergangenheit liegen'
  },
  startDateEditedInPast: {
    title: 'Es sind Eingabefehler aufgetreten',
    detail: "Das Feld 'Start' darf nicht vor dem heutigen Tag liegen"
  },
  startDateEditedInFuture: {
    title: 'Es sind Eingabefehler aufgetreten',
    detail: 'Start liegt in der Vergangenheit und kann daher nicht mehr geändert werden'
  },
  endDateTooFarInFuture: {
    title: 'Es sind Eingabefehler aufgetreten',
    detail: "Das Feld 'Ende' darf maximal zwei Jahre in der Zukunft liegen"
  },
  bothDatesTooFarInFuture: {
    title: 'Es sind Eingabefehler aufgetreten',
    detail: "Abwesenheit.login: muss maximal 2 Jahre in der Zukunft sein\n" +
      "Abwesenheit.logoff: muss maximal 2 Jahre in der Zukunft sein"
  },
  absenceTooLong: {
    title: 'Es sind Eingabefehler aufgetreten',
    detail: 'Eine Abwesenheit darf maximal ein Jahr lang sein'
  },
  abwesenheitMaximalEinJahr: {
    title: 'Es sind Eingabefehler aufgetreten',
    detail: 'Zwischen Start und Ende darf maximal 1 Jahr Abstand sein'
  },
  startDateRequired: {
    title: 'Es sind Eingabefehler aufgetreten',
    detail: "Das Feld 'Start' darf nicht leer sein"
  },
  endDateRequired: {
    title: 'Es sind Eingabefehler aufgetreten',
    detail: "Das Feld 'Ende' darf nicht leer sein"
  },

  default: {
    title: 'Ungültige Eingabe',
    detail: 'Bitte überprüfen Sie Ihre Eingaben'
  }
};
