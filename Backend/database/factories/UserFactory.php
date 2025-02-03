<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password = null;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'is_admin' => false,
            'birth_date' => fake()->date('Y-m-d', now()->subYears(18)), // Maior de idade
            'height' => fake()->randomFloat(2, 1.50, 2.00), // Entre 1.50m e 2.00m
            'weight' => fake()->randomFloat(2, 50, 120), // Entre 50kg e 120kg
            'sex' => fake()->randomElement(['M', 'F']),
            'cpf' => fake()->unique()->numerify('###########'), // 11 números aleatórios
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
