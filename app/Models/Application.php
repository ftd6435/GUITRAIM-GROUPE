<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $fillable = ['job_id', 'first_name', 'last_name', 'email', 'phone', 'sector', 'experience_level', 'message', 'cv_file', 'cover_letter_file'];

    public function job()
    {
        return $this->belongsTo(JobOffer::class, 'job_id');
    }
}
