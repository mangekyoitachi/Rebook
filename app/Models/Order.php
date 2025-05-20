<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'cart_id',
        'status',
        'total',
        'created_at',
        'updated_at'
    ];

    public function users(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function carts(): BelongsTo
    {
        return $this->belongsTo(Cart::class, 'cart_id');
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }

    public function shipping(): HasOne
    {
        return $this->hasOne(Shipping::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }
}
