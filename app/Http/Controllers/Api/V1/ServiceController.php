<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\ServiceImage;
use App\Traits\ApiResponses;
use App\Traits\ImageUpload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ServiceController extends Controller
{
    use ApiResponses, ImageUpload;

    public function index(Request $request)
    {
        $query = Service::with(['sector', 'images', 'createdBy', 'updatedBy']);

        if ($request->has('sector')) {
            $query->whereHas('sector', function ($q) use ($request) {
                $q->where('slug', $request->sector);
            });
        }

        if (! Auth::guard('sanctum')->check()) {
            $query->where('is_visible', true);
        }

        return $this->successResponse($query->get());
    }

    public function show($slug)
    {
        $query = Service::with(['sector', 'images', 'createdBy', 'updatedBy'])->where('slug', $slug);

        if (! Auth::guard('sanctum')->check()) {
            $query->where('is_visible', true);
        }

        $service = $query->firstOrFail();


        return $this->successResponse($service);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'is_visible' => 'boolean',
            'sector_id' => 'required|exists:sectors,id',
            'title' => 'required|string|max:150',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'image' => 'nullable|image|max:2048|mimes:jpg,jpeg,png,webp|dimensions:min_width=800,min_height=600',
            'images' => 'nullable|array|max:4',
            'images.*' => 'image|max:2048|mimes:jpg,jpeg,png,webp|dimensions:min_width=600,min_height=600',
        ]);

        $validated['slug'] = Str::slug($validated['title']);
        $validated['created_by'] = Auth::id();
        $validated['updated_by'] = Auth::id();

        if ($request->hasFile('image')) {
            $validated['image'] = $this->imageUpload($request->file('image'), 'services');
        }

        $service = Service::create($validated);

        if ($request->hasFile('images')) {
            $uploaded = [];
            foreach ($request->file('images') as $index => $imageFile) {
                $imageName = $this->imageUpload($imageFile, 'services');
                $uploaded[] = ServiceImage::create([
                    'service_id' => $service->id,
                    'image' => $imageName,
                    'sort_order' => $index,
                    'created_by' => Auth::id(),
                    'updated_by' => Auth::id(),
                ]);
            }
        }

        return $this->successResponse($service->load(['sector', 'images', 'createdBy', 'updatedBy']), 'Service créé avec succès', 201);
    }

    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);

        $validated = $request->validate([
            'is_visible' => 'boolean',
            'sector_id' => 'sometimes|exists:sectors,id',
            'title' => 'sometimes|string|max:150',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'image' => 'nullable|image|max:2048|mimes:jpg,jpeg,png,webp|dimensions:min_width=800,min_height=600',
            'images' => 'nullable|array|max:4',
            'images.*' => 'image|max:2048|mimes:jpg,jpeg,png,webp|dimensions:min_width=600,min_height=600',
        ]);

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        if ($request->hasFile('image')) {
            if ($service->image) {
                $this->deleteImage($service->image, 'services/');
            }
            $validated['image'] = $this->imageUpload($request->file('image'), 'services');
        }

        $validated['updated_by'] = Auth::id();
        $service->update($validated);

        if ($request->hasFile('images')) {
            $existing = $service->images()->orderBy('sort_order')->get();
            foreach ($existing as $img) {
                $this->deleteImage($img->image, 'services/');
                $img->delete();
            }

            foreach ($request->file('images') as $index => $imageFile) {
                $imageName = $this->imageUpload($imageFile, 'services');
                ServiceImage::create([
                    'service_id' => $service->id,
                    'image' => $imageName,
                    'sort_order' => $index,
                    'created_by' => $service->created_by,
                    'updated_by' => Auth::id(),
                ]);
            }
        }

        return $this->successResponse($service->fresh()->load(['sector', 'images', 'createdBy', 'updatedBy']), 'Service mis à jour');
    }

    public function destroy($id)
    {
        $service = Service::findOrFail($id);
        if ($service->image) {
            $this->deleteImage($service->image, 'services/');
        }
        foreach ($service->images as $image) {
            $this->deleteImage($image->image, 'services/');
        }
        $service->delete();

        return $this->noContentSuccessResponse('Service supprimé');
    }
}
