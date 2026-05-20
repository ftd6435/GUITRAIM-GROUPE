<?php

namespace App\Models;

use App\Traits\CloudflareUpload;
use Illuminate\Database\Eloquent\Model;

class ServiceImage extends Model
{
    use CloudflareUpload;

    protected $fillable = ['service_id', 'image', 'sort_order', 'created_by', 'updated_by'];

    protected $appends = ['image_path'];

    public function getImagePathAttribute()
    {
        return $this->image ? $this->getImageUrl($this->image, 'services') : null;
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
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
