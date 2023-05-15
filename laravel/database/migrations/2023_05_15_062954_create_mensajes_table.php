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
    public function up(): void
    {
        Schema::create('mensajes', function (Blueprint $table) {
            $table->id();
            $table->text('mensaje');
            $table->unsignedBigInteger('id_autor')->nullable();
            $table->unsignedBigInteger('id_usuario')->nullable();
            $table->date('fecha_mensaje')->default(DB::raw('CURRENT_TIMESTAMP()'));
            $table->time('hora_mensaje')->default(DB::raw('CURTIME()'));
            $table->foreign('id_autor')->references('id')->on('users');
            $table->foreign('id_usuario')->references('id')->on('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mensajes');
    }
};
