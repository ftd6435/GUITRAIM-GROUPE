<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Traits\ApiResponses;
use App\Traits\CloudflareUpload;
use Illuminate\Support\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    use ApiResponses, CloudflareUpload;

    public function index(Request $request)
    {
        $query = BlogPost::with(['author', 'category', 'tags', 'createdBy', 'updatedBy']);

        if (! Auth::guard('sanctum')->check()) {
            $query->whereNotNull('published_at');
        }

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
        $query = BlogPost::with(['author', 'category', 'tags', 'createdBy', 'updatedBy'])->where('slug', $slug);

        if (! Auth::guard('sanctum')->check()) {
            $query->whereNotNull('published_at');
        }

        $post = $query->firstOrFail();


        return $this->successResponse($post);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'category_id' => 'nullable|exists:categories,id',
            'excerpt' => 'nullable|string',
            'summary' => 'nullable|string',
            'content' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'reading_time' => 'nullable|integer',
            'published' => 'boolean',
            'published_at' => 'nullable|date',
            'tags' => 'array|exists:tags,id',
        ]);

        if (! isset($validated['excerpt']) && isset($validated['summary'])) {
            $validated['excerpt'] = $validated['summary'];
        }
        unset($validated['summary']);

        if (array_key_exists('published', $validated)) {
            $validated['published_at'] = $validated['published'] ? Carbon::now()->toDateString() : null;
        }
        unset($validated['published']);

        $validated['slug'] = Str::slug($validated['title']);
        $validated['author_id'] = $request->user()->id;
        $validated['created_by'] = $request->user()->id;
        $validated['updated_by'] = $request->user()->id;

        if ($request->hasFile('image')) {
            $validated['image'] = $this->uploadImage($request->file('image'), 'blog');
        }

        if (! isset($validated['reading_time']) || ! $validated['reading_time']) {
            $plain = trim(strip_tags($validated['content'] ?? ''));
            $words = preg_match_all('/\pL+/u', $plain) ?: 0;
            $validated['reading_time'] = max(1, (int) ceil($words / 200));
        }

        $post = BlogPost::create($validated);

        if ($request->has('tags')) {
            $post->tags()->sync($request->tags);
        }

        return $this->successResponse($post->load(['author', 'category', 'tags', 'createdBy', 'updatedBy']), 'Article créé avec succès', 201);
    }

    public function update(Request $request, $id)
    {
        $post = BlogPost::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:200',
            'category_id' => 'nullable|exists:categories,id',
            'excerpt' => 'nullable|string',
            'summary' => 'nullable|string',
            'content' => 'sometimes|string',
            'image' => 'nullable|image|max:2048',
            'reading_time' => 'nullable|integer',
            'published' => 'boolean',
            'published_at' => 'nullable|date',
            'tags' => 'array|exists:tags,id',
        ]);

        if (! isset($validated['excerpt']) && isset($validated['summary'])) {
            $validated['excerpt'] = $validated['summary'];
        }
        unset($validated['summary']);

        if (array_key_exists('published', $validated)) {
            $validated['published_at'] = $validated['published'] ? Carbon::now()->toDateString() : null;
        }
        unset($validated['published']);

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        if ($request->hasFile('image')) {
            if ($post->image) {
                $this->deleteImage($post->image, 'blog/');
            }
            $validated['image'] = $this->uploadImage($request->file('image'), 'blog');
        }

        $validated['updated_by'] = $request->user()->id;
        $post->update($validated);

        if (! isset($validated['reading_time']) || ! $validated['reading_time']) {
            $content = $validated['content'] ?? $post->content ?? '';
            $plain = trim(strip_tags($content));
            $words = preg_match_all('/\pL+/u', $plain) ?: 0;
            $post->update(['reading_time' => max(1, (int) ceil($words / 200))]);
        }

        if ($request->has('tags')) {
            $post->tags()->sync($request->tags);
        }

        return $this->successResponse($post->load(['author', 'category', 'tags', 'createdBy', 'updatedBy']), 'Article mis à jour');
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
