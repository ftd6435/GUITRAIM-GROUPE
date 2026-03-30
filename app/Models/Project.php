<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = ['is_visible', 'sector_id', 'title', 'slug', 'location', 'year', 'description', 'content', 'featured'];

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
}
