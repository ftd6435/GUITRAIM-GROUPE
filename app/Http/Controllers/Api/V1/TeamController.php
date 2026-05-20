<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use App\Traits\ApiResponses;
use App\Traits\CloudflareUpload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeamController extends Controller
{
    use ApiResponses, CloudflareUpload;

    public function adminIndex(Request $request)
    {
        $query = TeamMember::with(['createdBy', 'updatedBy']);

        if ($request->has('department')) {
            $query->where('department', $request->department);
        }

        return $this->successResponse($query->get());
    }

    public function index(Request $request)
    {
        $query = TeamMember::with(['createdBy', 'updatedBy']);

        if ($request->has('department')) {
            $query->where('department', $request->department);
        }

        $query->where('is_visible', true);

        return $this->successResponse($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'is_visible' => 'boolean',
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
            $validated['image'] = $this->uploadImage($request->file('image'), 'team');
        }

        if ($request->hasFile('avatar')) {
            $validated['avatar'] = $this->uploadImage($request->file('avatar'), 'avatars');
        }

        $validated['created_by'] = $request->user()->id;
        $validated['updated_by'] = $request->user()->id;
        $member = TeamMember::create($validated);

        return $this->successResponse($member->load(['createdBy', 'updatedBy']), 'Membre de l\'équipe ajouté avec succès', 201);
    }

    public function update(Request $request, $id)
    {
        $member = TeamMember::findOrFail($id);

        $validated = $request->validate([
            'is_visible' => 'boolean',
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
            $validated['image'] = $this->uploadImage($request->file('image'), 'team');
        }

        if ($request->hasFile('avatar')) {
            if ($member->avatar) {
                $this->deleteImage($member->avatar, 'avatars/');
            }
            $validated['avatar'] = $this->uploadImage($request->file('avatar'), 'avatars');
        }

        $validated['updated_by'] = $request->user()->id;
        $member->update($validated);

        return $this->successResponse($member->fresh()->load(['createdBy', 'updatedBy']), 'Membre de l\'équipe mis à jour');
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
