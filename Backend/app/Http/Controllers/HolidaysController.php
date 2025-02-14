<?php

namespace App\Http\Controllers;

use App\Models\Holidays;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class HolidaysController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

       $holidays = Holidays::paginate(10);
       return response()->json($holidays);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validação dos campos
        $validator = Validator::make($request->all(), [
            "holiday_name" => "required|string", // Certifica-se de que é uma string
            "day" => "required|date|date_format:Y-m-d", // Garantir que a data esteja no formato 'Y-m-d'
            "open_time" => "required|date_format:H:i", // Valida o horário no formato 'H:i'
            "close_time" => "required|date_format:H:i", // Valida o horário no formato 'H:i'
        ]);

        // Verificando se a validação falhou
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro de validação.',
                'errors' => $validator->errors(),
            ], 422);  // Fechar o return corretamente aqui
        }

        // Criação da nova entrada
        $holiday = Holidays::create([
            "holiday_name" => $request->holiday_name,
            'day' => $request->day,
            'open_time' => $request->open_time,
            'close_time' => $request->close_time,
        ]);

        // Retorna a resposta com sucesso
        return response()->json([
            'message' => 'Registro inserido com sucesso',
            'data' => $holiday
        ], 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $holiday = Holidays::find($id);
        return response()->json($holiday);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
