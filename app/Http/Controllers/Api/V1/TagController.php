<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class TagController extends Controller
{
    use ApiResponses;

    public function index()
    {
        $query = Tag::with(['createdBy', 'updatedBy']);

        if (! Auth::guard('sanctum')->check()) {
            $query->where('status', true);
        }

        return $this->successResponse($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:tags,name',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $validated['created_by'] = $request->user()->id;
        $validated['updated_by'] = $request->user()->id;

        $tag = Tag::create($validated);

        return $this->successResponse($tag->load(['createdBy', 'updatedBy']), 'Tag créé avec succès', 201);
    }

    public function destroy($id)
    {
        $tag = Tag::findOrFail($id);
        $tag->delete();

        return $this->noContentSuccessResponse('Tag supprimé');
    }
}
