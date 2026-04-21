<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('job_offers')
            ->where('is_visible', true)
            ->whereNull('published_at')
            ->update(['published_at' => DB::raw('DATE(created_at)')]);
    }

    public function down(): void
    {
    }
};

