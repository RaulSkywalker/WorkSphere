import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { departamentoModel } from '../models/departamento.model';
import { BehaviorSubject, tap } from 'rxjs';
import { Observable } from 'rxjs';
import { empleadoModel } from '../models/empleado.model';



@Injectable({
  providedIn: 'root',
})
export class DepartamentoService {
  private baseUrl = 'http://localhost:8000/api/';

  departamentos = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    this.getDepartamentos('');
  }

  public update(form: any) {
    return this.http.post(this.baseUrl + 'updateD', form);
  }

  public getDepartamentos(keys: any) {
    return this.http
      .post(this.baseUrl + 'getDs?keys=' + keys, null)
      .subscribe((res) => {
        var r: any = res;
        this.departamentos.next(r.departamentos);
      });
  }

  public getDepartamento(id: any) {
    return this.http.get(this.baseUrl + 'departamento/' + id);
  }

  public gerente(form: any) {
    return this.http.post(this.baseUrl + 'gerente', form);
  }
}
