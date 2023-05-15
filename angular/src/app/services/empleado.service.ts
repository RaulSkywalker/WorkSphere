import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { empleadoModel } from '../models/empleado.model';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmpleadoService {
  private baseUrl = 'http://localhost:8000/api/';
  empleados = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    this.getEmpleados('');
  }

  public add(form: any) {
    return this.http.post(this.baseUrl + 'add', form);
  }

  public update(form: any) {
    return this.http.post(this.baseUrl + 'update', form);
  }

  public delete(id: any) {
    return this.http.delete(this.baseUrl + 'delete?id=' + id);
  }

  public getEmpleados(keys: any) {
    return this.http
      .post(this.baseUrl + 'show?keys=' + keys, null)
      .subscribe((res) => {
        var r: any = res;
        this.empleados.next(r.empleados);
      });
  }

  public getEmpleado(id: any) {
    return this.http.get(this.baseUrl + 'empleado/' + id);
  }
}
