import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
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
  idEliminar: any;
  empleadoModificando: empleadoModel = new empleadoModel();
  empleadoSeleccionado: any = null;
  departamentoSeleccionado: any = {};
  mensajeForm: FormGroup;
  id_receptor: any;
  empleado: any = {};
  mensajes: any = [];
  paginaActual = 1;
  tamanioPag = 5;
  paginasTotales: any;

  constructor(
    private empSer: EmpleadoService,
    private deptSer: DepartamentoService,
    private menSer: MensajeService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.idEliminar = 0;
    this.mensajeForm = new FormGroup({
      mensaje: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.empSer.empleados.subscribe((res) => {
      this.empleados = res;
      this.paginasTotales = Math.ceil(this.empleados.length / this.tamanioPag);
      this.paginarEmpleados();
    });
    this.id = localStorage.getItem('userid');
  }

  /**
   * Este método se aplica a la barra de búsqueda para buscar por nombre de empleado.
   * @param input
   */
  buscar(input: any) {
    this.empSer.getEmpleados(input);
  }

  /**
   * Este método accede a la base de datos para traer todos los datos de un respectivo empleado.
   * También accede a la tabla de departamentos mediante las claves foráneas que las relacionan,
   * para poder traer el nombre del departamento.
   * @param id
   */
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

  /**
   * Asigna el id del empleado que se va a eliminar a una variable para ser usado en el método de eliminar.
   * @param id 
   */
  seleccionarEliminar(id: any) {
    this.idEliminar = id;
  }

  /**
   * Este método accede a la API para eliminar un empleado de la base de datos, 
   * y por consecuente, también su usuario.
   */
  confirmarBorrado() {
    this.empSer.delete(this.idEliminar).subscribe(
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

  /**
   * Este método toma el listado de empleados y genera un PDF con ellos, 
   * haciendo uso de la librería jsPDF.
   * @param empleados
   */
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

      if (i < empleados.length - 1) {
        doc.addPage();
      }
    }

    doc.save(title + '.pdf');
  }

  /**
   * Este método se encarga de mostrar el modal del chat con el usuario 
   * cuyo id se ha pasado por parámetro.
   * @param id_usuario 
   */
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

  /**
   * Este método envía un mensaje en el chat, especificando 
   * quién es el autor, y quién el receptor.
   */
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

  /**
   * Este método accede a la base de datos para traer todos los mensajes 
   * previos correspondientes a una determinada conversación del chat.
   * @param id_autor 
   * @param id_usuario 
   */
  obtenerMensajes(id_autor: any, id_usuario: any) {
    id_autor = this.id;
    id_usuario = this.id_receptor;
    this.menSer.obtenerMensajes(id_autor, id_usuario).subscribe((data: any) => {
      this.mensajes = data;
      this.cdr.detectChanges();
    });
  }

  /**
   * Este método se encarga de generar el numero de páginas total para la lista de empleados.
   * @returns paginas
   */
  generarPaginacion() {
    const paginas = [];
    for (let i = 1; i <= this.paginasTotales; i++) {
      paginas.push(i);
    }
    return paginas;
  }

  /**
   * Método encargado de realizar la paginación para el listado de empleados.
   */
  paginarEmpleados(): void {
    const inicio = (this.paginaActual - 1) * this.tamanioPag;
    const fin = inicio + this.tamanioPag;
    this.empleados = this.empleados.slice(inicio, fin);
  }

  /**
   * Método encargado de cambiar de página, y volver a paginar.
   * @param numPagina 
   */
  onCambioPagina(numPagina: number): void {
    this.paginaActual = numPagina;
    this.paginarEmpleados();
  }
}
