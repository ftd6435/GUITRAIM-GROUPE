<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Traits\ApiResponses;
use App\Traits\ImageUpload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PageController extends Controller
{
    use ApiResponses, ImageUpload;

    public function index(Request $request)
    {
        $defaults = [
            ['slug' => 'accueil', 'title' => 'Accueil'],
            ['slug' => 'services', 'title' => 'Services'],
            ['slug' => 'projets', 'title' => 'Projets'],
            ['slug' => 'blog', 'title' => 'Blog'],
            ['slug' => 'equipe', 'title' => 'Équipe'],
            ['slug' => 'a-propos', 'title' => 'À Propos'],
            ['slug' => 'contact', 'title' => 'Contact'],
        ];

        foreach ($defaults as $item) {
            $exists = Page::where('slug', $item['slug'])->exists();
            if (! $exists) {
                Page::create([
                    'title' => $item['title'],
                    'slug' => $item['slug'],
                    'content' => null,
                    'data' => null,
                    'meta_title' => null,
                    'meta_description' => null,
                    'created_by' => $request->user()?->id,
                    'updated_by' => $request->user()?->id,
                ]);
            }
        }

        return $this->successResponse(Page::with(['createdBy', 'updatedBy'])->orderBy('title')->get());
    }

    public function show($slug)
    {
        $page = Page::with(['createdBy', 'updatedBy'])->where('slug', $slug)->firstOrFail();

        return $this->successResponse($page);
    }

    public function update(Request $request, $slug)
    {
        $page = Page::where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'title' => 'sometimes|string|max:150',
            'content' => 'nullable|string',
            'data' => 'nullable',
            'history_image' => 'nullable|image|max:2048|mimes:jpg,jpeg,png,webp|dimensions:min_width=800,min_height=600',
            'vision_image' => 'nullable|image|max:2048|mimes:jpg,jpeg,png,webp|dimensions:min_width=800,min_height=600',
            'hero_image' => 'nullable|image|max:2048|mimes:jpg,jpeg,png,webp|dimensions:min_width=1200,min_height=600',
            'hero_images' => 'nullable|array|min:2|max:3',
            'hero_images.*' => 'image|max:2048|mimes:jpg,jpeg,png,webp|dimensions:min_width=1200,min_height=600',
            'meta_title' => 'nullable|string|max:150',
            'meta_description' => 'nullable|string',
        ]);

        if (array_key_exists('data', $validated) && is_string($validated['data'])) {
            $decoded = json_decode($validated['data'], true);
            $validated['data'] = is_array($decoded) ? $decoded : null;
        }

        if ($request->hasFile('history_image')) {
            if ($page->history_image) {
                $this->deleteImage($page->history_image, 'pages/');
            }
            $validated['history_image'] = $this->imageUpload($request->file('history_image'), 'pages');
        }

        if ($request->hasFile('vision_image')) {
            if ($page->vision_image) {
                $this->deleteImage($page->vision_image, 'pages/');
            }
            $validated['vision_image'] = $this->imageUpload($request->file('vision_image'), 'pages');
        }

        if ($request->hasFile('hero_image')) {
            if ($page->hero_image) {
                $this->deleteImage($page->hero_image, 'pages/');
            }
            $validated['hero_image'] = $this->imageUpload($request->file('hero_image'), 'pages');
        }

        if ($request->hasFile('hero_images')) {
            $existing = is_array($page->data) && isset($page->data['hero_images']) && is_array($page->data['hero_images'])
                ? $page->data['hero_images']
                : [];

            foreach ($existing as $filename) {
                if ($filename) {
                    $this->deleteImage($filename, 'pages/');
                }
            }

            $uploaded = [];
            foreach ($request->file('hero_images') as $imageFile) {
                $uploaded[] = $this->imageUpload($imageFile, 'pages');
            }

            $nextData = is_array($validated['data'] ?? null) ? $validated['data'] : ($page->data ?? []);
            if (! is_array($nextData)) {
                $nextData = [];
            }
            $nextData['hero_images'] = array_values($uploaded);
            $validated['data'] = $nextData;
        }

        $validated['updated_by'] = $request->user()->id;
        $page->update($validated);

        return $this->successResponse($page->fresh()->load(['createdBy', 'updatedBy']), 'Page mise à jour avec succès');
    }
}
