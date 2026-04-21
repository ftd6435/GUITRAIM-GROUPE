<?php

use App\Http\Controllers\Api\V1\ApplicationController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BlogController;
use App\Http\Controllers\Api\V1\BlogCommentController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\ClientController;
use App\Http\Controllers\Api\V1\ContactController;
use App\Http\Controllers\Api\V1\CrmDashboardController;
use App\Http\Controllers\Api\V1\InvoiceController;
use App\Http\Controllers\Api\V1\JobController;
use App\Http\Controllers\Api\V1\MediaController;
use App\Http\Controllers\Api\V1\NewsletterController;
use App\Http\Controllers\Api\V1\PageController;
use App\Http\Controllers\Api\V1\PartnerController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\ProjectController;
use App\Http\Controllers\Api\V1\QuoteController;
use App\Http\Controllers\Api\V1\SectorController;
use App\Http\Controllers\Api\V1\ServiceController;
use App\Http\Controllers\Api\V1\SettingController;
use App\Http\Controllers\Api\V1\TagController;
use App\Http\Controllers\Api\V1\TeamController;
use App\Http\Controllers\Api\V1\TestimonialController;
use App\Http\Controllers\Api\V1\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Auth Routes
    Route::prefix('auth')->group(function () {
        Route::post('login', [AuthController::class, 'login']);
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('logout', [AuthController::class, 'logout']);
            Route::get('me', [AuthController::class, 'me']);
        });
    });

    // Public / Protected Resources
    Route::middleware('auth:sanctum')->group(function () {
        // Users (Admin only)
        Route::get('users/switch-status/{id}', [UserController::class, 'switchStatus'])->middleware('super_admin');
        Route::post('users/switch-role/{id}', [UserController::class, 'switchRole'])->middleware('super_admin');
        Route::apiResource('users', UserController::class)->except(['destroy']);
        Route::delete('users/{user}', [UserController::class, 'destroy'])->middleware('super_admin');

        // Sectors (CRUD)
        Route::post('sectors', [SectorController::class, 'store']);
        Route::put('sectors/{id}', [SectorController::class, 'update']);
        Route::delete('sectors/{id}', [SectorController::class, 'destroy'])->middleware('super_admin');

        // Services (CRUD)
        Route::post('services', [ServiceController::class, 'store']);
        Route::put('services/{id}', [ServiceController::class, 'update']);
        Route::delete('services/{id}', [ServiceController::class, 'destroy'])->middleware('super_admin');

        // Projects (CRUD + Images)
        Route::post('projects', [ProjectController::class, 'store']);
        Route::put('projects/{id}', [ProjectController::class, 'update']);
        Route::delete('projects/{id}', [ProjectController::class, 'destroy'])->middleware('super_admin');
        Route::post('projects/{id}/images', [ProjectController::class, 'uploadImages']);
        Route::delete('projects/images/{id}', [ProjectController::class, 'destroyImage'])->middleware('super_admin');

        // Blog (CRUD)
        Route::post('blog', [BlogController::class, 'store']);
        Route::put('blog/{id}', [BlogController::class, 'update']);
        Route::delete('blog/{id}', [BlogController::class, 'destroy'])->middleware('super_admin');

        // Blog Comments (Moderation)
        Route::get('blog-comments', [BlogCommentController::class, 'index']);
        Route::put('blog-comments/{id}', [BlogCommentController::class, 'update']);
        Route::delete('blog-comments/{id}', [BlogCommentController::class, 'destroy'])->middleware('super_admin');

        // Categories (CRUD)
        Route::post('categories', [CategoryController::class, 'store']);
        Route::put('categories/{id}', [CategoryController::class, 'update']);
        Route::delete('categories/{id}', [CategoryController::class, 'destroy'])->middleware('super_admin');

        // Tags (CRUD)
        Route::post('tags', [TagController::class, 'store']);
        Route::delete('tags/{id}', [TagController::class, 'destroy'])->middleware('super_admin');

        // Team (CRUD)
        Route::get('team/all', [TeamController::class, 'adminIndex']);
        Route::post('team', [TeamController::class, 'store']);
        Route::put('team/{id}', [TeamController::class, 'update']);
        Route::delete('team/{id}', [TeamController::class, 'destroy'])->middleware('super_admin');

        // Testimonials (CRUD)
        Route::post('testimonials', [TestimonialController::class, 'store']);
        Route::put('testimonials/{id}', [TestimonialController::class, 'update']);
        Route::delete('testimonials/{id}', [TestimonialController::class, 'destroy'])->middleware('super_admin');

        // Partners (CRUD)
        Route::post('partners', [PartnerController::class, 'store']);
        Route::put('partners/{id}', [PartnerController::class, 'update']);
        Route::delete('partners/{id}', [PartnerController::class, 'destroy'])->middleware('super_admin');

        // Pages (Update)
        Route::get('pages/all', [PageController::class, 'index']);
        Route::put('pages/{slug}', [PageController::class, 'update']);
        Route::post('pages/{slug}', [PageController::class, 'update']);

        // Contacts (Admin Inbox)
        Route::get('contact/summary', [ContactController::class, 'summary']);
        Route::get('contact', [ContactController::class, 'index']);
        Route::delete('contact/{id}', [ContactController::class, 'destroy'])->middleware('super_admin');

        // Jobs (CRUD)
        Route::get('jobs/all', [JobController::class, 'adminIndex']);
        Route::post('jobs', [JobController::class, 'store']);
        Route::put('jobs/{id}', [JobController::class, 'update']);
        Route::delete('jobs/{id}', [JobController::class, 'destroy'])->middleware('super_admin');

        // Applications (Admin)
        Route::get('applications/summary', [ApplicationController::class, 'summary']);
        Route::get('applications', [ApplicationController::class, 'index']);
        Route::get('applications/{id}', [ApplicationController::class, 'show']);
        Route::put('applications/{id}', [ApplicationController::class, 'update']);
        Route::delete('applications/{id}', [ApplicationController::class, 'destroy'])->middleware('super_admin');

        // Newsletter (Admin)
        Route::get('newsletter', [NewsletterController::class, 'index']);
        Route::delete('newsletter/{id}', [NewsletterController::class, 'destroy'])->middleware('super_admin');

        // Media (CRUD)
        Route::get('media', [MediaController::class, 'index']);
        Route::post('media/upload', [MediaController::class, 'upload']);
        Route::delete('media/{id}', [MediaController::class, 'destroy'])->middleware('super_admin');

        // Settings (Update)
        Route::put('settings', [SettingController::class, 'update']);

        Route::prefix('crm')->group(function () {
            Route::get('dashboard', [CrmDashboardController::class, 'index']);

            Route::get('clients', [ClientController::class, 'index']);
            Route::post('clients', [ClientController::class, 'store']);
            Route::put('clients/{id}', [ClientController::class, 'update']);
            Route::delete('clients/{id}', [ClientController::class, 'destroy'])->middleware('super_admin');

            Route::get('quotes', [QuoteController::class, 'index']);
            Route::post('quotes', [QuoteController::class, 'store']);
            Route::get('quotes/{id}', [QuoteController::class, 'show']);
            Route::put('quotes/{id}', [QuoteController::class, 'update']);
            Route::delete('quotes/{id}', [QuoteController::class, 'destroy'])->middleware('super_admin');
            Route::get('quotes/{id}/pdf', [QuoteController::class, 'pdf']);

            Route::get('invoices', [InvoiceController::class, 'index']);
            Route::post('invoices', [InvoiceController::class, 'store']);
            Route::post('invoices/from-quote/{quoteId}', [InvoiceController::class, 'storeFromQuote']);
            Route::get('invoices/{id}', [InvoiceController::class, 'show']);
            Route::put('invoices/{id}', [InvoiceController::class, 'update']);
            Route::delete('invoices/{id}', [InvoiceController::class, 'destroy'])->middleware('super_admin');
            Route::get('invoices/{id}/pdf', [InvoiceController::class, 'pdf']);

            Route::get('invoices/{invoiceId}/payments', [PaymentController::class, 'index']);
            Route::post('invoices/{invoiceId}/payments', [PaymentController::class, 'store']);
            Route::delete('payments/{id}', [PaymentController::class, 'destroy'])->middleware('super_admin');
            Route::get('payments/{id}/receipt', [PaymentController::class, 'receipt']);
        });
    });

    // Public GET Routes
    Route::get('sectors', [SectorController::class, 'index']);
    Route::get('sectors/{slug}', [SectorController::class, 'show']);
    Route::get('services', [ServiceController::class, 'index']);
    Route::get('services/{slug}', [ServiceController::class, 'show']);
    Route::get('projects', [ProjectController::class, 'index']);
    Route::get('projects/{slug}', [ProjectController::class, 'show']);
    Route::get('tags', [TagController::class, 'index']);
    Route::get('blog', [BlogController::class, 'index']);
    Route::get('blog/{slug}', [BlogController::class, 'show']);
    Route::get('blog/{slug}/comments', [BlogCommentController::class, 'publicIndex']);
    Route::get('categories', [CategoryController::class, 'index']);
    Route::get('team', [TeamController::class, 'index']);
    Route::get('testimonials', [TestimonialController::class, 'index']);
    Route::get('partners', [PartnerController::class, 'index']);
    Route::get('pages/{slug}', [PageController::class, 'show']);
    Route::get('jobs', [JobController::class, 'index']);
    Route::get('jobs/{id}', [JobController::class, 'show']);
    Route::get('settings', [SettingController::class, 'index']);

    // Public POST Routes (Forms)
    Route::post('contact', [ContactController::class, 'store']);
    Route::post('blog/{slug}/comments', [BlogCommentController::class, 'store']);
    Route::post('applications', [ApplicationController::class, 'store']);
    Route::post('newsletter/subscribe', [NewsletterController::class, 'subscribe']);
    Route::get('newsletter/verify/{token}', [NewsletterController::class, 'verify']);
});
