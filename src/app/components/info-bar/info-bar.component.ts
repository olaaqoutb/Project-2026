import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import {PersonService} from '../../services/person.service';
import {ApiPerson} from '../../models/ApiPerson';
import {PersonenService} from '../../services/personen.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-info-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatTooltipModule,
    MatChipsModule,
  ],
  templateUrl: './info-bar.component.html',
  styleUrls: ['./info-bar.component.scss'],
})
export class InfoBarComponent {
  loggedInPerson: ApiPerson | null = null; // Accept null
  username =   '';
  userDisplayName : string = '';
  version = '1.0.0.0-SNAPSHOT';
  currentDate = new Date();

  environmentName = environment.environment;
  apiUrl = environment.apiUrl;
  debugMode = environment.debugMode;
  showDebug = environment.debugMode;

  constructor(private personenService : PersonenService) {
  }

  ngOnInit(): void {
     this.loggedInPerson = this.personenService.getCurrentUser();
    console.log('ngOnInit-InfoBarComponent', this.loggedInPerson);
    this.username = this.loggedInPerson?.vorname + ' ' + this.loggedInPerson?.nachname;
    this.userDisplayName =  this.username + ' (' +  (this.loggedInPerson?.portalUser ?? '') + ')';

  }




}
