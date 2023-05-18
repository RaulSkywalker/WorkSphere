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

        $url="http://localhost:8000/storage/";
        $file=$request->file('image');
        $extension = $file->getClientOriginalExtension();
        $path = $request->file('image')->storeAs('userimages/',$user->id.'.'.$extension);
        $user->image=$path;
        $user->imgpath=$url.$path;
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


    public function getUser($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

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

    public function mostrarUsuarios($id)
    {
        $users = DB::table('users')
            ->where('id', '!=', $id)
            ->get();

        return response()->json($users);
    }

    public function agregarAmigo($idUsuario, $idAmigo)
    {
        UserFriend::create([
            'user_id' => $idUsuario,
            'friend_id' => $idAmigo,
        ]);

        return response()->json(['Mensaje' => "Amigo agregado correctamente"]);
    }

    public function getUserFriends($user_id)
    {
        $friends = DB::table('user_friends')
            ->where('user_id', $user_id)
            ->join('users', 'user_friends.friend_id', '=', 'users.id')
            ->select('users.*')
            ->get();

        return $friends;
    }

    public function countUserFriends($user_id)
    {
        $count = DB::table('user_friends')
            ->where('user_id', $user_id)
            ->count();

        return $count;
    }

    public function removeFriend($user_id, $friend_id)
{
    // Buscar la instancia del modelo UserFriend para eliminarla
    $userFriend = UserFriend::where('user_id', $user_id)
                            ->where('friend_id', $friend_id)
                            ->first();

    // Si se encontró la instancia, eliminarla
    if ($userFriend) {
        UserFriend::where('user_id', $user_id)
                  ->where('friend_id', $friend_id)
                  ->delete();
        return response()->json(['message' => 'Friendship deleted successfully']);
    } else {
        return response()->json(['message' => 'Friendship not found'], 404);
    }
}

}
