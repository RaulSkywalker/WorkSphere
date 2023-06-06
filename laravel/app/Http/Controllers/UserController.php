<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use App\Models\User;
use App\Models\UserFriend;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    /**
     * Función encargada del registro de un usuario.
     * Al registrar un usuario, también se crea un empleado en la base de datos.
     * Es la única forma de crear un empleado.
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|unique:users',
            'password' => 'required',
            'name' => 'required',
            'role',
            'image' => 'image'
        ]);
        if ($validator->fails()) {
            return response()->json(['Error' => $validator->errors()->all()], 404);
        }
        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->role = 'empleado';
        $user->save();

        $file = $request->file('image');
        $extension = $file->getClientOriginalExtension();
        $fileName = $user->id . '.' . $extension;
        $path = $request->file('image')->storeAs('userimages', $fileName);
        $user->image = $fileName;
        $user->imgpath = asset('storage/userimages/' . $fileName);
        $user->save();

        $empleado = new Empleado();
        $empleado->nombre = $request->name;
        $empleado->apellido = $request->apellido;
        $empleado->email = $request->email;
        $empleado->telefono = $request->telefono;
        $empleado->fecha_nacim = $request->fecha_nacim;
        $empleado->fecha_incorp = $request->fecha_incorp;
        $empleado->id_departamento = $request->id_departamento;
        $empleado->save();

        return response()->json(['Mensaje' => "Usuario registrado correctamente"]);
    }

    /**
     * Función encargada de validar el inicio de sesión del usuario.
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required',
            'password' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['Error' => $validator->errors()->all()], 404);
        }
        $user = User::where('email', $request->email)->first();
        if ($user && password_verify($request->password, $user->password)) {
            return response()->json(['user' => $user, 'role' => $user->role]);
        } else {
            return response()->json(['Error' => ["Email o contraseña incorrectos"]], 404);
        }
    }

    /**
     * Función que devuelve un usuario de la base de datos según el id que se pase por parámetro.
     */
    public function getUser($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    /**
     * Función que actualiza un usuario para cambiar su nombre o su imagen.
     */
    public function updateUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'name' => 'required',
            'image' => 'image'
        ]);
        if ($validator->fails()) {
            return response()->json(['Error' => $validator->errors()->all()], 404);
        }

        $user = User::find($request->id);
        $user->name = $request->name;
        $user->save();

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $extension = $file->getClientOriginalExtension();
            $fileName = $user->id . '.' . $extension;
            $path = $file->storeAs('userimages', $fileName);

            $user->image = $path;
            $user->imgpath = asset('storage/userimages/' . $fileName);
            $user->save();
        }

        return response()->json(['Mensaje' => 'Usuario actualizado correctamente']);
    }

    /**
     * Función encargada de eliminar un usuario de la base de datos, y por consecuente al empleado.
     */
    public function deleteUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['Error' => $validator->errors()->all()], 404);
        }
        User::find($request->id)->delete();
        Empleado::find($request->id - 1)->delete();
        return response()->json(['Mensaje' => 'Usuario eliminado correctamente']);
    }

    /**
     * Esta función trae a todos los usuarios de la base de datos, menos a uno que se especifique por parámetro.
     * Esto es para que en el listado de otros usuarios, el usuario actual no pueda verse a sí mismo.
     */
    public function mostrarUsuarios($id)
    {
        $users = DB::table('users')
            ->where('id', '!=', $id)
            ->get();

        return response()->json($users);
    }

    /**
     * Función encargada de entablar una amistad entre el usuario actual y otro.
     */
    public function agregarAmigo($idUsuario, $idAmigo)
    {
        UserFriend::create([
            'user_id' => $idUsuario,
            'friend_id' => $idAmigo,
        ]);

        return response()->json(['Mensaje' => "Amigo agregado correctamente"]);
    }

    /**
     * Función que trae todos los usuarios que el actual ha agregado cómo amigos.
     */
    public function getUserFriends($user_id)
    {
        $friends = DB::table('user_friends')
            ->where('user_id', $user_id)
            ->join('users', 'user_friends.friend_id', '=', 'users.id')
            ->select('users.*')
            ->get();

        return $friends;
    }

    /**
     * Función que realiza un recuento del número total de amigos del usuario.
     */
    public function countUserFriends($user_id)
    {
        $count = DB::table('user_friends')
            ->where('user_id', $user_id)
            ->count();

        return $count;
    }

    /**
     * Función encargada de eliminar una relación de amistad entre dos usuarios.
     */
    public function removeFriend($user_id, $friend_id)
    {
        $userFriend = UserFriend::where('user_id', $user_id)
            ->where('friend_id', $friend_id)
            ->first();

        if ($userFriend) {
            UserFriend::where('user_id', $user_id)
                ->where('friend_id', $friend_id)
                ->delete();
            return response()->json(['message' => 'Amistad eliminada correctamente']);
        } else {
            return response()->json(['message' => 'Amistad no encontrada'], 404);
        }
    }
}
