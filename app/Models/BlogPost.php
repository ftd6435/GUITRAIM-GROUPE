<?php

namespace App\Models;

use App\Traits\CloudflareUpload;
use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{
    use CloudflareUpload;

    protected $fillable = ['title', 'slug', 'category_id', 'excerpt', 'content', 'image', 'reading_time', 'published_at', 'author_id', 'created_by', 'updated_by'];

    protected $appends = ['image_path', 'published', 'summary'];

    public function getImagePathAttribute()
    {
        return $this->image ? $this->getImageUrl($this->image, 'blog') : null;
    }

    public function getPublishedAttribute()
    {
        return ! is_null($this->published_at);
    }

    public function getSummaryAttribute()
    {
        return $this->excerpt;
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'blog_post_tags');
    }

    public function comments()
    {
        return $this->hasMany(BlogComment::class);
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
