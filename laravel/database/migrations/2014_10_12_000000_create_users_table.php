<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;


return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('role');
            $table->integer('num_amigos')->default(0);
            $table->rememberToken();
            $table->timestamps();
        });
        DB::statement("INSERT INTO users (id, name, email, password, role, created_at, updated_at) VALUES (0, 'Administrador', 'admin@worksphere.com', '".Hash::make('admin101')."', 'admin', NOW(), NOW())");
        DB::statement('ALTER TABLE users AUTO_INCREMENT = 1;');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
