<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\BlogComment;
use App\Models\BlogPost;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BlogCommentController extends Controller
{
    use ApiResponses;

    public function publicIndex($slug)
    {
        $postQuery = BlogPost::where('slug', $slug);
        if (! Auth::guard('sanctum')->check()) {
            $postQuery->whereNotNull('published_at');
        }
        $post = $postQuery->firstOrFail();

        $comments = BlogComment::where('blog_post_id', $post->id)
            ->where('is_approved', true)
            ->latest()
            ->get();

        return $this->successResponse($comments);
    }

    public function store(Request $request, $slug)
    {
        $postQuery = BlogPost::where('slug', $slug);
        if (! Auth::guard('sanctum')->check()) {
            $postQuery->whereNotNull('published_at');
        }
        $post = $postQuery->firstOrFail();

        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'nullable|email|max:150',
            'body' => [
                'required',
                'string',
                'max:5000',
                function ($attribute, $value, $fail) {
                    if ($this->containsInsults($value)) {
                        $fail('Le commentaire contient des termes inappropriés.');
                    }
                },
            ],
        ]);

        $isAuthenticated = Auth::guard('sanctum')->check();

        $comment = BlogComment::create([
            'blog_post_id' => $post->id,
            'name' => $validated['name'],
            'email' => $validated['email'] ?? null,
            'body' => $validated['body'],
            'is_approved' => $isAuthenticated,
            'created_by' => $isAuthenticated ? Auth::id() : null,
            'updated_by' => $isAuthenticated ? Auth::id() : null,
        ]);

        return $this->successResponse(
            $comment,
            $isAuthenticated ? 'Commentaire publié.' : 'Merci ! Votre commentaire a été envoyé et sera publié après validation.',
            201
        );
    }

    public function index(Request $request)
    {
        $query = BlogComment::with(['post:id,title,slug', 'createdBy:id,name', 'updatedBy:id,name']);

        if ($request->has('post_id')) {
            $query->where('blog_post_id', $request->post_id);
        }

        if ($request->has('approved')) {
            $query->where('is_approved', filter_var($request->approved, FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%')
                    ->orWhere('body', 'like', '%' . $search . '%')
                    ->orWhereHas('post', function ($p) use ($search) {
                        $p->where('title', 'like', '%' . $search . '%');
                    });
            });
        }

        return $this->successResponse($query->latest()->get());
    }

    public function update(Request $request, $id)
    {
        $comment = BlogComment::findOrFail($id);

        $validated = $request->validate([
            'is_approved' => 'sometimes|boolean',
            'body' => [
                'sometimes',
                'string',
                'max:5000',
                function ($attribute, $value, $fail) {
                    if ($this->containsInsults($value)) {
                        $fail('Le commentaire contient des termes inappropriés.');
                    }
                },
            ],
        ]);

        $validated['updated_by'] = $request->user()->id;
        $comment->update($validated);

        return $this->successResponse($comment->load(['post:id,title,slug']), 'Commentaire mis à jour');
    }

    public function destroy(Request $request, $id)
    {
        $comment = BlogComment::findOrFail($id);
        $comment->delete();

        return $this->noContentSuccessResponse('Commentaire supprimé');
    }

    private function containsInsults($value): bool
    {
        $text = mb_strtolower((string) $value);
        $badWords = [
            'fuck',
            'fucking',
            'shit',
            'bitch',
            'asshole',
            'dick',
            'pussy',
            'putain',
            'merde',
            'connard',
            'connasse',
            'salope',
            'enculé',
            'encule',
            'enculer',
            'batard',
            'bâtard',
            'pute',
            'fdp',
            'fils de pute',
            'ta mère',
            'ta mere',
            'nique',
            'nique ta mère',
            'nique ta mere',
            'tg',
            'ntm',
        ];

        foreach ($badWords as $bad) {
            $needle = mb_strtolower($bad);
            if (str_contains($text, $needle)) {
                return true;
            }
        }

        return false;
    }
}
