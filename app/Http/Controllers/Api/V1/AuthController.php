<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use ApiResponses;

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return $this->errorResponse('Identifiants invalides', [], 401);
        }

        if (! $user->is_active) {
            return $this->errorResponse('Votre compte a été désactivé. Veuillez contacter l\'administrateur.', [], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->successResponseWithToken($user, $token, 'Connexion réussie');
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return $this->noContentSuccessResponse('Déconnexion réussie');
    }

    public function me(Request $request)
    {
        return $this->successResponse($request->user());
    }
}
