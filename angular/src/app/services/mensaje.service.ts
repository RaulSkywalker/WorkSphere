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

  public obtenerMensajes(id_autor: any, id_usuario: any) {
    return this.http.get(this.baseUrl + 'getMensajes/' + id_autor + '/' + id_usuario);
  }
}
