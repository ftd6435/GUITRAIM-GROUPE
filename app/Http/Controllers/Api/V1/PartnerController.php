<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use App\Traits\ApiResponses;
use App\Traits\CloudflareUpload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PartnerController extends Controller
{
    use ApiResponses, CloudflareUpload;

    public function index()
    {
        $query = Partner::with(['createdBy', 'updatedBy']);

        if (! Auth::guard('sanctum')->check()) {
            $query->where('is_visible', true);
        }

        return $this->successResponse($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'logo' => 'nullable|image|max:2048',
            'website_url' => 'nullable|url|max:255',
            'is_featured' => 'boolean',
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $this->uploadImage($request->file('logo'), 'partners');
        }

        $validated['created_by'] = $request->user()->id;
        $validated['updated_by'] = $request->user()->id;
        $partner = Partner::create($validated);

        return $this->successResponse($partner->load(['createdBy', 'updatedBy']), 'Partenaire ajouté avec succès', 201);
    }

    public function update(Request $request, $id)
    {
        $partner = Partner::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:150',
            'logo' => 'nullable|image|max:2048',
            'website_url' => 'nullable|url|max:255',
            'is_featured' => 'boolean',
        ]);

        if ($request->hasFile('logo')) {
            if ($partner->logo) {
                $this->deleteImage($partner->logo, 'partners/');
            }
            $validated['logo'] = $this->uploadImage($request->file('logo'), 'partners');
        }

        $validated['updated_by'] = $request->user()->id;
        $partner->update($validated);

        return $this->successResponse($partner->fresh()->load(['createdBy', 'updatedBy']), 'Partenaire mis à jour');
    }

    public function destroy($id)
    {
        $partner = Partner::findOrFail($id);
        if ($partner->logo) {
            $this->deleteImage($partner->logo, 'partners/');
        }
        $partner->delete();

        return $this->noContentSuccessResponse('Partenaire supprimé');
    }
}
