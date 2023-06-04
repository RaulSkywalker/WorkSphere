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
   * Accede a la API para traer todas las tareas de la base de datos.
   * @param keys
   * @returns departamentos
   */
  getTareas(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'getTareas');
  }

  /**
   * Accede a la API para traer una tarea de la cual se ha especificado su id.
   * @param id
   * @returns departamento
   */
  public getTarea(id: any) {
    return this.http.get(this.baseUrl + 'getTarea/' + id);
  }

  /**
   * Accede a la API para traer todas las tareas que tiene asignadas un empleado.
   * @param id
   * @returns
   */
  public getTareasByEmpleado(id: any) {
    return this.http.get(this.baseUrl + 'getTareas/' + id);
  }

  /**
   * Accede a la API para agregar una nueva tarea.
   * @param form
   */
  public addTarea(form: any) {
    return this.http.post(this.baseUrl + 'addTarea', form);
  }

  /**
   * Accede a la API para editar los detalles de una tarea.
   * @param id
   * @param form
   */
  public updateTarea(id: any, form: any) {
    return this.http.post(this.baseUrl + 'updateTarea/' + id, form);
  }

  /**
   * Accede a la API para modificar el estado de una tarea.
   * @param id
   * @param form
   */
  public changeStatus(id: any, form: any) {
    return this.http.post(this.baseUrl + 'changeStatus/' + id, form);
  }

  /**
   * Accede a la API para eliminar una tarea.
   * @param id
   */
  public deleteTarea(id: any) {
    return this.http.delete(this.baseUrl + 'deleteTarea/' + id);
  }
}
