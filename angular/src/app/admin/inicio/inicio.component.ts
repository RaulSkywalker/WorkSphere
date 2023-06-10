import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { empleadoModel } from 'src/app/models/empleado.model';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { TareaService } from 'src/app/services/tarea.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
  tareas: any[] = [];
  tarea: any = {};
  addForm: FormGroup;
  editForm: FormGroup;
  empleados: empleadoModel[] = [];
  idSeleccionado: any;
  paginaActual = 1;
  tamanioPag = 5;
  paginasTotales: any;
  busqueda: string = '';
  tareasFiltradas: any[] = [];

  constructor(
    private tarSer: TareaService,
    private http: HttpClient,
    private fb: FormBuilder,
    private empSer: EmpleadoService,
    private cdr: ChangeDetectorRef
  ) {
    this.addForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      fecha_vencim: ['', Validators.required],
      id_empleado: ['', Validators.required],
    });

    this.editForm = this.fb.group({
      title: [''],
      description: [''],
      fecha_vencim: [''],
      id_empleado: [''],
    });
  }

  ngOnInit(): void {
    this.tarSer.tareas.subscribe((res) => {
      this.tareas = res;
    });
    this.empSer.empleados.subscribe((res) => {
      this.empleados = res;
    });
    this.tarSer.getTareas().subscribe(
      (response) => {
        this.tareas = response;
        this.tareasFiltradas = this.tareas;
        this.paginasTotales = Math.ceil(
          this.tareasFiltradas.length / this.tamanioPag
        );
        this.paginarTareas();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  /**
   * Método encargado de añadir una nueva tarea para un empleado.
   */
  addTarea() {
    const formData = new FormData();
    formData.append('titulo_tarea', this.addForm.get('title')?.value);
    formData.append(
      'descripcion_tarea',
      this.addForm.get('description')?.value
    );
    formData.append('fecha_vencim', this.addForm.get('fecha_vencim')?.value);
    formData.append('estado', 'No comenzada');
    formData.append('id_empleado', this.addForm.get('id_empleado')?.value);

    this.tarSer.addTarea(formData).subscribe(() => {
      this.tarSer.getTareas().subscribe(
        (response) => {
          this.tareasFiltradas = response;
          this.tarSer.getTareas().subscribe(
            (response) => {
              this.tareasFiltradas = response;
            },
            (error) => {
              console.log(error);
            }
          );
          document.getElementById('AddModal')?.classList.remove('show');
          document.body.classList.remove('modal-open');
          document.body.style.removeProperty('padding-right');
          const modalBackdrop =
            document.getElementsByClassName('modal-backdrop')[0];
          modalBackdrop.parentNode?.removeChild(modalBackdrop);

          toastr.success('Tarea creada con éxito');
        },
        (error) => {
          console.log(error);

          toastr.error('Error al crear la tarea');
        }
      );
    });
  }

  /**
   * Método encargado de traer todos los datos de la tarea en
   * la cual se ha clicado para ver sus detalles.
   * @param id
   */
  verDetallesTarea(id: any) {
    this.tarea = null;
    this.tarSer.getTarea(id).subscribe((response) => {
      this.tarea = response;
      this.empSer
        .getEmpleado(this.tarea.id_empleado)
        .subscribe((empleado: any) => {
          this.tarea.empleado_nombre = `${empleado.nombre} ${empleado.apellido}`;
        });
    });
  }

  /**
   * Señala una tarea para indicarle que se van a editar sus datos.
   * @param id
   */
  marcarParaEditar(id: any) {
    this.idSeleccionado = id;
  }

  /**
   * Trae los datos actuales de la tarea al formulario de edición.
   * @param tarea
   */
  fillEditForm(tarea: any): void {
    this.editForm.patchValue({
      title: tarea.titulo_tarea,
      description: tarea.descripcion_tarea,
      fecha_vencim: tarea.fecha_vencim,
      id_empleado: tarea.id_empleado,
    });
  }

  /**
   * Método encargado de modificar los datos de la tarea.
   */
  editarTarea() {
    const tareaId = this.idSeleccionado;
    const formData = new FormData();
    formData.append('titulo_tarea', this.editForm.get('title')?.value);
    formData.append(
      'descripcion_tarea',
      this.editForm.get('description')?.value
    );
    formData.append('fecha_vencim', this.editForm.get('fecha_vencim')?.value);
    formData.append('id_empleado', this.editForm.get('id_empleado')?.value);

    this.tarSer.updateTarea(tareaId, formData).subscribe(
      (response) => {
        this.tarSer.getTareas().subscribe(
          (response) => {
            this.tareasFiltradas = response;
          },
          (error) => {
            console.log(error);
          }
        );

        document.getElementById('EditModal')?.classList.remove('show');
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('padding-right');
        const modalBackdrop =
          document.getElementsByClassName('modal-backdrop')[0];
        modalBackdrop.parentNode?.removeChild(modalBackdrop);

        toastr.success('Tarea editada con éxito');
      },
      (error) => {
        console.log(error);

        toastr.error('Error al editar la tarea');
      }
    );
  }

  /**
   * Señala una tarea para indicarle que se va a ser eliminada.
   * @param id
   */
  marcarParaEliminar(id: any) {
    this.idSeleccionado = id;
  }

  /**
   * Método que procede a acceder a la API para eliminar la tarea.
   */
  eliminarTarea() {
    this.tarSer.deleteTarea(this.idSeleccionado).subscribe(
      () => {
        this.tarSer.getTareas().subscribe(
          (response) => {
            this.tareasFiltradas = response;
          },
          (error) => {
            console.log(error);
          }
        );

        document.getElementById('DeleteModal')?.classList.remove('show');
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('padding-right');
        const modalBackdrop =
          document.getElementsByClassName('modal-backdrop')[0];
        modalBackdrop.parentNode?.removeChild(modalBackdrop);

        toastr.success('Tarea eliminada con éxito');
      },
      (error) => {
        console.log(error);

        toastr.error('Error al eliminar la tarea');
      }
    );
  }

  /**
   * Método encargado de filtrar en la tabla, las tareas
   * según lo que se ha escrito en la barra de búsqueda.
   */
  buscar() {
    if (this.busqueda.trim() !== '') {
      this.tareasFiltradas = this.tareas.filter((tarea) =>
        tarea.titulo_tarea.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    } else {
      this.tareasFiltradas = this.tareas;
    }
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
  paginarTareas(): void {
    const inicio = (this.paginaActual - 1) * this.tamanioPag;
    const fin = inicio + this.tamanioPag;
    this.tareas = this.tareas.slice(inicio, fin);
  }

  /**
   * Método encargado de cambiar de página, y volver a paginar.
   * @param numPagina
   */
  onCambioPagina(numPagina: number): void {
    this.paginaActual = numPagina;
    this.paginarTareas();
  }
}
