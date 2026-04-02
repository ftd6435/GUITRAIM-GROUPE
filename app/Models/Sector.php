<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sector extends Model
{
    protected $fillable = ['is_visible', 'name', 'slug', 'description', 'highlight_title', 'highlight_items', 'icon', 'created_by', 'updated_by'];

    protected $casts = [
        'highlight_items' => 'array',
        'is_visible' => 'boolean',
    ];

    public function services()
    {
        return $this->hasMany(Service::class);
    }

    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    public function jobOffers()
    {
        return $this->hasMany(JobOffer::class);
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
