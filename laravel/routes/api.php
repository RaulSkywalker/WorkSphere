<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmpleadoController;
use App\Http\Controllers\DepartamentoController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MensajeController;
use App\Http\Controllers\TareaController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

/*Empleados*/
Route::post('add', [EmpleadoController::class, 'anadirEmpleado']);
Route::post('update', [EmpleadoController::class, 'modificarEmpleado']);
Route::delete('delete', [EmpleadoController::class, 'eliminarEmpleado']);
Route::post('show', [EmpleadoController::class, 'mostrarEmpleados']);
Route::get('empleado/{id}', [EmpleadoController::class, 'getEmpleado']);
Route::get('empleados', [EmpleadoController::class, 'mostrarEmpleados']);

/*Departamentos*/
Route::post('updateD', [DepartamentoController::class, 'editarDepartamento']);
Route::post('getDs', [DepartamentoController::class, 'mostrarDepartamentos']);
Route::get('departamentos', [DepartamentoController::class, 'mostrarDepartamentos']);
Route::get('departamento/{id}', [DepartamentoController::class, 'getDepartamento']);
Route::post('gerente', [DepartamentoController::class, 'asignarGerente']);

/*Usuarios*/
Route::post('register', [UserController::class, 'register']);
Route::post('login', [UserController::class, 'login']);
Route::get('users/{id}', [UserController::class, 'mostrarUsuarios']);
Route::get('user/{id}', [UserController::class, 'getUser']);
Route::post('updateUser', [UserController::class, 'updateUser']);
Route::delete('deleteUser', [UserController::class, 'deleteUser']);

/*Amigos*/
Route::post('/users/{idUsuario}/friends/{idAmigo}', [UserController::class, 'agregarAmigo']);
Route::get('/user/{user_id}/friends', [UserController::class, 'getUserFriends']);
Route::get('/user/{user_id}/friends/count', [UserController::class, 'countUserFriends']);
Route::delete('/user/{user_id}/friends/{friend_id}/delete', [UserController::class, 'removeFriend']);

/*Mensajes*/
Route::post('addMensaje/{id_autor}/{id_usuario}', [MensajeController::class, 'agregarMensaje']);
Route::get('getMensajes/{id_autor}/{id_usuario}', [MensajeController::class, 'obtenerMensajes']);

/*Tareas*/
Route::post('addTarea', [TareaController::class, 'addTarea']);
Route::get('getTareas', [TareaController::class, 'getTareas']);
Route::get('getTareas/{id_empleado}', [TareaController::class, 'getTareasByEmpleado']);
Route::get('getTarea/{id}', [TareaController::class, 'getTareaById']);
Route::post('updateTarea/{id}', [TareaController::class, 'updateTarea']);
Route::delete('deleteTarea/{id}', [TareaController::class, 'deleteTarea']);
