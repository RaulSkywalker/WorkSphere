<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
{
    Schema::disableForeignKeyConstraints();

    Schema::create('departamentos', function (Blueprint $table) {
        $table->id();
        $table->string('nombre_departamento');
        $table->text('descripcion');
        $table->timestamps();
    });

    DB::statement("INSERT INTO departamentos (id, nombre_departamento, descripcion) VALUES 
(1, 'Recursos Humanos', 'Contratación, capacitación, evaluación y compensación de los empleados.'),
(2, 'Finanzas', 'Gestión financiera de la empresa, incluyendo la contabilidad, el presupuesto, la planificación financiera y la gestión de riesgos.'),
(3, 'Marketing', 'Promoción de productos y servicios, investigación de mercado, desarrollo de estrategias de marca, publicidad y relaciones públicas.'),
(4, 'Operaciones', 'Gestión de la cadena de suministro, producción, distribución y logística.'),
(5, 'Informática', 'Gestión y mantenimiento de los sistemas informáticos y de tecnología de la empresa, incluyendo hardware, software, redes y seguridad informática.'),
(6, 'Ventas', 'Venta de productos y servicios, y de la gestión de las relaciones con los clientes.'),
(7, 'Legal', 'Gestión de asuntos legales, tales como contratos, litigios, propiedad intelectual y cumplimiento normativo.')");


    Schema::create('empleados', function (Blueprint $table) {
        $table->id();
        $table->string('nombre');
        $table->string('apellido');
        $table->string('email');
        $table->string('telefono');
        $table->string('fecha_nacim');
        $table->string('fecha_incorp');
        $table->unsignedBigInteger('id_departamento');
        $table->foreign('id_departamento')->references('id')->on('departamentos');
        $table->timestamps();
    });

    Schema::enableForeignKeyConstraints();
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('empleados');
        Schema::dropIfExists('departamentos');
    }
};
