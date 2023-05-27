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
  gerenteForm: FormGroup;
  idEditar: any;
  departamentoSeleccionado: any = null;
  departamento: any = {};
  empleados: empleadoModel[] = [];

  constructor(
    private deptSer: DepartamentoService,
    private empSer: EmpleadoService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.idEditar = 0;

    this.gerenteForm = this.fb.group({
      id_gerente: ['', Validators.required],
    });
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
   * También va a la tabla de empleados y trae el nombre del gerente del departamento.
   * @param id 
   */
  mostrar(id: number) {
    this.departamento = null;
    this.http
      .get(`${this.baseUrl}departamento/${id}`)
      .subscribe((data: any) => {
        this.departamento = data;
        this.http
          .get(`${this.baseUrl}empleado/${this.departamento.id_gerente}`)
          .subscribe((gerente: any) => {
            this.departamento.gerente_nombre = `${gerente.nombre} ${gerente.apellido}`;
          });
      });
  }

  /**
   * Este método recoge el id del departamento en el que se ha pulsado el botón y se lo 
   * asigna a una variable para ser usado en el método de asignar un gerente.
   * @param id 
   */
  asignarGerente(id: any) {
    this.idEditar = id;
  }

  /**
   * Este método se encarga de cambiar o asignar un nuevo gerente al departamento,
   * el gerente en cuestión viene desde la tabla de empleados.
   */
  asignacion() {
    const formData = new FormData();
    formData.append('id', this.idEditar);
    formData.append('id_gerente', this.gerenteForm.get('id_gerente')?.value);

    this.deptSer.gerente(formData).subscribe(() => {
      console.log(formData);
      this.deptSer.getDepartamentos('');
    });
  }
}
