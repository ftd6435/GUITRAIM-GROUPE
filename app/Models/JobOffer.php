<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobOffer extends Model
{
    protected $fillable = ['is_visible', 'title', 'sector_id', 'contract_type', 'location', 'description', 'requirements', 'published_at', 'created_by', 'updated_by'];

    protected $casts = [
        'is_visible' => 'boolean',
        'published_at' => 'date:Y-m-d',
    ];

    public function sector()
    {
        return $this->belongsTo(Sector::class);
    }

    public function applications()
    {
        return $this->hasMany(Application::class, 'job_id');
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
