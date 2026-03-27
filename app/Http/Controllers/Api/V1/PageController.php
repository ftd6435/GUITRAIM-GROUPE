<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;

class PageController extends Controller
{
    use ApiResponses;

    public function show($slug)
    {
        $page = Page::where('slug', $slug)->firstOrFail();
        return $this->successResponse($page);
    }

    public function update(Request $request, $slug)
    {
        $page = Page::where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'title' => 'sometimes|string|max:150',
            'content' => 'nullable|string',
            'meta_title' => 'nullable|string|max:150',
            'meta_description' => 'nullable|string',
        ]);

        $page->update($validated);
        return $this->successResponse($page, 'Page mise à jour avec succès');
    }
}
