<?php

namespace App\Models;

use App\Traits\CloudflareUpload;
use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    use CloudflareUpload;

    protected $fillable = ['is_visible', 'name', 'avatar', 'position', 'department', 'bio', 'image', 'linkedin_url', 'is_management', 'created_by', 'updated_by'];

    protected $appends = ['avatar_path', 'image_path'];

    public function getAvatarPathAttribute()
    {
        return $this->avatar ? $this->getImageUrl($this->avatar, 'avatars') : null;
    }

    public function getImagePathAttribute()
    {
        return $this->image ? $this->getImageUrl($this->image, 'team') : null;
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
