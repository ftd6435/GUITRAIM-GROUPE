<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('avatar')->nullable()->after('email');
        });

        Schema::table('team_members', function (Blueprint $table) {
            $table->string('avatar')->nullable()->after('name');
        });

        Schema::table('testimonials', function (Blueprint $table) {
            $table->string('avatar')->nullable()->after('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('avatar');
        });

        Schema::table('team_members', function (Blueprint $table) {
            $table->dropColumn('avatar');
        });

        Schema::table('testimonials', function (Blueprint $table) {
            $table->dropColumn('avatar');
        });
    }
};
