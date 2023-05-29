import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TareaService {
  private baseUrl = 'http://localhost:8000/api/';

  tareas = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    this.getTareas();
  }

  /**
   * Accede a la API para traer los departamentos de la base de datos.
   * @param keys
   * @returns departamentos
   */
  getTareas(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'getTareas');
  }

  /**
   * Accede a la API para traer un departamento del cual se ha especificado su id.
   * @param id
   * @returns departamento
   */
  public getTarea(id: any) {
    return this.http.get(this.baseUrl + 'getTarea/' + id);
  }

  public getTareasByEmpleado(id: any) {
    return this.http.get(this.baseUrl + 'getTareas/' + id);
  }

  /**
   * Accede a la API para cambiar el gerente del departamento.
   * @param form
   */
  public addTarea(form: any) {
    return this.http.post(this.baseUrl + 'addTarea', form);
  }

  public updateTarea(id: any, form: any) {
    return this.http.post(this.baseUrl + 'updateTarea/' + id, form);
  }

  public deleteTarea(id: any) {
    return this.http.delete(this.baseUrl + "deleteTarea/" + id);
  }
}
