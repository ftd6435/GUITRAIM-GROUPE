<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    protected $fillable = ['is_visible', 'name', 'avatar', 'position', 'department', 'bio', 'image', 'linkedin_url', 'is_management', 'created_by', 'updated_by'];

    protected $appends = ['avatar_path', 'image_path'];

    public function getAvatarPathAttribute()
    {
        return $this->avatar ? asset('storage/images/avatars/'.$this->avatar) : null;
    }

    public function getImagePathAttribute()
    {
        return $this->image ? asset('storage/images/team/'.$this->image) : null;
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
