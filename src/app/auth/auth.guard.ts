import { 
    CanActivate, 
    ActivatedRouteSnapshot, 
    RouterStateSnapshot,
    Router, 
    UrlTree 
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGaurd implements CanActivate {
    
    constructor( private authService: AuthService, 
                 private router: Router){}

    canActivate(route: ActivatedRouteSnapshot, 
                router: RouterStateSnapshot) :
                boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree>{
                    
        if (this.authService.getUserId()){
            return true;
        } else{
            return this.router.createUrlTree(['/auth'])
        }
    }
}