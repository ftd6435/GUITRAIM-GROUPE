<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    use ApiResponses;

    public function index()
    {
        return $this->successResponse(NewsletterSubscriber::latest()->get());
    }

    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:newsletter_subscribers,email',
        ]);

        $subscriber = NewsletterSubscriber::create([
            'email' => $validated['email'],
            'is_active' => true,
            'subscribed_at' => now(),
        ]);

        return $this->successResponse($subscriber, 'Inscription réussie', 201);
    }

    public function destroy($id)
    {
        $subscriber = NewsletterSubscriber::findOrFail($id);
        $subscriber->delete();
        return $this->noContentSuccessResponse('Désinscription réussie');
    }
}
