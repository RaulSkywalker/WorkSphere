<?php

namespace App\Http\Controllers;

use App\Models\Mensaje;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class MensajeController extends Controller
{
    public function agregarMensaje(Request $request, $id_autor, $id_usuario)
    {
        $mensaje = new Mensaje();
        $mensaje->mensaje = $request->input('mensaje');
        $mensaje->id_autor = $id_autor;
        $mensaje->id_usuario = $id_usuario;
        $mensaje->save();
    }

    public function obtenerMensajes($id_autor, $id_usuario) {
    $mensajes = DB::table('mensajes')
                ->where('id_autor', $id_autor)
                ->where('id_usuario', $id_usuario)
                ->get();
    return response()->json($mensajes);
}

}
