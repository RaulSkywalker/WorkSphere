import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import toastr from 'toastr';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private router: Router) {}
  private baseUrl = 'http://localhost:8000/api/';

  public login(form: any) {
    return this.http.post(this.baseUrl + 'login', form).subscribe((res) => {
      var r: any = res;
      localStorage.setItem('user', r.user);
      localStorage.setItem('userid', r.user.id);
      toastr.success('¡Sesión iniciada con éxito!');
      if (r.role === 'admin') {
        this.router.navigateByUrl('admin/inicio');
      } else if (r.role === 'empleado') {
        this.router.navigateByUrl('empleado/inicio');
      }
    });
  }

  public register(form: any) {
    return this.http.post(this.baseUrl + 'register', form);
  }

  public getUser(id: any) {
    return this.http.get(this.baseUrl + 'user/' + id);
  }

  public deleteUser(id: any) {
    return this.http.delete(this.baseUrl + 'deleteUser?id=' + id);
  }

  public mostrarUsuarios(id: any) {
    return this.http.get(this.baseUrl + 'users/' + id);
  }

  public agregarAmigo(idUsuario: number, idAmigo: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}users/${idUsuario}/friends/${idAmigo}`,
      {}
    );
  }

  public obtenerAmigos(idUsuario: number) {
    return this.http.get(`${this.baseUrl}user/${idUsuario}/friends`);
  }

  public contarNumAmigos(idUsuario: number) {
    return this.http.get(
      `${this.baseUrl}user/${idUsuario}/friends/count`
    );
  }

  public eliminarAmigo(idUsuario: number, idAmigo: number) {
    return this.http.delete(`${this.baseUrl}user/${idUsuario}/friends/${idAmigo}/delete`);
  }
}
