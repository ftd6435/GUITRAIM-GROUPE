<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectImage;
use App\Traits\ApiResponses;
use App\Traits\ImageUpload;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    use ApiResponses, ImageUpload;

    public function index(Request $request)
    {
        $query = Project::with(['sector', 'images', 'tags']);

        if ($request->has('sector')) {
            $query->whereHas('sector', function ($q) use ($request) {
                $q->where('slug', $request->sector);
            });
        }

        if ($request->has('featured')) {
            $query->where('featured', filter_var($request->featured, FILTER_VALIDATE_BOOLEAN));
        }

        return $this->successResponse($query->get());
    }

    public function show($slug)
    {
        $project = Project::with(['sector', 'images', 'tags'])->where('slug', $slug)->firstOrFail();
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

        $project = Project::create($validated);

        if ($request->has('tags')) {
            $project->tags()->sync($request->tags);
        }

        return $this->successResponse($project->load(['sector', 'tags']), 'Projet créé avec succès', 201);
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

        $project->update($validated);

        if ($request->has('tags')) {
            $project->tags()->sync($request->tags);
        }

        return $this->successResponse($project->load(['sector', 'tags']), 'Projet mis à jour');
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
            $imageName = $this->imageUpload($imageFile, 'projects');
            $projectImage = ProjectImage::create([
                'project_id' => $project->id,
                'image_url' => $imageName,
            ]);
            $uploadedImages[] = $projectImage;
        }

        return $this->successResponse($uploadedImages, 'Images téléchargées avec succès');
    }

    public function deleteImage($id)
    {
        $image = ProjectImage::findOrFail($id);
        $this->deleteImage($image->image_url, 'projects/');
        $image->delete();
        return $this->noContentSuccessResponse('Image supprimée');
    }
}
