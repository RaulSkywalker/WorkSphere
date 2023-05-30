<?php

namespace App\Http\Controllers;

use App\Models\Tarea;
use Illuminate\Http\Request;

class TareaController extends Controller
{
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

    public function getTareas()
    {
        $tareas = Tarea::all();

        return response()->json($tareas);
    }

    public function getTareasByEmpleado($id_empleado)
    {
        $tareas = Tarea::where('id_empleado', $id_empleado)->get();

        return response()->json($tareas);
    }

    public function getTareaById($id)
    {
        $tarea = Tarea::find($id);

        if (!$tarea) {
            return response()->json(['message' => 'Tarea no encontrada'], 404);
        }

        return response()->json($tarea);
    }

    public function updateTarea(Request $request, $id)
    {
        $tarea = Tarea::find($id);

        if (!$tarea) {
            return response()->json(['message' => 'Tarea no encontrada'], 404);
        }

        $tarea->titulo_tarea = $request->input('titulo_tarea');
        $tarea->descripcion_tarea = $request->input('descripcion_tarea');
        $tarea->fecha_vencim = $request->input('fecha_vencim');
        $tarea->estado = $request->input('estado');
        $tarea->id_empleado = $request->input('id_empleado');
        $tarea->save();

        return response()->json(['message' => 'Tarea actualizada exitosamente'], 200);
    }

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
