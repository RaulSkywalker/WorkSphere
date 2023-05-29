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

  /**
   * Realiza el inicio de sesión del usuario.
   * @param form 
   * @returns 
   */
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

  /**
   * Registra un nuevo usuario, lo crea, y también crea un nuevo empleado.
   * @param form
   * @returns 
   */
  public register(form: any) {
    return this.http.post(this.baseUrl + 'register', form);
  }

  /**
   * Trae los datos de un usuario, proporcionando su id.
   * @param id 
   * @returns 
   */
  public getUser(id: any) {
    return this.http.get(this.baseUrl + 'user/' + id);
  }

  /**
   * Actualiza los datos de un usuario.
   * @param form 
   * @returns 
   */
  public updateUser(form: any) {
    return this.http.post(this.baseUrl + 'updateUser', form);
  }

  /**
   * Elimina a un usuario, y al empleado asociado a la cuenta.
   * @param id 
   * @returns 
   */
  public deleteUser(id: any) {
    return this.http.delete(this.baseUrl + 'deleteUser?id=' + id);
  }

  /**
   * Trae una lista con todos los usuarios de la base de datos.
   * @param id 
   * @returns 
   */
  public mostrarUsuarios(id: any) {
    return this.http.get(this.baseUrl + 'users/' + id);
  }

  /**
   * Al proporcionar el id del usuario actual, y el del usuario que va a ser 
   * su amigo, y añade dicha relación a la base de datos.
   * @param idUsuario 
   * @param idAmigo 
   * @returns 
   */
  public agregarAmigo(idUsuario: number, idAmigo: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}users/${idUsuario}/friends/${idAmigo}`,
      {}
    );
  }

  /**
   * Obtiene la lista de todos los amigos del usuario.
   * @param idUsuario 
   * @returns 
   */
  public obtenerAmigos(idUsuario: number) {
    return this.http.get(`${this.baseUrl}user/${idUsuario}/friends`);
  }

  /**
   * Realiza un conteo del numero de amigos que tiene un usuario.
   * @param idUsuario 
   * @returns 
   */
  public contarNumAmigos(idUsuario: number) {
    return this.http.get(`${this.baseUrl}user/${idUsuario}/friends/count`);
  }

  /**
   * Elimina una relación de amistad entre dos usuarios.
   * @param idUsuario 
   * @param idAmigo 
   * @returns 
   */
  public eliminarAmigo(idUsuario: number, idAmigo: number) {
    return this.http.delete(
      `${this.baseUrl}user/${idUsuario}/friends/${idAmigo}/delete`
    );
  }
}
