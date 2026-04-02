<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    use ApiResponses;

    public function index()
    {
        return $this->successResponse(Contact::with(['createdBy', 'updatedBy'])->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:150',
            'email' => 'required|email|max:150',
            'phone' => 'nullable|string|max:50',
            'sector' => 'nullable|string|max:100',
            'project_type' => 'nullable|string|max:100',
            'message' => 'required|string',
        ]);

        $userId = $request->user()?->id;
        $validated['created_by'] = $userId;
        $validated['updated_by'] = $userId;

        $contact = Contact::create($validated);

        return $this->successResponse($contact->load(['createdBy', 'updatedBy']), 'Message envoyé avec succès', 201);
    }

    public function destroy($id)
    {
        $contact = Contact::findOrFail($id);
        $contact->delete();

        return $this->noContentSuccessResponse('Message supprimé');
    }
}
