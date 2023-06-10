<?php

namespace App\Http\Controllers;

use App\Models\Tarea;
use Illuminate\Http\Request;

class TareaController extends Controller
{
    /**
     * Función encargada de agregar una nueva tarea a la base de datos.
     */
    public function addTarea(Request $request)
    {
        $tarea = new Tarea;
        $tarea->titulo_tarea = $request->input('titulo_tarea');
        $tarea->descripcion_tarea = $request->input('descripcion_tarea');
        $tarea->fecha_vencim = $request->input('fecha_vencim');
        $tarea->estado = $request->input('estado');
        $tarea->id_empleado = $request->input('id_empleado');
        $tarea->save();

        return response()->json(['message' => 'Tarea creada exitosamente'], 201);
    }

    /**
     * Función que trae todas las tareas que se encuentran en la base de datos.
     */
    public function getTareas()
    {
        $tareas = Tarea::all();

        return response()->json($tareas);
    }

    /**
     * Función que trae todas las tareas asignadas a un empleado en concreto.
     */
    public function getTareasByEmpleado($id_empleado)
    {
        $tareas = Tarea::where('id_empleado', $id_empleado)->get();

        return response()->json($tareas);
    }

    /**
     * Función que trae una tarea según el id que se ha pasado por parámetro.
     */
    public function getTareaById($id)
    {
        $tarea = Tarea::find($id);

        if (!$tarea) {
            return response()->json(['message' => 'Tarea no encontrada'], 404);
        }

        return response()->json($tarea);
    }

    /**
     * Función que actualiza los datos de una tarea en la base de datos.
     */
    public function updateTarea(Request $request, $id)
    {
        $tarea = Tarea::find($id);

        if (!$tarea) {
            return response()->json(['message' => 'Tarea no encontrada'], 404);
        }

        $tarea->titulo_tarea = $request->input('titulo_tarea');
        $tarea->descripcion_tarea = $request->input('descripcion_tarea');
        $tarea->fecha_vencim = $request->input('fecha_vencim');
        $tarea->id_empleado = $request->input('id_empleado');
        $tarea->save();

        return response()->json(['message' => 'Tarea actualizada exitosamente'], 200);
    }

    /**
     * Esta función actualiza el estado de una tarea.
     */
    public function changeStatus(Request $request, $id)
    {
        $tarea = Tarea::find($id);

        if (!$tarea) {
            return response()->json(['message' => 'Tarea no encontrada'], 404);
        }

        $tarea->estado = $request->input('estado');
        $tarea->save();

        return response()->json(['message' => 'Tarea actualizada exitosamente'], 200);
    }

    /**
     * Función encargada de eliminar una tarea de la base de datos.
     */
    public function deleteTarea($id)
    {
        $tarea = Tarea::find($id);

        if (!$tarea) {
            return response()->json(['message' => 'Tarea no encontrada'], 404);
        }

        $tarea->delete();

        return response()->json(['message' => 'Tarea eliminada exitosamente'], 200);
    }
}
