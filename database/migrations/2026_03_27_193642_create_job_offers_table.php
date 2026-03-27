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
        Schema::create('job_offers', function (Blueprint $table) {
            $table->id();
            $table->string('title', 150);
            $table->foreignId('sector_id')->constrained('sectors')->onDelete('cascade');
            $table->enum('contract_type', ['CDI', 'CDD', 'Stage', 'Freelance']);
            $table->string('location', 100)->nullable();
            $table->text('description')->nullable();
            $table->text('requirements')->nullable();
            $table->date('published_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_offers');
    }
};
