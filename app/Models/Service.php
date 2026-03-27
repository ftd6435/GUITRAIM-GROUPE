<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = ['sector_id', 'title', 'slug', 'description', 'content', 'image'];

    public function sector()
    {
        return $this->belongsTo(Sector::class);
    }
}
