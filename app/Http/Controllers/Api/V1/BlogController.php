<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Traits\ApiResponses;
use App\Traits\ImageUpload;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    use ApiResponses, ImageUpload;

    public function index(Request $request)
    {
        $query = BlogPost::with(['author', 'category', 'tags']);

        if ($request->has('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        if ($request->has('tag')) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->where('slug', $request->tag);
            });
        }

        return $this->successResponse($query->latest()->get());
    }

    public function show($slug)
    {
        $post = BlogPost::with(['author', 'category', 'tags'])->where('slug', $slug)->firstOrFail();
        return $this->successResponse($post);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'category_id' => 'nullable|exists:categories,id',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'reading_time' => 'nullable|integer',
            'published_at' => 'nullable|date',
            'tags' => 'array|exists:tags,id',
        ]);

        $validated['slug'] = Str::slug($validated['title']);
        $validated['author_id'] = $request->user()->id;

        if ($request->hasFile('image')) {
            $validated['image'] = $this->imageUpload($request->file('image'), 'blog');
        }

        $post = BlogPost::create($validated);

        if ($request->has('tags')) {
            $post->tags()->sync($request->tags);
        }

        return $this->successResponse($post->load(['author', 'category', 'tags']), 'Article créé avec succès', 201);
    }

    public function update(Request $request, $id)
    {
        $post = BlogPost::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:200',
            'category_id' => 'nullable|exists:categories,id',
            'excerpt' => 'nullable|string',
            'content' => 'sometimes|string',
            'image' => 'nullable|image|max:2048',
            'reading_time' => 'nullable|integer',
            'published_at' => 'nullable|date',
            'tags' => 'array|exists:tags,id',
        ]);

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        if ($request->hasFile('image')) {
            if ($post->image) {
                $this->deleteImage($post->image, 'blog/');
            }
            $validated['image'] = $this->imageUpload($request->file('image'), 'blog');
        }

        $post->update($validated);

        if ($request->has('tags')) {
            $post->tags()->sync($request->tags);
        }

        return $this->successResponse($post->load(['author', 'category', 'tags']), 'Article mis à jour');
    }

    public function destroy($id)
    {
        $post = BlogPost::findOrFail($id);
        if ($post->image) {
            $this->deleteImage($post->image, 'blog/');
        }
        $post->delete();
        return $this->noContentSuccessResponse('Article supprimé');
    }
}
