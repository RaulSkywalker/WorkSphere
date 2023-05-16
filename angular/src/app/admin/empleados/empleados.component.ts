import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { departamentoModel } from 'src/app/models/departamento.model';
import { empleadoModel } from 'src/app/models/empleado.model';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { DepartamentoService } from 'src/app/services/departamento.service';

import toastr from 'toastr';
import jsPDF from 'jspdf';
import { HttpClient } from '@angular/common/http';
import { MensajeService } from 'src/app/services/mensaje.service';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css'],
})
export class EmpleadosComponent implements OnInit {
  private baseUrl = 'http://localhost:8000/api/';
  id: any;
  empleados: empleadoModel[] = [];
  departamentos: departamentoModel[] = [];
  anadirForm: FormGroup;
  modificarForm: FormGroup;
  idModificar: any;
  empleadoModificando: empleadoModel = new empleadoModel();
  empleadoSeleccionado: any = null;
  departamentoSeleccionado: any = {};
  mensajeForm: FormGroup;
  id_receptor: any;
  empleado: any = {};
  mensajes: any = [];
  currentPage = 1;
  pageSize = 5;
  totalPages: any;

  constructor(
    private empSer: EmpleadoService,
    private deptSer: DepartamentoService,
    private menSer: MensajeService,
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.idModificar = 0;
    this.anadirForm = new FormGroup({
      nombre: new FormControl('', Validators.required),
      apellido: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      telefono: new FormControl(''),
      fecha_nacim: new FormControl(''),
      fecha_incorp: new FormControl(''),
      departamento: new FormControl(''),
    });

    this.modificarForm = this.fb.group({
      unombre: ['', Validators.required],
      uapellido: ['', Validators.required],
      uemail: ['', [Validators.required, Validators.email]],
      utelefono: ['', [Validators.required, Validators.pattern('[0-9]{9}')]],
      ufecha_nacim: [''],
      ufecha_incorp: [''],
      udepartamento: ['', Validators.required],
    });

    this.mensajeForm = new FormGroup({
      mensaje: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.empSer.empleados.subscribe((res) => {
      this.empleados = res;
      this.totalPages = Math.ceil(this.empleados.length / this.pageSize);
      this.paginateEmployees();
    });
    this.id = localStorage.getItem('userid');
  }

  buscar(input: any) {
    this.empSer.getEmpleados(input);
  }

  anadir() {
    const formdata = new FormData();
    formdata.append('nombre', this.anadirForm.get('nombre')?.value);
    formdata.append('apellido', this.anadirForm.get('apellido')?.value);
    formdata.append('email', this.anadirForm.get('email')?.value);
    formdata.append('telefono', this.anadirForm.get('telefono')?.value);
    formdata.append('fecha_nacim', this.anadirForm.get('fecha_nacim')?.value);
    formdata.append('fecha_incorp', this.anadirForm.get('fecha_incorp')?.value);
    formdata.append(
      'id_departamento',
      this.anadirForm.get('departamento')?.value
    );
    this.empSer.add(formdata).subscribe(
      (res) => {
        this.empSer.getEmpleados('');

        document.getElementById('AddModal')?.classList.remove('show');
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('padding-right');
        const modalBackdrop =
          document.getElementsByClassName('modal-backdrop')[0];
        modalBackdrop.parentNode?.removeChild(modalBackdrop);

        toastr.success('Empleado agregado con éxito');
      },
      (error) => {
        console.log(error);

        toastr.error('Error al agregar al empleado');
      }
    );
  }

  seleccionarModificar(id: any) {
    this.idModificar = id;
    this.empleados.forEach((e) => {
      if (id == e.id) {
        this.modificarForm.setValue({
          unombre: e.nombre,
          uapellido: e.apellido,
          uemail: e.email,
          utelefono: e.telefono,
          ufecha_nacim: e.fecha_nacim,
          ufecha_incorp: e.fecha_incorp,
          udepartamento: e.id_departamento,
        });
      }
    });
  }

  modificar() {
    const formData = new FormData();
    formData.append('id', this.idModificar);
    formData.append('nombre', this.modificarForm.get('unombre')?.value);
    formData.append('apellido', this.modificarForm.get('uapellido')?.value);
    formData.append('email', this.modificarForm.get('uemail')?.value);
    formData.append('telefono', this.modificarForm.get('utelefono')?.value);
    formData.append(
      'fecha_nacim',
      this.modificarForm.get('ufecha_nacim')?.value
    );
    formData.append(
      'fecha_incorp',
      this.modificarForm.get('ufecha_incorp')?.value
    );
    formData.append(
      'id_departamento',
      this.modificarForm.get('udepartamento')?.value
    );

    this.empSer.update(formData).subscribe(
      () => {
        this.empSer.getEmpleados('');

        document.getElementById('UpdateModal')?.classList.remove('show');
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('padding-right');
        const modalBackdrop =
          document.getElementsByClassName('modal-backdrop')[0];
        modalBackdrop.parentNode?.removeChild(modalBackdrop);

        toastr.success('Empleado modificado con éxito');
      },
      (error) => {
        console.log(error);
        toastr.error('Error al modificar el empleado');
      }
    );
  }

  seleccionarEliminar(id: any) {
    this.idModificar = id;
  }

  confirmarBorrado() {
    this.empSer.delete(this.idModificar).subscribe(
      () => {
        this.empSer.getEmpleados('');

        document.getElementById('DeleteModal')?.classList.remove('show');
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('padding-right');
        const modalBackdrop =
          document.getElementsByClassName('modal-backdrop')[0];
        modalBackdrop.parentNode?.removeChild(modalBackdrop);

        toastr.success('Empleado eliminado con éxito');
      },
      (error) => {
        console.log(error);

        toastr.error('Error al eliminar el empleado');
      }
    );
  }

  mostrarDetalles(id: any) {
    this.empSer.getEmpleado(id).subscribe((datos: any) => {
      this.empleado = datos;
    });
  }

  mostrar(id: number) {
    this.empleado = null;
    this.http.get(`${this.baseUrl}empleado/${id}`).subscribe((data: any) => {
      this.empleado = data;
      this.http
        .get(`${this.baseUrl}departamento/${this.empleado.id_departamento}`)
        .subscribe((departamento: any) => {
          this.empleado.nombre_dep = `${departamento.nombre_departamento}`;
        });
    });
  }

  generarPDF(empleados: any[]) {
    const doc = new jsPDF();
    const title = 'Listado de empleados';

    for (let i = 0; i < empleados.length; i++) {
      const empleado = empleados[i];
      const content = [
        { text: 'ID: ', style: 'bold' },
        { text: empleado.id },
        '\n',
        { text: 'Nombre del empleado: ', style: 'bold' },
        { text: empleado.nombre },
        '\n',
        { text: 'Apellidos del empleado: ', style: 'bold' },
        { text: empleado.apellido },
        '\n',
        { text: 'Email del empleado: ', style: 'bold' },
        { text: empleado.email },
        '\n',
        { text: 'Teléfono del empleado: ', style: 'bold' },
        { text: empleado.telefono },
        '\n',
        { text: 'Fecha de nacimiento del empleado: ', style: 'bold' },
        { text: empleado.fecha_nacim },
        '\n',
        { text: 'Fecha de incorporación a la empresa: ', style: 'bold' },
        { text: empleado.fecha_incorp },
        '\n',
        { text: 'Departamento del cual forma parte: ', style: 'bold' },
        { text: empleado.id_departamento },
        '\n',
      ];

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(title, 20, 20);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text(
        content
          .map((item) => (typeof item === 'object' ? item.text : item))
          .join(''),
        20,
        30
      );

      // Añade una nueva página para la siguiente denuncia
      if (i < empleados.length - 1) {
        doc.addPage();
      }
    }

    doc.save(title + '.pdf');
  }

  mostrarChat(id_usuario: number) {
    this.id_receptor = id_usuario + 1;
    this.http
      .get(`${this.baseUrl}empleado/${id_usuario}`)
      .subscribe((data: any) => {
        this.empleado = data;
      });
    this.obtenerMensajes(this.id, this.id_receptor);
    this.cdr.detectChanges();
  }

  enviarMensaje() {
    const mensaje = this.mensajeForm.value.mensaje;
    const autor = this.id;
    const usuario = this.id_receptor;
    const url = `http://localhost:8000/api/addMensaje/${autor}/${usuario}`;

    this.http.post(url, { mensaje }).subscribe(() => {
      this.obtenerMensajes(autor, usuario);
      this.cdr.detectChanges();
    });
    this.mensajeForm.reset();
    this.cdr.detectChanges();
  }

  obtenerMensajes(id_autor: any, id_usuario: any) {
    id_autor = this.id;
    id_usuario = this.id_receptor;
    this.menSer.obtenerMensajes(id_autor, id_usuario).subscribe((data: any) => {
      this.mensajes = data;
      this.cdr.detectChanges();
    });
  }

  generatePageArray() {
    const pageArray = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pageArray.push(i);
    }
    return pageArray;
  }

  paginateEmployees(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.empleados = this.empleados.slice(startIndex, endIndex);
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.paginateEmployees();
  }
}
