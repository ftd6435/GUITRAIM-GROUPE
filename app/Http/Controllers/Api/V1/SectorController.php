<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Sector;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class SectorController extends Controller
{
    use ApiResponses;

    public function index()
    {
        if (Auth::guard('sanctum')->check()) {
            return $this->successResponse(Sector::all());
        }
        return $this->successResponse(Sector::where('is_visible', true)->get());
    }

    public function show($slug)
    {
        $sector = Sector::where('slug', $slug)->firstOrFail();
        return $this->successResponse($sector);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $sector = Sector::create($validated);
        return $this->successResponse($sector, 'Secteur créé avec succès', 201);
    }

    public function update(Request $request, $id)
    {
        $sector = Sector::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $sector->update($validated);
        return $this->successResponse($sector, 'Secteur mis à jour');
    }

    public function destroy($id)
    {
        $sector = Sector::findOrFail($id);
        $sector->delete();
        return $this->noContentSuccessResponse('Secteur supprimé');
    }
}
