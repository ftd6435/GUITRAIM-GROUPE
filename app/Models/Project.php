<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = ['is_visible', 'sector_id', 'title', 'slug', 'location', 'year', 'description', 'content', 'featured', 'created_by', 'updated_by'];

    public function sector()
    {
        return $this->belongsTo(Sector::class);
    }

    public function images()
    {
        return $this->hasMany(ProjectImage::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'project_tags');
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
