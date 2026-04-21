<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClientController extends Controller
{
    use ApiResponses;

    public function index()
    {
        $clients = Client::query()
            ->orderByDesc('id')
            ->get();

        return $this->successResponse($clients);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:individual,company',
            'first_name' => 'nullable|string|max:120|required_if:type,individual',
            'last_name' => 'nullable|string|max:120|required_if:type,individual',
            'company_name' => 'nullable|string|max:180|required_if:type,company',
            'email' => 'nullable|email|max:190',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:500',
            'tax_id' => 'nullable|string|max:120',
        ]);

        $validated['created_by'] = Auth::id();

        $client = Client::create($validated);

        return $this->successResponse($client, 'Client créé avec succès', 201);
    }

    public function update(Request $request, $id)
    {
        $client = Client::findOrFail($id);

        $validated = $request->validate([
            'type' => 'sometimes|in:individual,company',
            'first_name' => 'nullable|string|max:120',
            'last_name' => 'nullable|string|max:120',
            'company_name' => 'nullable|string|max:180',
            'email' => 'nullable|email|max:190',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:500',
            'tax_id' => 'nullable|string|max:120',
        ]);

        $nextType = $validated['type'] ?? $client->type;

        if ($nextType === 'company' && empty($validated['company_name']) && empty($client->company_name)) {
            return response()->json([
                'message' => 'Le nom de la société est obligatoire.',
                'errors' => ['company_name' => ['Le nom de la société est obligatoire.']],
            ], 422);
        }

        if ($nextType === 'individual') {
            $nextFirst = array_key_exists('first_name', $validated) ? $validated['first_name'] : $client->first_name;
            $nextLast = array_key_exists('last_name', $validated) ? $validated['last_name'] : $client->last_name;

            if (empty($nextFirst) || empty($nextLast)) {
                return response()->json([
                    'message' => 'Le prénom et le nom sont obligatoires.',
                    'errors' => [
                        'first_name' => ['Le prénom est obligatoire.'],
                        'last_name' => ['Le nom est obligatoire.'],
                    ],
                ], 422);
            }
        }

        $client->update($validated);

        return $this->successResponse($client->fresh(), 'Client mis à jour');
    }

    public function destroy($id)
    {
        $client = Client::findOrFail($id);
        $client->delete();

        return $this->noContentSuccessResponse('Client supprimé');
    }
}

