<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Sector;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class SectorController extends Controller
{
    use ApiResponses;

    public function index()
    {
        if (Auth::guard('sanctum')->check()) {
            return $this->successResponse(Sector::with(['createdBy', 'updatedBy'])->get());
        }

        return $this->successResponse(Sector::with(['createdBy', 'updatedBy'])->where('is_visible', true)->get());
    }

    public function show($slug)
    {
        $query = Sector::with(['createdBy', 'updatedBy'])->where('slug', $slug);

        if (! Auth::guard('sanctum')->check()) {
            $query->where('is_visible', true);
        }

        $sector = $query->firstOrFail();


        return $this->successResponse($sector);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'highlight_title' => 'nullable|string|max:150',
            'highlight_items' => 'nullable|array',
            'highlight_items.*' => 'string|max:150',
            'icon' => 'nullable|string',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $validated['created_by'] = Auth::id();
        $validated['updated_by'] = Auth::id();

        $sector = Sector::create($validated);

        return $this->successResponse($sector->load(['createdBy', 'updatedBy']), 'Secteur créé avec succès', 201);
    }

    public function update(Request $request, $id)
    {
        $sector = Sector::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'description' => 'nullable|string',
            'highlight_title' => 'nullable|string|max:150',
            'highlight_items' => 'nullable|array',
            'highlight_items.*' => 'string|max:150',
            'icon' => 'nullable|string',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $validated['updated_by'] = Auth::id();
        $sector->update($validated);

        return $this->successResponse($sector->fresh()->load(['createdBy', 'updatedBy']), 'Secteur mis à jour');
    }

    public function destroy($id)
    {
        $sector = Sector::findOrFail($id);
        $sector->delete();

        return $this->noContentSuccessResponse('Secteur supprimé');
    }
}
