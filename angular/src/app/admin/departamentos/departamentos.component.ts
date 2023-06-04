import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { departamentoModel } from 'src/app/models/departamento.model';
import { empleadoModel } from 'src/app/models/empleado.model';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.css'],
})
export class DepartamentosComponent implements OnInit {
  private baseUrl = 'http://localhost:8000/api/';
  departamentos: departamentoModel[] = [];
  departamentoSeleccionado: any = null;
  departamento: any = {};
  empleados: empleadoModel[] = [];
  empleadosDelDepartamento: empleadoModel[] = [];

  constructor(
    private deptSer: DepartamentoService,
    private empSer: EmpleadoService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.deptSer.departamentos.subscribe((res) => {
      this.departamentos = res;
    });
    this.empSer.empleados.subscribe((res) => {
      this.empleados = res;
    });
  }

  /**
   * Este método trae todos los departamentos de la base de datos.
   * @param id 
   */
  mostrarDeps(id: any) {
    this.deptSer.getDepartamento(id).subscribe((datos: any) => {
      this.departamento = datos;
    });
  }

  /**
   * Este método trae los datos de un departamento, al que se le ha pasado su id por parámetro.
   * También trae todos los empleados que forman parte del departamento.
   * @param id 
   */
  mostrar(id: number) {
    this.departamento = null;
    this.http
      .get(`${this.baseUrl}departamento/${id}`)
      .subscribe((data: any) => {
        this.departamento = data;
        this.deptSer.obtenerEmpleadosDepartamento(id).subscribe((data: any) => {
          this.empleadosDelDepartamento = data.empleados;
          console.log(this.empleadosDelDepartamento);
        })
      });
  }

}
