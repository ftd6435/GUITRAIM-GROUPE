<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Mail\Newsletter\VerifyNewsletterSubscription;
use App\Models\NewsletterSubscriber;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class NewsletterController extends Controller
{
    use ApiResponses;

    public function index()
    {
        return $this->successResponse(NewsletterSubscriber::with(['createdBy', 'updatedBy'])->latest()->get());
    }

    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
        ]);

        $userId = $request->user()?->id;
        $email = strtolower(trim($validated['email']));
        $subscriber = NewsletterSubscriber::where('email', $email)->first();

        if ($subscriber && $subscriber->is_active) {
            return $this->successResponse(
                ['state' => 'active', 'email' => $subscriber->email],
                'Vous êtes déjà abonné à la newsletter.'
            );
        }

        $plainToken = Str::random(64);
        $tokenHash = hash('sha256', $plainToken);

        if (! $subscriber) {
            $subscriber = NewsletterSubscriber::create([
                'email' => $email,
                'is_active' => false,
                'subscribed_at' => now(),
                'verification_token_hash' => $tokenHash,
                'verification_sent_at' => now(),
                'verified_at' => null,
                'created_by' => $userId,
                'updated_by' => $userId,
            ]);
        } else {
            $subscriber->update([
                'is_active' => false,
                'verification_token_hash' => $tokenHash,
                'verification_sent_at' => now(),
                'verified_at' => null,
                'updated_by' => $userId,
            ]);
        }

        $verificationUrl = url('/newsletter/verify/' . $plainToken);

        Mail::to($subscriber->email)->queue(
            (new VerifyNewsletterSubscription($subscriber, $verificationUrl))->delay(now()->addSeconds(10))
        );

        return $this->successResponse(
            ['state' => 'pending', 'email' => $subscriber->email],
            'Votre inscription est en attente de confirmation. Un email vient de vous être envoyé.',
            201
        );
    }

    public function verify($token)
    {
        $tokenHash = hash('sha256', $token);
        $subscriber = NewsletterSubscriber::where('verification_token_hash', $tokenHash)->first();

        if (! $subscriber) {
            return $this->errorResponse('Lien de confirmation invalide ou expiré.', [], 404);
        }

        $subscriber->update([
            'is_active' => true,
            'verified_at' => now(),
            'verification_token_hash' => null,
            'updated_by' => null,
        ]);

        return $this->successResponse(['state' => 'active', 'email' => $subscriber->email], 'Votre email a été confirmé. Merci !');
    }

    public function verifyWeb($token)
    {
        $response = $this->verify($token);
        $payload = $response->getData(true);
        $ok = ($payload['status'] ?? 0) === 1;

        return redirect('/?newsletter=' . ($ok ? 'verified' : 'invalid'));
    }

    public function destroy($id)
    {
        $subscriber = NewsletterSubscriber::findOrFail($id);
        $subscriber->delete();

        return $this->noContentSuccessResponse('Désinscription réussie');
    }
}
