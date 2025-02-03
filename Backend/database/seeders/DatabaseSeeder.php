<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Criar 10 usuários aleatórios
        // User::factory(10)->create();

        // Criar um usuário admin fixo para testes
        User::factory()->create([
            'first_name' => 'Test',
            'last_name' => 'Admin',
            'is_admin' => true,
            'birth_date' => '1990-01-01',
            'height' => 1.75,
            'weight' => 75.0,
            'sex' => 'M',
            'cpf' => '12345678900',
            'email' => 'admin@email.com',
            'password' => Hash::make('senha123'),
        ]);

        // Criar um usuário comum fixo para testes
        User::factory()->create([
            'first_name' => 'Test',
            'last_name' => 'User',
            'is_admin' => false,
            'birth_date' => '1995-05-15',
            'height' => 1.68,
            'weight' => 68.5,
            'sex' => 'F',
            'cpf' => '09876543211',
            'email' => 'user@email.com',
            'password' => Hash::make('senha123'),
        ]);

    }
}
