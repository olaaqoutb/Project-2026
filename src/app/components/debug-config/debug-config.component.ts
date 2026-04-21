import {Component, OnInit} from '@angular/core';
 import {CommonModule} from '@angular/common';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-debug-config',
  imports: [CommonModule],
  templateUrl: './debug-config.component.html',
  styleUrl: './debug-config.component.scss'
})
export class DebugConfigComponent implements OnInit {

  environmentName = environment.environment;
  apiUrl = environment.apiUrl;
  debugMode = environment.debugMode;
  showDebug = environment.debugMode;

  ngOnInit() {
    console.log('Environment-Vars:', environment);
  }


}
