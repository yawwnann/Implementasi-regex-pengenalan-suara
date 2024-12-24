<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VoiceCommandController;


Route::post('/process-command', [VoiceCommandController::class, 'processCommand']);
Route::get('/', function () {
    return view('welcome');
});
