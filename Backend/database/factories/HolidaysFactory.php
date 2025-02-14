<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Holidays>
 */
class HolidaysFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $holidays = [
            'Natal',
            'Ano Novo',
            'Carnaval',
            'Páscoa',
            'Independência',
            'Dia das Mães',
            'Dia dos Pais',
            'Feriado do Trabalho'
        ];
        return [
            'holiday_name' => fake()->randomElement($holidays),
            'day' => fake()->date('Y-m-d'),
            'open_time' => fake()->time('H:i:s'), // Corrigido para gerar um horário
            'close_time' => fake()->time('H:i:s'), // Corrigido para gerar um horário
            'note' => fake()->sentence(), // Corrigido para gerar uma frase ou texto
        ];
    }
}
