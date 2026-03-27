<?php

use Illuminate\Support\Facades\Route;

// Admin Routes (SPA)
Route::get('/admin/{any?}', function () {
    return view('admin');
})->where('any', '.*');

Route::get('/auth/login', function () {
    return view('admin');
})->name('login');

// Frontend Routes (SPA)
Route::get('/{any?}', function () {
    return view('frontend');
})->where('any', '^(?!api|admin|auth|storage|img|js|css|fonts).*$');
