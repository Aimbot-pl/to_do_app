<?php

use App\Http\Controllers\Api\v1\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::prefix('v1')->group(function(){
    Route::middleware('auth:sanctum')->group(function () {
        Route::put('/user/{user}', [UserController::class, 'update']);
        Route::get('/user/{id}', [UserController::class, 'show']);
        Route::put('/user/{id}/change-password', [UserController::class, 'changePassword']);
        Route::post('/logout', [UserController::class, 'logout']);
        Route::post('/delete-account', [UserController::class, 'destroy']);
    });

    Route::post('/register', [UserController::class, 'register']);
    Route::post('/login', [UserController::class, 'login']);
    Route::post('/refresh-token', [UserController::class, 'refreshToken']);
    // Route::apiResource('/tasks', TaskController::class);
});