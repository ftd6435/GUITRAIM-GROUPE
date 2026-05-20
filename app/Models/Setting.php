<?php

namespace App\Models;

use App\Traits\CloudflareUpload;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use CloudflareUpload;

    protected $fillable = [
        'site_name',
        'logo',
        'address',
        'phone',
        'email',
        'working_hours',
        'legal_rccm',
        'legal_nif',
        'bank_account_number',
        'facebook_url',
        'linkedin_url',
        'x_url',
        'instagram_url',
        'created_by',
        'updated_by',
    ];

    protected $appends = ['logo_path'];

    public function getLogoPathAttribute()
    {
        return $this->logo ? $this->getImageUrl($this->logo, 'settings') : null;
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
