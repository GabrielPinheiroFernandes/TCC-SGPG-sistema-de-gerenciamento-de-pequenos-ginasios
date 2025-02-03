<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function login(LoginRequest $request)
{
    $credentials = $request->validated(); // Obtemos os dados validados

    if (Auth::attempt($credentials)) {
        $user = Auth::user();

        // Gera o token de autenticação
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
            ],
        ]);
    }

    return response()->json(['message' => 'Invalid credentials'], 401);
}



    public function logout(Request $request)
    {
        $user = $request->user(); // Obtém o usuário autenticado

        if ($user) {
            // Deleta o token atual do usuário autenticado
            $user->currentAccessToken()->delete();

            return response()->json([
                'message' => 'Logout realizado com sucesso',
                'user_logged_out' => [
                    'id' => $user->id,
                    'name' => $user->name,
                ],
            ]);
        }

        return response()->json(['message' => 'Usuário não autenticado'], 401);
    }

    public function register(Request $request)
    {
        // Validação dos dados recebidos
        $credentials = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',
            'birth_date' => 'required|date',
            'height' => 'required|numeric',
            'weight' => 'required|numeric',
            'sex' => 'required|in:M,F',
            'cpf' => 'nullable|string|unique:users,cpf',
        ]);

        try {
            // Criando o usuário com os campos corretos
            $user = \App\Models\User::create([
                'first_name' => $credentials['first_name'],
                'last_name' => $credentials['last_name'],
                'email' => $credentials['email'],
                'password' => bcrypt($credentials['password']),
                'birth_date' => $credentials['birth_date'],
                'height' => $credentials['height'],
                'weight' => $credentials['weight'],
                'sex' => $credentials['sex'],
                'cpf' => $credentials['cpf'] ?? null,
            ]);

            if (!$user) {
                return response()->json(['message' => 'Erro ao criar usuário.'], 500);
            }

            // Gerando o token de autenticação
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Usuário registrado com sucesso!',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro interno no servidor.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }



}
