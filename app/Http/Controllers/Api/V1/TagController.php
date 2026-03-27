<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TagController extends Controller
{
    use ApiResponses;

    public function index()
    {
        return $this->successResponse(Tag::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:tags,name',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $tag = Tag::create($validated);
        return $this->successResponse($tag, 'Tag créé avec succès', 201);
    }

    public function destroy($id)
    {
        $tag = Tag::findOrFail($id);
        $tag->delete();
        return $this->noContentSuccessResponse('Tag supprimé');
    }
}
