<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Traits\ApiResponses;
use App\Traits\ImageUpload;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ServiceController extends Controller
{
    use ApiResponses, ImageUpload;

    public function index(Request $request)
    {
        $query = Service::with('sector');

        if ($request->has('sector')) {
            $query->whereHas('sector', function ($q) use ($request) {
                $q->where('slug', $request->sector);
            });
        }

        return $this->successResponse($query->get());
    }

    public function show($slug)
    {
        $service = Service::with('sector')->where('slug', $slug)->firstOrFail();
        return $this->successResponse($service);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sector_id' => 'required|exists:sectors,id',
            'title' => 'required|string|max:150',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        $validated['slug'] = Str::slug($validated['title']);

        if ($request->hasFile('image')) {
            $validated['image'] = $this->imageUpload($request->file('image'), 'services');
        }

        $service = Service::create($validated);
        return $this->successResponse($service, 'Service créé avec succès', 201);
    }

    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);

        $validated = $request->validate([
            'sector_id' => 'sometimes|exists:sectors,id',
            'title' => 'sometimes|string|max:150',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
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

        $service->update($validated);
        return $this->successResponse($service, 'Service mis à jour');
    }

    public function destroy($id)
    {
        $service = Service::findOrFail($id);
        if ($service->image) {
            $this->deleteImage($service->image, 'services/');
        }
        $service->delete();
        return $this->noContentSuccessResponse('Service supprimé');
    }
}
