<?php

namespace App\Models;

use App\Traits\CloudflareUpload;
use Illuminate\Database\Eloquent\Model;

class ProjectImage extends Model
{
    use CloudflareUpload;

    protected $fillable = ['project_id', 'image_url', 'created_by', 'updated_by'];

    protected $appends = ['image_path'];

    public function getImagePathAttribute()
    {
        return $this->image_url ? $this->getImageUrl($this->image_url, 'projects') : null;
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
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
