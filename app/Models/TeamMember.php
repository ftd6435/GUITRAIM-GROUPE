<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    protected $fillable = ['is_visible', 'name', 'avatar', 'position', 'department', 'bio', 'image', 'linkedin_url', 'is_management'];
}
