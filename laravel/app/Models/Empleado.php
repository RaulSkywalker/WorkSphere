<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Empleado extends Model
{
    protected $table = 'empleados';

    public function departamento()
    {
        return $this->belongsTo('App\Models\Departamento', 'id_departamento', 'id');
    }

    use HasFactory;
}
