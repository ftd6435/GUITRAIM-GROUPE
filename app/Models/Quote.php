<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'client_id',
        'sector_id',
        'quote_number',
        'status',
        'issue_date',
        'valid_until',
        'subtotal',
        'tax_amount',
        'total_amount',
        'notes',
        'created_by'
    ];

    protected $casts = [
        'issue_date' => 'date',
        'valid_until' => 'date',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function sector()
    {
        return $this->belongsTo(Sector::class);
    }

    public function items()
    {
        return $this->hasMany(QuoteItem::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
