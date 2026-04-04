<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Partner extends Model
{
    protected $fillable = ['is_visible', 'name', 'logo', 'website_url', 'is_featured', 'created_by', 'updated_by'];

    protected $appends = ['logo_path'];

    protected $casts = [
        'is_visible' => 'boolean',
        'is_featured' => 'boolean',
    ];

    public function getLogoPathAttribute()
    {
        return $this->logo ? asset('storage/images/partners/'.$this->logo) : null;
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
