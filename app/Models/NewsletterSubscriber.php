<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NewsletterSubscriber extends Model
{
    protected $fillable = ['email', 'is_active', 'subscribed_at', 'verification_token_hash', 'verification_sent_at', 'verified_at', 'created_by', 'updated_by'];

    protected $casts = [
        'subscribed_at' => 'datetime',
        'is_active' => 'boolean',
        'verification_sent_at' => 'datetime',
        'verified_at' => 'datetime',
    ];

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
