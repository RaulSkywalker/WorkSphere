<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EmpleadoController extends Controller
{
    public function anadirEmpleado(Request $request){
        $validator = Validator::make($request->all(),[
            'nombre'=>'required',
            'apellido'=>'required',
            'email'=>'required',
            'telefono'=>'required',
            'fecha_nacim'=>'required',
            'fecha_incorp'=>'required',
            'id_departamento'=>'required',
        ]);
        if($validator->fails()){
            return response()->json(['error'=>$validator->errors()->all(),409]);
        }
        $empleado = new Empleado();
        $empleado->nombre=$request->nombre;
        $empleado->apellido=$request->apellido;
        $empleado->email=$request->email;
        $empleado->telefono=$request->telefono;
        $empleado->fecha_nacim=$request->fecha_nacim;
        $empleado->fecha_incorp=$request->fecha_incorp;
        $empleado->id_departamento=$request->id_departamento;
        $empleado->save();
    }

    public function modificarEmpleado(Request $request){
        $validator=Validator::make($request->all(),[
            'id'=>'required',
            'nombre'=>'required',
            'apellido'=>'required',
            'email'=>'required',
            'telefono'=>'required',
            'fecha_nacim'=>'required',
            'fecha_incorp'=>'required',
            'id_departamento'=>'required',
        ]);
        if($validator->fails()){
            return response()->json(['Error'=>$validator->errors()->all()], 404);
        }
        $empleado = Empleado::find($request->id);
        $empleado->nombre=$request->nombre;
        $empleado->apellido=$request->apellido;
        $empleado->email=$request->email;
        $empleado->telefono=$request->telefono;
        $empleado->fecha_nacim=$request->fecha_nacim;
        $empleado->fecha_incorp=$request->fecha_incorp;
        $empleado->id_departamento=$request->id_departamento;
        $empleado->save();
        return response()->json(['Mensaje'=>'Empleado actualizado correctamente']);
    }

    public function eliminarEmpleado(Request $request){
        $validator=Validator::make($request->all(),[
            'id'=>'required',
        ]);
        if($validator->fails()){
            return response()->json(['Error'=>$validator->errors()->all()], 404);
        }
        $empleado = Empleado::find($request->id)->delete();
        $user = User::find($request->id+1)->delete();
        return response()->json(['Mensaje'=>'Empleado eliminado correctamente']);
    }

    public function mostrarEmpleados(Request $request){
        session(['keys'=>$request->keys]);
        $empleados=Empleado::where(function ($query){
            $query->where('empleados.id','LIKE','%'.session('keys').'%')
            ->orwhere('empleados.nombre','LIKE','%'.session('keys').'%')
            ->orwhere('empleados.apellido','LIKE','%'.session('keys').'%')
            ->orwhere('empleados.email','LIKE','%'.session('keys').'%')
            ->orwhere('empleados.telefono','LIKE','%'.session('keys').'%')
            ->orwhere('empleados.fecha_nacim','LIKE','%'.session('keys').'%')
            ->orwhere('empleados.fecha_incorp','LIKE','%'.session('keys').'%')
            ->orwhere('empleados.id_departamento','LIKE','%'.session('keys').'%');
        })->select('empleados.*')->get();
        return response()->json(['empleados'=>$empleados]);
    }

    public function getEmpleado($id)
{
    $empleado = Empleado::findOrFail($id);
    return response()->json($empleado);
}

}
