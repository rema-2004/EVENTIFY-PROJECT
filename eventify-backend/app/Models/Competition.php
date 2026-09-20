<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Competition extends Model
{
    use HasFactory;

    protected $table = 'competitions';

    // المفتاح الرئيسي مشترك مع events.id وليس auto-increment
    protected $primaryKey = 'id';
    public $incrementing = false;

    // لا نملك حقول timestamps هنا لأنها موجودة في جدول events الأساسي
    public $timestamps = false;

    protected $fillable = [
        'id',
        'team_size',
        'prize',
    ];

    /**
     * الفعالية الأساسية التي تمتد منها هذه المسابقة
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class, 'id');
    }
}