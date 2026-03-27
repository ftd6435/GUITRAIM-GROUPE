<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use App\Traits\ApiResponses;
use App\Traits\ImageUpload;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    use ApiResponses, ImageUpload;

    public function index()
    {
        return $this->successResponse(Testimonial::latest()->get());
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
            'is_featured' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $this->imageUpload($request->file('image'), 'testimonials');
        }

        $testimonial = Testimonial::create($validated);
        return $this->successResponse($testimonial, 'Témoignage ajouté avec succès', 201);
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
            'is_featured' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($testimonial->image) {
                $this->deleteImage($testimonial->image, 'testimonials/');
            }
            $validated['image'] = $this->imageUpload($request->file('image'), 'testimonials');
        }

        $testimonial->update($validated);
        return $this->successResponse($testimonial, 'Témoignage mis à jour');
    }

    public function destroy($id)
    {
        $testimonial = Testimonial::findOrFail($id);
        if ($testimonial->image) {
            $this->deleteImage($testimonial->image, 'testimonials/');
        }
        $testimonial->delete();
        return $this->noContentSuccessResponse('Témoignage supprimé');
    }
}
