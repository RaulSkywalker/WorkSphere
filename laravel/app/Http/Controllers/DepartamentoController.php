<?php

namespace App\Http\Controllers;

use App\Models\Departamento;
use App\Models\Empleado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;


class DepartamentoController extends Controller
{
    /**
     * Función encargada de mostrar todos los departamentos que hay en la base de datos.
     */
    public function mostrarDepartamentos(Request $request)
    {
        session(['keys' => $request->keys]);
        $departamentos = Departamento::where(function ($query) {
            $query->where('departamentos.id', 'LIKE', '%' . session('keys') . '%')
                ->orwhere('departamentos.nombre_departamento', 'LIKE', '%' . session('keys') . '%')
                ->orwhere('departamentos.descripcion', 'LIKE', '%' . session('keys') . '%')
                ->orwhere('departamentos.id_gerente', 'LIKE', '%' . session('keys') . '%');
        })->select('departamentos.*')->get();
        return response()->json(['departamentos' => $departamentos]);
    }

    /**
     * Función que busca un departamento según su id, y devuelve sus datos.
     */
    public function getDepartamento($id)
    {
        $departamento = Departamento::findOrFail($id);
        return response()->json($departamento);
    }

    /**
     * Función que devuelve una lista de todos los empleados 
     * que pertenecen a un determinado departamento.
     */
    public function obtenerEmpleadosPorDepartamento($id)
    {
        $empleados = Empleado::where('id_departamento', $id)->get();
        return response()->json(['empleados' => $empleados]);
    }
}
