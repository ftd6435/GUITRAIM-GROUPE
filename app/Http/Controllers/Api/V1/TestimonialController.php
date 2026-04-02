<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use App\Traits\ApiResponses;
use App\Traits\ImageUpload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TestimonialController extends Controller
{
    use ApiResponses, ImageUpload;

    public function index()
    {
        $query = Testimonial::with(['createdBy', 'updatedBy']);

        if (! Auth::guard('sanctum')->check()) {
            $query->where('is_visible', true);
        }

        return $this->successResponse($query->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'company' => 'nullable|string|max:150',
            'position' => 'nullable|string|max:150',
            'content' => 'required|string',
            'rating' => 'nullable|integer|min:1|max:5',
            'image' => 'nullable|image|max:2048',
            'avatar' => 'nullable|image|max:1024',
            'is_featured' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $this->imageUpload($request->file('image'), 'testimonials');
        }

        if ($request->hasFile('avatar')) {
            $validated['avatar'] = $this->imageUpload($request->file('avatar'), 'avatars');
        }

        $validated['created_by'] = $request->user()->id;
        $validated['updated_by'] = $request->user()->id;
        $testimonial = Testimonial::create($validated);

        return $this->successResponse($testimonial->load(['createdBy', 'updatedBy']), 'Témoignage ajouté avec succès', 201);
    }

    public function update(Request $request, $id)
    {
        $testimonial = Testimonial::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:150',
            'company' => 'nullable|string|max:150',
            'position' => 'nullable|string|max:150',
            'content' => 'sometimes|string',
            'rating' => 'nullable|integer|min:1|max:5',
            'image' => 'nullable|image|max:2048',
            'avatar' => 'nullable|image|max:1024',
            'is_featured' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($testimonial->image) {
                $this->deleteImage($testimonial->image, 'testimonials/');
            }
            $validated['image'] = $this->imageUpload($request->file('image'), 'testimonials');
        }

        if ($request->hasFile('avatar')) {
            if ($testimonial->avatar) {
                $this->deleteImage($testimonial->avatar, 'avatars/');
            }
            $validated['avatar'] = $this->imageUpload($request->file('avatar'), 'avatars');
        }

        $validated['updated_by'] = $request->user()->id;
        $testimonial->update($validated);

        return $this->successResponse($testimonial->fresh()->load(['createdBy', 'updatedBy']), 'Témoignage mis à jour');
    }

    public function destroy($id)
    {
        $testimonial = Testimonial::findOrFail($id);
        if ($testimonial->image) {
            $this->deleteImage($testimonial->image, 'testimonials/');
        }
        if ($testimonial->avatar) {
            $this->deleteImage($testimonial->avatar, 'avatars/');
        }
        $testimonial->delete();

        return $this->noContentSuccessResponse('Témoignage supprimé');
    }
}
