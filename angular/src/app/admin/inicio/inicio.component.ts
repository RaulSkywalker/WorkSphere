import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
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

  constructor(
    private tarSer: TareaService,
    private http: HttpClient,
    private fb: FormBuilder,
    private empSer: EmpleadoService
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
      },
      (error) => {
        console.log(error);
      }
    );
  }

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
          this.tareas = response;
          this.tarSer.getTareas().subscribe(
            (response) => {
              this.tareas = response;
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

  marcarParaEditar(id: any) {
    this.idSeleccionado = id;
  }

  fillEditForm(tarea: any): void {
    this.editForm.patchValue({
      title: tarea.titulo_tarea,
      description: tarea.descripcion_tarea,
      fecha_vencim: tarea.fecha_vencim,
      id_empleado: tarea.id_empleado,
    });
  }
  
  editarTarea() {
    const tareaId = this.idSeleccionado;
    const formData = new FormData();
    formData.append('titulo_tarea', this.editForm.get('title')?.value);
    formData.append(
      'descripcion_tarea',
      this.editForm.get('description')?.value
    );
    formData.append('fecha_vencim', this.editForm.get('fecha_vencim')?.value);
    formData.append('estado', 'No comenzada');
    formData.append('id_empleado', this.editForm.get('id_empleado')?.value);

    this.tarSer.updateTarea(tareaId, formData).subscribe(
        (response) => {
          this.tarSer.getTareas().subscribe(
            (response) => {
              this.tareas = response;
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

  marcarParaEliminar(id: any) {
    this.idSeleccionado = id;
  }

  eliminarTarea() {
    this.tarSer.deleteTarea(this.idSeleccionado).subscribe(
      () => {
        this.tarSer.getTareas().subscribe(
          (response) => {
            this.tareas = response;
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
}
