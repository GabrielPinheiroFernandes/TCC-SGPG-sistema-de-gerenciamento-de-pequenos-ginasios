<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get("/", function (Request $request) {
    return response()->json(["deucerto" => "true"]);
});

Route::post("/login",  [AuthController::class, "logginAttempt"]);

Route::prefix('/user')->group(function () {
    // Defina suas rotas aqui
    Route::post('/create', [AuthController::class, 'store']);
});
