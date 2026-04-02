<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sectors', function (Blueprint $table) {
            $table->string('highlight_title', 150)->nullable()->after('description');
            $table->json('highlight_items')->nullable()->after('highlight_title');
        });
    }

    public function down(): void
    {
        Schema::table('sectors', function (Blueprint $table) {
            $table->dropColumn(['highlight_title', 'highlight_items']);
        });
    }
};

