<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use App\Traits\ApiResponses;
use App\Traits\ImageUpload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeamController extends Controller
{
    use ApiResponses, ImageUpload;

    public function index(Request $request)
    {
        $query = TeamMember::query();

        if ($request->has('department')) {
            $query->where('department', $request->department);
        }

        if (! Auth::guard('sanctum')->check()) {
            $query->where('is_visible', true);
        }

        return $this->successResponse($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'position' => 'nullable|string|max:150',
            'department' => 'nullable|string|max:100',
            'bio' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'avatar' => 'nullable|image|max:1024',
            'linkedin_url' => 'nullable|url|max:255',
            'is_management' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $this->imageUpload($request->file('image'), 'team');
        }

        if ($request->hasFile('avatar')) {
            $validated['avatar'] = $this->imageUpload($request->file('avatar'), 'avatars');
        }

        $member = TeamMember::create($validated);
        return $this->successResponse($member, 'Membre de l\'équipe ajouté avec succès', 201);
    }

    public function update(Request $request, $id)
    {
        $member = TeamMember::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:150',
            'position' => 'nullable|string|max:150',
            'department' => 'nullable|string|max:100',
            'bio' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'avatar' => 'nullable|image|max:1024',
            'linkedin_url' => 'nullable|url|max:255',
            'is_management' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($member->image) {
                $this->deleteImage($member->image, 'team/');
            }
            $validated['image'] = $this->imageUpload($request->file('image'), 'team');
        }

        if ($request->hasFile('avatar')) {
            if ($member->avatar) {
                $this->deleteImage($member->avatar, 'avatars/');
            }
            $validated['avatar'] = $this->imageUpload($request->file('avatar'), 'avatars');
        }

        $member->update($validated);
        return $this->successResponse($member, 'Membre de l\'équipe mis à jour');
    }

    public function destroy($id)
    {
        $member = TeamMember::findOrFail($id);
        if ($member->image) {
            $this->deleteImage($member->image, 'team/');
        }
        if ($member->avatar) {
            $this->deleteImage($member->avatar, 'avatars/');
        }
        $member->delete();
        return $this->noContentSuccessResponse('Membre de l\'équipe supprimé');
    }
}
