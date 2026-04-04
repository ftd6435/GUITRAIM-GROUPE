<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$rows = Illuminate\Support\Facades\DB::table('failed_jobs')
    ->orderByDesc('id')
    ->limit(5)
    ->get(['id', 'failed_at', 'exception']);

foreach ($rows as $row) {
    echo "FAILED_JOB_ID: {$row->id} at {$row->failed_at}\n";
    $exception = (string) $row->exception;
    echo substr($exception, 0, 4000) . "\n\n";
}

