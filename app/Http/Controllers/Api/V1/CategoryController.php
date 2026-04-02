<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    use ApiResponses;

    public function index()
    {
        return $this->successResponse(Category::with(['createdBy', 'updatedBy'])->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:categories,name',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $validated['created_by'] = $request->user()->id;
        $validated['updated_by'] = $request->user()->id;

        $category = Category::create($validated);

        return $this->successResponse($category->load(['createdBy', 'updatedBy']), 'Catégorie créée avec succès', 201);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', Rule::unique('categories')->ignore($category->id)],
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $validated['updated_by'] = $request->user()->id;
        $category->update($validated);

        return $this->successResponse($category->fresh()->load(['createdBy', 'updatedBy']), 'Catégorie mise à jour');
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return $this->noContentSuccessResponse('Catégorie supprimée');
    }
}
