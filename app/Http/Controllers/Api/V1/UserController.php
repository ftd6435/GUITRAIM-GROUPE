<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\ApiResponses;
use App\Traits\ImageUpload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    use ApiResponses, ImageUpload;

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
        /** @var User $authUser */
        $authUser = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => ['required', Rule::in(['super_admin', 'admin', 'editor'])],
            'avatar' => 'nullable|image|max:1024',
        ]);

        // Only super_admin can assign super_admin role
        if ($validated['role'] === 'super_admin' && $authUser->role !== 'super_admin') {
            return $this->errorResponse('Seul un super administrateur peut attribuer le rôle super administrateur', [], 403);
        }

        if ($request->hasFile('avatar')) {
            $validated['avatar'] = $this->imageUpload($request->file('avatar'), 'avatars');
        }

        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        return $this->successResponse($user, 'Utilisateur créé avec succès', 201);
    }

    public function switchStatus(string $id)
    {
        /** @var User $authUser */
        $authUser = Auth::user();

        $user = User::find($id);

        if (! $user) {
            return $this->errorResponse('Utilisateur non trouvé', 404);
        }

        // An auth user should neither be able to update another user's profile nor delete.
        // Unless they are super_admin.
        if ($authUser->id !== $user->id && $authUser->role !== 'super_admin') {
            return $this->errorResponse('Vous n\'êtes pas autorisé à modifier ce profil', [], 403);
        }

        $user->is_active = ! $user->is_active;
        $user->save();

        return $this->successResponse($user, 'Statut de l\'utilisateur modifié avec succès');
    }

    public function switchRole(Request $request, string $id)
    {
        $validated = $request->validate([
            'role' => ['required', Rule::in(['super_admin', 'admin', 'editor'])],
        ]);

        /** @var User $authUser */
        $authUser = Auth::user();

        $user = User::find($id);

        if (! $user) {
            return $this->errorResponse('Utilisateur non trouvé', 404);
        }

        // An auth user should neither be able to update another user's profile nor delete.
        // Unless they are super_admin.
        if ($authUser->id !== $user->id && $authUser->role !== 'super_admin') {
            return $this->errorResponse('Vous n\'êtes pas autorisé à modifier ce profil', [], 403);
        }

        $user->role = $validated['role'];
        $user->save();

        return $this->successResponse($user, 'Rôle de l\'utilisateur modifié avec succès');
    }

    public function update(Request $request, User $user)
    {
        /** @var User $authUser */
        $authUser = Auth::user();

        // An auth user should neither be able to update another user's profile nor delete.
        // Unless they are super_admin.
        if ($authUser->id !== $user->id && $authUser->role !== 'super_admin') {
            return $this->errorResponse('Vous n\'êtes pas autorisé à modifier ce profil', [], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'email' => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'sometimes|string|min:8|confirmed',
            'current_password' => 'required_with:password|string',
            'role' => ['sometimes', Rule::in(['super_admin', 'admin', 'editor'])],
            'avatar' => 'nullable|image|max:1024',
            'is_active' => 'sometimes|boolean',
        ]);

        // Check current password if updating password
        if (isset($validated['password'])) {
            if (! Hash::check($validated['current_password'], $user->password)) {
                return $this->errorResponse('L\'ancien mot de passe est incorrect', ['current_password' => ['L\'ancien mot de passe est incorrect']], 422);
            }
            $validated['password'] = Hash::make($validated['password']);
            unset($validated['current_password']);
        }

        // Only super_admin can change status or role of others
        if ($authUser->id !== $user->id || $authUser->role !== 'super_admin') {
            if (isset($validated['role']) && $validated['role'] !== $user->role) {
                if ($authUser->role !== 'super_admin') {
                    return $this->errorResponse('Seul un super administrateur peut changer les rôles', [], 403);
                }
                // Only super_admin can assign super_admin role
                if ($validated['role'] === 'super_admin' && $authUser->role !== 'super_admin') {
                    return $this->errorResponse('Seul un super administrateur peut attribuer le rôle super administrateur', [], 403);
                }
            }

            if (isset($validated['is_active']) && $validated['is_active'] != $user->is_active) {
                if ($authUser->role !== 'super_admin') {
                    return $this->errorResponse('Seul un super administrateur peut activer ou désactiver des comptes', [], 403);
                }
            }
        }

        if ($request->hasFile('avatar')) {
            // Supprimer l'ancien avatar s'il existe
            if ($user->avatar) {
                $this->deleteImage($user->avatar, 'avatars/');
            }
            $validated['avatar'] = $this->imageUpload($request->file('avatar'), 'avatars');
        }

        $user->update($validated);

        return $this->successResponse($user, 'Utilisateur mis à jour');
    }

    public function destroy(User $user)
    {
        /** @var User $authUser */
        $authUser = Auth::user();

        // Only super_admin can delete another user
        if ($authUser->role !== 'super_admin') {
            return $this->errorResponse('Seul un super administrateur peut supprimer des utilisateurs', [], 403);
        }

        if ($user->id === $authUser->id) {
            return $this->errorResponse('Vous ne pouvez pas supprimer votre propre compte', [], 403);
        }

        if ($user->avatar) {
            $this->deleteImage($user->avatar, 'avatars/');
        }

        $user->delete();

        return $this->noContentSuccessResponse('Utilisateur supprimé');
    }
}
