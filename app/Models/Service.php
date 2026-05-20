<?php

namespace App\Models;

use App\Traits\CloudflareUpload;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use CloudflareUpload;

    protected $fillable = ['is_visible', 'sector_id', 'title', 'slug', 'description', 'content', 'image', 'created_by', 'updated_by'];

    protected $appends = ['image_path'];

    public function getImagePathAttribute()
    {
        return $this->image ? $this->getImageUrl($this->image, 'services') : null;
    }

    public function sector()
    {
        return $this->belongsTo(Sector::class);
    }

    public function images()
    {
        return $this->hasMany(ServiceImage::class)->orderBy('sort_order');
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
