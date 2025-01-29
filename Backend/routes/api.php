<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

/*
|----------------------------------------------------------------------
| API Routes
|----------------------------------------------------------------------
|
| Here is where you can register API routes for your application.
|
*/

/*
|----------------------------------------------------------------------
| Auth Routes
|----------------------------------------------------------------------
*/

// Rota de login
Route::post('/login', [AuthController::class, 'login']);

// Rota de registro
Route::post('/register', [AuthController::class, 'register']);

// Rotas protegidas com autenticação Sanctum
Route::middleware('auth:sanctum')->group(function () {
    // Rota de logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Rota para retornar o usuário autenticado
    Route::get('/user', [AuthController::class, 'user']);
});
