<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobOffer extends Model
{
    protected $fillable = ['is_visible', 'title', 'sector_id', 'contract_type', 'location', 'description', 'requirements', 'published_at'];

    public function sector()
    {
        return $this->belongsTo(Sector::class);
    }

    public function applications()
    {
        return $this->hasMany(Application::class, 'job_id');
    }
}
