<?php

namespace App\Models;

use App\Traits\CloudflareUpload;
use Illuminate\Database\Eloquent\Model;

class Partner extends Model
{
    use CloudflareUpload;

    protected $fillable = ['is_visible', 'name', 'logo', 'website_url', 'is_featured', 'created_by', 'updated_by'];

    protected $appends = ['logo_path'];

    protected $casts = [
        'is_visible' => 'boolean',
        'is_featured' => 'boolean',
    ];

    public function getLogoPathAttribute()
    {
        return $this->logo ? $this->getImageUrl($this->logo, 'partners') : null;
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
