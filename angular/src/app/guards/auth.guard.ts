import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  /**
   * Este guard es el encargado de comprobar si un usuario ha iniciado sesión,
   * y por tanto, puede acceder al resto de la aplicación. Si no es el caso, 
   * se le devueve a la página inicial para que se identifique.
   * @returns activated
   */
  canActivate(): boolean {
    if (localStorage.getItem('user')) {
      return true;
    } else {
      this.router.navigateByUrl('');
      return false;
    }
  }
}
