import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate{

  constructor(private authS:AuthService, private route:Router) { }
  /**
   * Método que protege las rutas para el acceso en usuarios no registrados
   * @param route 
   * @param state 
   * @returns 
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> |Promise<boolean | UrlTree> {
    let result= this.authS.isLogged();
    if(result){
      return true;
    }else{
      this.route.navigate(['login']);
      return false;
    }
  }
}
