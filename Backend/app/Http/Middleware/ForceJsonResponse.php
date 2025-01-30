<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class ForceJsonResponse
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Illuminate\Http\Response
     */
    public function handle(Request $request, Closure $next)
    {
        Log::debug('Middleware ForceJsonResponse chamado', [
            'url' => $request->url(),
            'method' => $request->method(),
        ]);

        // Se a requisição é para a API e a resposta não for JSON, converta para JSON
        $response = $next($request);

        // Se a resposta não for uma instância de Response e for uma view, force uma resposta JSON
        if ($request->is('api/*') && !$response instanceof Response) {
            return response()->json([
                'message' => 'This is a default message.',
            ]);
        }

        // Certifique-se de forçar o cabeçalho Content-Type para application/json
        return $response->header('Content-Type', 'application/json');
    }
}
