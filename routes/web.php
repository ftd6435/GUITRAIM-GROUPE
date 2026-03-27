<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/admin/{any?}', function () {
    return view('admin');
})->where('any', '.*');

Route::get('/auth/login', function () {
    return view('admin');
})->name('login');
