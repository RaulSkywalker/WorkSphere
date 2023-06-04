<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EmpleadoController extends Controller
{
    /**
     * Función encargada de eliminar a un empleado de la base de datos, y al usuario asociado al empleado.
     */
    public function eliminarEmpleado(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['Error' => $validator->errors()->all()], 404);
        }
        $empleado = Empleado::find($request->id)->delete();
        $user = User::find($request->id + 1)->delete();
        return response()->json(['Mensaje' => 'Empleado eliminado correctamente']);
    }

    /**
     * Función que devuelve una lista con todos los empleados de la base de datos.
     */
    public function mostrarEmpleados(Request $request)
    {
        session(['keys' => $request->keys]);
        $empleados = Empleado::where(function ($query) {
            $query->where('empleados.id', 'LIKE', '%' . session('keys') . '%')
                ->orwhere('empleados.nombre', 'LIKE', '%' . session('keys') . '%')
                ->orwhere('empleados.apellido', 'LIKE', '%' . session('keys') . '%')
                ->orwhere('empleados.email', 'LIKE', '%' . session('keys') . '%')
                ->orwhere('empleados.telefono', 'LIKE', '%' . session('keys') . '%')
                ->orwhere('empleados.fecha_nacim', 'LIKE', '%' . session('keys') . '%')
                ->orwhere('empleados.fecha_incorp', 'LIKE', '%' . session('keys') . '%')
                ->orwhere('empleados.id_departamento', 'LIKE', '%' . session('keys') . '%');
        })->select('empleados.*')->get();
        return response()->json(['empleados' => $empleados]);
    }

    /**
     * Esta función devuelve un empleado cuyo id se ha enviado por parámetro.
     */
    public function getEmpleado($id)
    {
        $empleado = Empleado::findOrFail($id);
        return response()->json($empleado);
    }
}
