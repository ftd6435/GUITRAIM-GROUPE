<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    protected $fillable = ['name', 'slug', 'status', 'created_by', 'updated_by'];

    public function blogPosts()
    {
        return $this->belongsToMany(BlogPost::class, 'blog_post_tags');
    }

    public function projects()
    {
        return $this->belongsToMany(Project::class, 'project_tags');
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
