<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->json('data')->nullable()->after('content');
            $table->string('history_image')->nullable()->after('data');
            $table->string('vision_image')->nullable()->after('history_image');
        });
    }

    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn(['data', 'history_image', 'vision_image']);
        });
    }
};

