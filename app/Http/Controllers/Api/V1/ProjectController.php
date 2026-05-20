<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectImage;
use App\Traits\ApiResponses;
use App\Traits\CloudflareUpload;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    use ApiResponses, CloudflareUpload;

    public function index(Request $request)
    {
        $query = Project::with(['sector', 'images', 'tags', 'createdBy', 'updatedBy']);

        if ($request->has('sector')) {
            $query->whereHas('sector', function ($q) use ($request) {
                $q->where('slug', $request->sector);
            });
        }

        if ($request->has('featured')) {
            $query->where('featured', filter_var($request->featured, FILTER_VALIDATE_BOOLEAN));
        }

        if (! Auth::guard('sanctum')->check()) {
            $query->where('is_visible', true);
        }

        return $this->successResponse($query->get());
    }

    public function show($slug)
    {
        $query = Project::with(['sector', 'images', 'tags', 'createdBy', 'updatedBy'])->where('slug', $slug);

        if (! Auth::guard('sanctum')->check()) {
            $query->where('is_visible', true);
        }

        $project = $query->firstOrFail();


        return $this->successResponse($project);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sector_id' => 'required|exists:sectors,id',
            'title' => 'required|string|max:150',
            'location' => 'nullable|string|max:150',
            'year' => 'nullable|integer',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'featured' => 'boolean',
            'tags' => 'array|exists:tags,id',
        ]);

        $validated['slug'] = Str::slug($validated['title']);
        $validated['created_by'] = Auth::id();
        $validated['updated_by'] = Auth::id();

        $project = Project::create($validated);

        if ($request->has('tags')) {
            $project->tags()->sync($request->tags);
        }

        return $this->successResponse($project->load(['sector', 'tags', 'createdBy', 'updatedBy']), 'Projet créé avec succès', 201);
    }

    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $validated = $request->validate([
            'sector_id' => 'sometimes|exists:sectors,id',
            'title' => 'sometimes|string|max:150',
            'location' => 'nullable|string|max:150',
            'year' => 'nullable|integer',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'featured' => 'boolean',
            'tags' => 'array|exists:tags,id',
        ]);

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $validated['updated_by'] = Auth::id();
        $project->update($validated);

        if ($request->has('tags')) {
            $project->tags()->sync($request->tags);
        }

        return $this->successResponse($project->load(['sector', 'tags', 'createdBy', 'updatedBy']), 'Projet mis à jour');
    }

    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        foreach ($project->images as $image) {
            $this->deleteImage($image->image_url, 'projects/');
        }
        $project->delete();

        return $this->noContentSuccessResponse('Projet supprimé');
    }

    public function uploadImages(Request $request, $id)
    {
        $project = Project::findOrFail($id);
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'image|max:2048',
        ]);

        $uploadedImages = [];
        foreach ($request->file('images') as $imageFile) {
            $imageName = $this->uploadImage($imageFile, 'projects');
            $projectImage = ProjectImage::create([
                'project_id' => $project->id,
                'image_url' => $imageName,
                'created_by' => Auth::id(),
                'updated_by' => Auth::id(),
            ]);
            $uploadedImages[] = $projectImage;
        }

        $uploadedImagesCollection = new Collection($uploadedImages);

        return $this->successResponse($uploadedImagesCollection->load(['createdBy', 'updatedBy']), 'Images téléchargées avec succès');
    }

    public function destroyImage($id)
    {
        $image = ProjectImage::findOrFail($id);
        $this->deleteImage($image->image_url, 'projects/');
        $image->delete();

        return $this->noContentSuccessResponse('Image supprimée');
    }
}
