<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MediaLibrary extends Model
{
    protected $table = 'media_library';

    protected $fillable = ['file_name', 'file_url', 'file_type', 'alt_text', 'uploaded_by'];

    public function user()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
