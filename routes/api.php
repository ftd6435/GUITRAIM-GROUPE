<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\SectorController;
use App\Http\Controllers\Api\V1\ServiceController;
use App\Http\Controllers\Api\V1\ProjectController;
use App\Http\Controllers\Api\V1\BlogController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\TagController;
use App\Http\Controllers\Api\V1\TeamController;
use App\Http\Controllers\Api\V1\TestimonialController;
use App\Http\Controllers\Api\V1\PartnerController;
use App\Http\Controllers\Api\V1\PageController;
use App\Http\Controllers\Api\V1\ContactController;
use App\Http\Controllers\Api\V1\JobController;
use App\Http\Controllers\Api\V1\ApplicationController;
use App\Http\Controllers\Api\V1\NewsletterController;
use App\Http\Controllers\Api\V1\MediaController;
use App\Http\Controllers\Api\V1\SettingController;

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
        Route::apiResource('users', UserController::class);

        // Sectors (CRUD)
        Route::post('sectors', [SectorController::class, 'store']);
        Route::put('sectors/{id}', [SectorController::class, 'update']);
        Route::delete('sectors/{id}', [SectorController::class, 'destroy']);

        // Services (CRUD)
        Route::post('services', [ServiceController::class, 'store']);
        Route::put('services/{id}', [ServiceController::class, 'update']);
        Route::delete('services/{id}', [ServiceController::class, 'destroy']);

        // Projects (CRUD + Images)
        Route::post('projects', [ProjectController::class, 'store']);
        Route::put('projects/{id}', [ProjectController::class, 'update']);
        Route::delete('projects/{id}', [ProjectController::class, 'destroy']);
        Route::post('projects/{id}/images', [ProjectController::class, 'uploadImages']);
        Route::delete('projects/images/{id}', [ProjectController::class, 'deleteImage']);

        // Blog (CRUD)
        Route::post('blog', [BlogController::class, 'store']);
        Route::put('blog/{id}', [BlogController::class, 'update']);
        Route::delete('blog/{id}', [BlogController::class, 'destroy']);

        // Categories (CRUD)
        Route::post('categories', [CategoryController::class, 'store']);
        Route::put('categories/{id}', [CategoryController::class, 'update']);
        Route::delete('categories/{id}', [CategoryController::class, 'destroy']);

        // Tags (CRUD)
        Route::post('tags', [TagController::class, 'store']);
        Route::delete('tags/{id}', [TagController::class, 'destroy']);

        // Team (CRUD)
        Route::post('team', [TeamController::class, 'store']);
        Route::put('team/{id}', [TeamController::class, 'update']);
        Route::delete('team/{id}', [TeamController::class, 'destroy']);

        // Testimonials (CRUD)
        Route::post('testimonials', [TestimonialController::class, 'store']);
        Route::put('testimonials/{id}', [TestimonialController::class, 'update']);
        Route::delete('testimonials/{id}', [TestimonialController::class, 'destroy']);

        // Partners (CRUD)
        Route::post('partners', [PartnerController::class, 'store']);
        Route::put('partners/{id}', [PartnerController::class, 'update']);
        Route::delete('partners/{id}', [PartnerController::class, 'destroy']);

        // Pages (Update)
        Route::put('pages/{slug}', [PageController::class, 'update']);

        // Contacts (Admin Inbox)
        Route::get('contact', [ContactController::class, 'index']);
        Route::delete('contact/{id}', [ContactController::class, 'destroy']);

        // Jobs (CRUD)
        Route::post('jobs', [JobController::class, 'store']);
        Route::put('jobs/{id}', [JobController::class, 'update']);
        Route::delete('jobs/{id}', [JobController::class, 'destroy']);

        // Applications (Admin)
        Route::get('applications', [ApplicationController::class, 'index']);
        Route::get('applications/{id}', [ApplicationController::class, 'show']);
        Route::delete('applications/{id}', [ApplicationController::class, 'destroy']);

        // Newsletter (Admin)
        Route::get('newsletter', [NewsletterController::class, 'index']);
        Route::delete('newsletter/{id}', [NewsletterController::class, 'destroy']);

        // Media (CRUD)
        Route::get('media', [MediaController::class, 'index']);
        Route::post('media/upload', [MediaController::class, 'upload']);
        Route::delete('media/{id}', [MediaController::class, 'destroy']);

        // Settings (Update)
        Route::put('settings', [SettingController::class, 'update']);
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
    Route::post('applications', [ApplicationController::class, 'store']);
    Route::post('newsletter/subscribe', [NewsletterController::class, 'subscribe']);
});
