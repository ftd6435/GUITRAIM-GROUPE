<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    use ApiResponses;

    public function index()
    {
        return $this->successResponse(User::all());
    }

    public function show(User $user)
    {
        return $this->successResponse($user);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => ['required', Rule::in(['admin', 'editor'])],
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);
        return $this->successResponse($user, 'Utilisateur créé avec succès', 201);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'email' => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'sometimes|string|min:8',
            'role' => ['sometimes', Rule::in(['admin', 'editor'])],
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);
        return $this->successResponse($user, 'Utilisateur mis à jour');
    }

    public function destroy(User $user)
    {
        $userId = Auth::id();
        if ($user->id === $userId) {
            return $this->errorResponse('Vous ne pouvez pas supprimer votre propre compte', [], 403);
        }

        $user->delete();
        return $this->noContentSuccessResponse('Utilisateur supprimé');
    }
}
