import { Injectable } from '@angular/core';
import { Router, CanActivate} from '@angular/router';
import { StorageService, AlertService } from '../_services';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
    constructor(
        private router: Router,
        private storage: StorageService,
        private alert: AlertService
    ) {}

    canActivate() {
        let usr : any = this.storage.getUser();
        const currentUser = (usr) ? JSON.parse(usr) : null;
        if (currentUser && Object.keys(currentUser).length !== 0) {
            if(currentUser.role==='admin'){
                // authorised so return true
                return true;
            }else{
                this.router.navigate(['/']);
                this.alert.error('Invalid Access');
                return false;
            }
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login']);
        this.alert.error('Login required to access this page');
        //this.router.navigate(['/'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}