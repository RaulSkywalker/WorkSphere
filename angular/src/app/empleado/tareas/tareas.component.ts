import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TareaService } from 'src/app/services/tarea.service';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css'],
})
export class TareasComponent implements OnInit {
  id: any;
  tareas: any;
  tarea: any = {};
  idSeleccionado: any;
  editForm: FormGroup;

  constructor(
    private tarSer: TareaService,
    private http: HttpClient,
    private fb: FormBuilder) {
    this.editForm = this.fb.group({
      estado: [''],
    });
  }

  ngOnInit(): void {
    this.id = localStorage.getItem('userid');
    this.tarSer.getTareasByEmpleado(this.id - 1).subscribe(
      (response) => {
        this.tareas = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /**
   * Método encargado de traer todos los detalles de una tarea a la ventana modal.
   * @param id 
   */
  verDetallesTarea(id: any) {
    this.tarea = null;
    this.tarSer.getTarea(id).subscribe((response) => {
      this.tarea = response;
    });
  }

  /**
   * Establece el id de la tarea a la cual se le va a cambiar el estado, 
   * con el valor del id de la tarea en la que se ha pulsado el botón.
   */
  cambiarEstado(id: any) {
    this.idSeleccionado = id;
  }

  /**
   * Realiza el cambio del estado de la tarea.
   */
  confirmarEstado() {
    const tareaId = this.idSeleccionado;
    const formData = new FormData();
    formData.append('estado', this.editForm.get('estado')?.value);

    this.tarSer.changeStatus(tareaId, formData).subscribe(
      (response) => {
        this.tarSer.getTareasByEmpleado(this.id - 1).subscribe(
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

        toastr.success('Estado cambiado con éxito');
      },
      (error) => {
        console.log(error);

        toastr.error('Error al cambiar el estado de la tarea');
      }
    );
  }
}
