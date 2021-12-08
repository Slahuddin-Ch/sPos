import { Injectable } from '@angular/core';
import { Router, CanActivate} from '@angular/router';
import { StorageService, AlertService } from '../_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private storage: StorageService,
        private alert: AlertService
    ) {}

    canActivate() {
        const currentUser = this.storage.getUser();
        if (currentUser && Object.keys(currentUser).length !== 0) {
            // authorised so return true
            return true;
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login']);
        this.alert.error('Login required to access this page');
        //this.router.navigate(['/'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}