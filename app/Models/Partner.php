<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Partner extends Model
{
    protected $fillable = ['is_visible', 'name', 'logo', 'website_url', 'is_featured'];
}
