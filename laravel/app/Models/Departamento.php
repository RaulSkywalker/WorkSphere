<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Departamento extends Model
{
    protected $table = 'departamentos';

    public function empleados()
    {
        return $this->hasMany('App\Models\Empleado', 'id_departamento', 'id');
    }
    
    use HasFactory;
}
