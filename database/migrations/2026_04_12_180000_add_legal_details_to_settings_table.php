<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->string('legal_rccm', 100)->nullable()->after('working_hours');
            $table->string('legal_nif', 100)->nullable()->after('legal_rccm');
            $table->string('bank_account_number', 150)->nullable()->after('legal_nif');
        });
    }

    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn(['legal_rccm', 'legal_nif', 'bank_account_number']);
        });
    }
};

