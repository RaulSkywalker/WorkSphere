import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DepartamentoService {
  private baseUrl = 'http://localhost:8000/api/';

  departamentos = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    this.getDepartamentos('');
  }

  /**
   * Accede a la API para traer los departamentos de la base de datos.
   * @param keys 
   * @returns departamentos
   */
  public getDepartamentos(keys: any) {
    return this.http
      .post(this.baseUrl + 'getDs?keys=' + keys, null)
      .subscribe((res) => {
        var r: any = res;
        this.departamentos.next(r.departamentos);
      });
  }

  /**
   * Accede a la API para traer un departamento del cual se ha especificado su id.
   * @param id 
   * @returns departamento
   */
  public getDepartamento(id: any) {
    return this.http.get(this.baseUrl + 'departamento/' + id);
  }

  /**
   * Accede a la API para cambiar el gerente del departamento.
   * @param form 
   */
  public gerente(form: any) {
    return this.http.post(this.baseUrl + 'gerente', form);
  }
}
