<?php

namespace App\Models;

use App\Traits\CloudflareUpload;
use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    use CloudflareUpload;

    protected $fillable = ['title', 'slug', 'content', 'data', 'history_image', 'vision_image', 'hero_image', 'meta_title', 'meta_description', 'created_by', 'updated_by'];

    protected $casts = [
        'data' => 'array',
    ];

    protected $appends = ['history_image_path', 'vision_image_path', 'hero_image_path', 'hero_images_paths'];

    public function getHistoryImagePathAttribute()
    {
        return $this->history_image ? $this->getImageUrl($this->history_image, 'pages') : null;
    }

    public function getVisionImagePathAttribute()
    {
        return $this->vision_image ? $this->getImageUrl($this->vision_image, 'pages') : null;
    }

    public function getHeroImagePathAttribute()
    {
        return $this->hero_image ? $this->getImageUrl($this->hero_image, 'pages') : null;
    }

    public function getHeroImagesPathsAttribute()
    {
        $data = $this->data ?? [];
        $images = is_array($data) && array_key_exists('hero_images', $data) ? $data['hero_images'] : [];
        if (! is_array($images)) {
            return [];
        }

        return array_values(array_filter(array_map(function ($filename) {
            if (! $filename) {
                return null;
            }
            return $this->getImageUrl($filename, 'pages');
        }, $images)));
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
