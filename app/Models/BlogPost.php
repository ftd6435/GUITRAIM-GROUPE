<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{
    protected $fillable = ['title', 'slug', 'category_id', 'excerpt', 'content', 'image', 'reading_time', 'published_at', 'author_id'];

    protected $appends = ['image_path'];

    public function getImagePathAttribute()
    {
        return $this->image ? asset('storage/images/blog/' . $this->image) : null;
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
}
