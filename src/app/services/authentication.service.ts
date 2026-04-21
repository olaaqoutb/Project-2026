import { Injectable } from '@angular/core';
import {ApiRolle} from '../models/ApiRolle';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserRoles: string[] = [];

  constructor() {
    this.loadUserRoles();
  }

  private loadUserRoles() {
     const roles = localStorage.getItem('userRoles');
    console.log('Roles', roles);

    if (roles) {
      this.currentUserRoles = JSON.parse(roles);
    }
  }

  getUserRoles(): string[] {
    return this.currentUserRoles;
  }

  hasRole(role: ApiRolle): boolean {
    const roleKey = this.getApiRolleKeyFromValue(role);
    return roleKey ? this.currentUserRoles.includes(roleKey) : false;
  }

  hasAnyRole(roles: ApiRolle[]): boolean {
    return roles.some(role => {
      const roleKey = this.getApiRolleKeyFromValue(role);
      console.log('Converting:', role, '→', roleKey);
      return roleKey ? this.currentUserRoles.includes(roleKey) : false;
    });
  }

  // Helper for PROJECT_OFFICE role (for upload)
  canUploadTelefonliste(): boolean {
    return this.hasRole(ApiRolle.ADMIN_PROJECT_OFFICE);
  }

  // Helper for read access
  canViewReports(): boolean {
    return this.hasAnyRole([
      ApiRolle.PROJECT_OFFICE,
      ApiRolle.PROJECT_OFFICE_READ_ONLY,
      ApiRolle.ADMIN_PROJECT_OFFICE,
      ApiRolle.ADMIN_LEITER
    ]);
  }

  getApiRolleKeyFromValue(value: string): string | undefined {
    if (!value) {
      return undefined;
    }
    const entry = Object.entries(ApiRolle).find(([key, val]) => val === value);
    return entry ? entry[0] : undefined;
  }

}
