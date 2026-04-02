<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $tables = [
            'sectors',
            'services',
            'projects',
            'project_images',
            'blog_posts',
            'team_members',
            'testimonials',
            'partners',
            'pages',
            'settings',
            'job_offers',
            'applications',
            'contacts',
            'newsletter_subscribers',
            'media_library',
        ];

        foreach ($tables as $tableName) {
            $needsCreatedBy = ! Schema::hasColumn($tableName, 'created_by');
            $needsUpdatedBy = ! Schema::hasColumn($tableName, 'updated_by');

            if (! ($needsCreatedBy || $needsUpdatedBy)) {
                continue;
            }

            Schema::table($tableName, function (Blueprint $table) use ($needsCreatedBy, $needsUpdatedBy) {
                if ($needsCreatedBy) {
                    $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
                }
                if ($needsUpdatedBy) {
                    $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
                }
            });
        }
    }

    public function down(): void
    {
        $tables = [
            'sectors',
            'services',
            'projects',
            'project_images',
            'blog_posts',
            'team_members',
            'testimonials',
            'partners',
            'pages',
            'settings',
            'job_offers',
            'applications',
            'contacts',
            'newsletter_subscribers',
            'media_library',
        ];

        foreach ($tables as $tableName) {
            $hasCreatedBy = Schema::hasColumn($tableName, 'created_by');
            $hasUpdatedBy = Schema::hasColumn($tableName, 'updated_by');

            if (! ($hasCreatedBy || $hasUpdatedBy)) {
                continue;
            }

            Schema::table($tableName, function (Blueprint $table) use ($hasCreatedBy, $hasUpdatedBy) {
                if ($hasCreatedBy) {
                    $table->dropConstrainedForeignId('created_by');
                }

                if ($hasUpdatedBy) {
                    $table->dropConstrainedForeignId('updated_by');
                }
            });
        }
    }
};
