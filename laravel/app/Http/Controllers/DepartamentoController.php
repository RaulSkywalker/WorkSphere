<?php

namespace App\Http\Controllers;

use App\Models\Departamento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;


class DepartamentoController extends Controller
{
    public function mostrarDepartamentos(Request $request){
        session(['keys'=>$request->keys]);
        $departamentos=Departamento::where(function ($query){
            $query->where('departamentos.id','LIKE','%'.session('keys').'%')
            ->orwhere('departamentos.nombre_departamento','LIKE','%'.session('keys').'%')
            ->orwhere('departamentos.descripcion','LIKE','%'.session('keys').'%')
            ->orwhere('departamentos.id_gerente','LIKE','%'.session('keys').'%');
        })->select('departamentos.*')->get();
        return response()->json(['departamentos'=>$departamentos]);
    }

    public function getDepartamento($id)
{
    $departamento = Departamento::findOrFail($id);
    return response()->json($departamento);
}

public function asignarGerente(Request $request){
        $validator=Validator::make($request->all(),[
            'id'=>'required',
            'id_gerente'=>'required',
        ]);
        $departamento = Departamento::find($request->id);
        $departamento->id_gerente=$request->id_gerente;
        $departamento->save();
}

}
