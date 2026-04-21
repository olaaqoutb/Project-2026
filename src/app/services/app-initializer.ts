import { inject } from '@angular/core';
import {PersonService} from './person.service';
import {PersonenService} from './personen.service';

export function initializeApp() {
  const personService = inject(PersonenService);

  return () => {
    console.log('🚀 Initializing application - loading logged-in user...');
    return personService.loadLoggedInPerson().toPromise();
  };
}
