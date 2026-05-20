<?php

namespace App\Models;

use App\Traits\CloudflareUpload;
use Illuminate\Database\Eloquent\Model;

class MediaLibrary extends Model
{
    use CloudflareUpload;

    protected $table = 'media_library';

    protected $fillable = ['file_name', 'file_url', 'file_type', 'alt_text', 'uploaded_by', 'created_by', 'updated_by'];

    protected $appends = ['file_path'];

    public function getFilePathAttribute()
    {
        return $this->file_url ? $this->getFileUrl($this->file_url, 'library') : null;
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
