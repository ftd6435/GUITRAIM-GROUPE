<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $fillable = ['job_id', 'first_name', 'last_name', 'email', 'phone', 'sector', 'experience_level', 'message', 'cv_file', 'cover_letter_file', 'status', 'created_by', 'updated_by'];

    protected $appends = ['full_name', 'cv_path', 'cover_letter_path'];

    public function getFullNameAttribute()
    {
        return trim(($this->first_name ?? '').' '.($this->last_name ?? ''));
    }

    public function getCvPathAttribute()
    {
        return $this->cv_file ? asset('storage/files/applications/cvs/'.$this->cv_file) : null;
    }

    public function getCoverLetterPathAttribute()
    {
        return $this->cover_letter_file ? asset('storage/files/applications/letters/'.$this->cover_letter_file) : null;
    }

    public function job()
    {
        return $this->belongsTo(JobOffer::class, 'job_id');
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
