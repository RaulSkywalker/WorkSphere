import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MensajeService {
  private baseUrl = 'http://localhost:8000/api/';
  mensajes = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  /**
   * Accede a la API para traer los mensajes del chat desde la base de datos.
   * @param id_autor 
   * @param id_usuario 
   * @returns mensajes
   */
  public obtenerMensajes(id_autor: any, id_usuario: any) {
    return this.http.get(
      this.baseUrl + 'getMensajes/' + id_autor + '/' + id_usuario
    );
  }
}
