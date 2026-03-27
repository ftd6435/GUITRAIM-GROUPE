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
        Schema::create('team_members', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('position', 150)->nullable();
            $table->string('department', 100)->nullable();
            $table->text('bio')->nullable();
            $table->string('image')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->boolean('is_management')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('team_members');
    }
};
