<?php

use App\Http\Controllers\Api\V1\NewsletterController;
use App\Http\Controllers\VerifyDocumentController;
use Illuminate\Support\Facades\Route;

// Admin Routes (SPA)
Route::get('/admin/{any?}', function () {
    return view('admin');
})->where('any', '.*');

Route::get('/auth/login', function () {
    return view('admin');
})->name('login');

// Frontend Routes (SPA)
Route::get('/newsletter/verify/{token}', [NewsletterController::class, 'verifyWeb']);
Route::get('/verify/quotes/{uuid}', [VerifyDocumentController::class, 'quote']);
Route::get('/verify/invoices/{uuid}', [VerifyDocumentController::class, 'invoice']);
Route::get('/verify/payments/{id}', [VerifyDocumentController::class, 'payment']);

Route::get('/{any?}', function () {
    return view('frontend');
})->where('any', '^(?!api|admin|auth|storage|img|js|css|fonts).*$');
