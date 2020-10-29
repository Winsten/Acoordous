<?php

use Illuminate\Http\Request;
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

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});


Route::resource('imovel', 'ImovelController');
Route::post('/imovel/datatable', 'ImovelController@anyData');
Route::post('/imovel/datatable/lixeira', 'ImovelController@anyDatalixeira');
Route::post('/imovel/restaurar/{id}', 'ImovelController@restaurar');
Route::get('/imovel/excel/export/{inicial}/{final}', 'ImovelController@export');
Route::post('/imovel/excel/import', 'ImovelController@import');
Route::resource('contrato', 'ContratoController');
