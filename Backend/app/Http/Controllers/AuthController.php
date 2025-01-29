<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function login(Request $request)
    {
        // Validação das credenciais
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Verifica se as credenciais são válidas
        if (Auth::attempt($credentials)) {
            $user = Auth::user(); // Obtém o usuário autenticado

            // Gera o token de autenticação Sanctum
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
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
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',
        ]);

        try {
            // Criando o usuário com a senha criptografada
            $user = \App\Models\User::create([
                'name' => $credentials['name'],
                'email' => $credentials['email'],
                'password' => bcrypt($credentials['password']),
            ]);

            // Verifica se o usuário foi realmente criado
            if (!$user) {
                return response()->json([
                    'message' => 'Erro ao criar usuário. Tente novamente.',
                ], 500);
            }

            // Gerando o token de autenticação
            $token = $user->createToken('auth_token')->plainTextToken;

            // Retornando a resposta com o token e os detalhes do usuário
            return response()->json([
                'message' => 'Usuário registrado com sucesso!',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro interno no servidor.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

}
