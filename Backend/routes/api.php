<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HolidaysController;
use App\Http\Controllers\UserController;
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
    Route::get('/myuser', [AuthController::class, 'myuser']);

    Route::get('/user{first_name?}', [UserController::class,'index']);
});


/*
|----------------------------------------------------------------------
| Holidays
|----------------------------------------------------------------------
*/
// Rotas protegidas com autenticação Sanctum
Route::middleware('auth:sanctum')->group(function () {

    Route::prefix('holidays')->group(function () {
        Route::get('/{between?}', [HolidaysController::class, 'index']);
        Route::get('/{id}', [HolidaysController::class, 'show']);
        Route::post('/create', [HolidaysController::class, 'store']);
    });

});
