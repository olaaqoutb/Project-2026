import {Component, inject} from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet} from '@angular/router';
import {CommonModule, DatePipe} from '@angular/common';
import {PersonService} from './services/person.service';
 import {DebugConfigComponent} from './components/debug-config/debug-config.component';
import {ApiPerson} from './models/ApiPerson';
import {HeaderComponent} from './components/header/header.component';
import {InfoBarComponent} from './components/info-bar/info-bar.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {PersonenService} from './services/personen.service';
import {LoadingService} from './services/loading.service';
import {ApiMussPdfLesen} from './models/ApiMussPdfLesen';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {PdfLesenDialogComponent} from './components/dialogs/pdf-lesen-dialog/pdf-lesen-dialog.component';
import {StatusPanelListComponent} from './components/status-panel/status-panel-list/status-panel-list.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    StatusPanelListComponent,
    DebugConfigComponent,
    CommonModule,
    HeaderComponent,
    InfoBarComponent,
    SidebarComponent,
    MatDialogModule

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent  {

  router = inject(Router);

  title = 'BMI - GETIT';
  currentDate : Date = new Date();
  personen: ApiPerson[] = [];
  loggedInPerson : ApiPerson = {};

  loadingService = inject(LoadingService);

  constructor(private personenService : PersonenService,
              private dialog: MatDialog) {
 }

  ngOnInit(): void {
    this.mussPdfLesenCheck();
  }

  mussPdfLesenCheck(){
    this.loadingService.mussPdfLesenCheck().subscribe({
      next: (response: ApiMussPdfLesen) => {
         if(response.mussPdfLesen){
            this.openPdfLesenDialog();
         }else{
           console.log('mussPdfLesenCheck - NOTHING to read from ', response.mussPdfLesen);
         }
       },
      error: (err) => {
        // Handle error
        console.error('Error:', err);
      },
      complete: () => {
        // Handle completion
        console.log('mussPdfLesenCheck-Complete');
      }
    });
  }


  openPdfLesenDialog(): void {
    const dialogRef = this.dialog.open(PdfLesenDialogComponent, {
      width: '450px',
      disableClose: false, // Allow closing with ESC or click outside
      data: {} // Pass any data if needed
    });


    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        // User clicked "Ja"
        this.onPdfLesenConfirmed();
      } else {
        // User clicked "Nein" or closed dialog
        console.log('User declined to read PDF');
      }
    });
  }

  onPdfLesenConfirmed(): void {
    console.log('User wants to read PDF');
    this.loadingService.hatInfoPdfGelesen().subscribe();
  }

  loadLoggedInPerson(): void {
    this.personenService.loadLoggedInPerson().subscribe((data) => {
      console.log(data);
      this.loggedInPerson  = data;
    });
  }

}
