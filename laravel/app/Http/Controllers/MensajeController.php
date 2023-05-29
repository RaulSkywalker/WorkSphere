<?php

namespace App\Http\Controllers;

use App\Models\Mensaje;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class MensajeController extends Controller
{
    /**
     * Esta función se encarga de "enviar" un mensaje, especificando 
     * quién es el autor, y quién el receptor.
     */
    public function agregarMensaje(Request $request, $id_autor, $id_usuario)
    {
        $mensaje = new Mensaje();
        $mensaje->mensaje = $request->input('mensaje');
        $mensaje->id_autor = $id_autor;
        $mensaje->id_usuario = $id_usuario;
        $mensaje->save();
    }

    /**
     * Función que se encarga de traer todo el historial previo del chat.
     */
    public function obtenerMensajes($id_autor, $id_usuario)
    {
        $mensajes = DB::table('mensajes')
            ->where(function ($query) use ($id_autor, $id_usuario) {
                $query->where('id_autor', $id_autor)
                    ->where('id_usuario', $id_usuario);
            })
            ->orWhere(function ($query) use ($id_autor, $id_usuario) {
                $query->where('id_autor', $id_usuario)
                    ->where('id_usuario', $id_autor);
            })
            ->get();
        return response()->json($mensajes);
    }
}
