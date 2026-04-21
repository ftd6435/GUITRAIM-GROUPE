<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('newsletter_subscribers', function (Blueprint $table) {
            $table->string('verification_token_hash', 64)->nullable()->after('is_active');
            $table->timestamp('verification_sent_at')->nullable()->after('verification_token_hash');
            $table->timestamp('verified_at')->nullable()->after('verification_sent_at');
        });
    }

    public function down(): void
    {
        Schema::table('newsletter_subscribers', function (Blueprint $table) {
            $table->dropColumn(['verification_token_hash', 'verification_sent_at', 'verified_at']);
        });
    }
};
