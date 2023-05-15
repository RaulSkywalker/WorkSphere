import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { departamentoModel } from 'src/app/models/departamento.model';
import { empleadoModel } from 'src/app/models/empleado.model';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import toastr from 'toastr';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.css'],
})
export class DepartamentosComponent implements OnInit {
  departamentos: departamentoModel[] = [];
  gerenteForm: FormGroup;
  idEditar: any;
  departamentoSeleccionado: any = null;
  departamento: any = {};
  private baseUrl = 'http://localhost:8000/api/';
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

  mostrarDeps(id: any) {
    this.deptSer.getDepartamento(id).subscribe((datos: any) => {
      this.departamento = datos;
    });
  }

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

  asignarGerente(id: any) {
    this.idEditar = id;
  }

  asignacion() {
    const formData = new FormData();
    formData.append('id', this.idEditar);
    formData.append('id_gerente', this.gerenteForm.get('id_gerente')?.value);

    this.deptSer.gerente(formData).subscribe(() => {
      console.log(formData);
      this.deptSer.getDepartamentos('');
    })
  }
}
