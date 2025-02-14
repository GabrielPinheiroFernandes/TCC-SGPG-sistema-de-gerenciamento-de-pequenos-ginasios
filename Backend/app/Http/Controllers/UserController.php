<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        // Pega o parâmetro 'name' da query string
        $name = $request->query('first_name');

        if ($name) {
            // Se o parâmetro 'name' for passado, faz a busca com filtro no primeiro nome e paginada
            $users = User::where('first_name', 'like', '%' . $name . '%')  // '%' permite buscar qualquer valor contendo o nome
                        ->paginate(10);  // Paginação
        } else {
            // Se o parâmetro 'name' não for passado, pega todos os usuários com paginação
            $users = User::paginate(10);
        }

        return response()->json($users);
    }

    // Função show corrigida para buscar usuários por ID
    public function show($id)
    {
        // Busca o usuário pelo ID
        $user = User::find($id);

        // Verifica se o usuário foi encontrado
        if ($user) {
            return response()->json($user);
        }

        // Caso não encontre o usuário
        return response()->json(['message' => 'User not found'], 404);
    }
}
