<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectImage extends Model
{
    protected $fillable = ['project_id', 'image_url', 'created_by', 'updated_by'];

    protected $appends = ['image_path'];

    public function getImagePathAttribute()
    {
        return $this->image_url ? asset('storage/images/projects/'.$this->image_url) : null;
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
