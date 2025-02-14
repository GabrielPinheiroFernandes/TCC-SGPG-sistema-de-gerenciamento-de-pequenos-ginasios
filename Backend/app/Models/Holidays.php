<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Holidays extends Model
{
    use HasFactory;

    protected $fillable = [
        "holiday_name",
        "day",
        "open_time",
        "close_time",
        "note"
    ] ;
}
