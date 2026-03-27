<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\JobOffer;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class JobController extends Controller
{
    use ApiResponses;

    public function index()
    {
        return $this->successResponse(JobOffer::with('sector')->latest()->get());
    }

    public function show($id)
    {
        $job = JobOffer::with('sector')->findOrFail($id);
        return $this->successResponse($job);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:150',
            'sector_id' => 'required|exists:sectors,id',
            'contract_type' => ['required', Rule::in(['CDI', 'CDD', 'Stage', 'Freelance'])],
            'location' => 'nullable|string|max:100',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'published_at' => 'nullable|date',
        ]);

        $job = JobOffer::create($validated);
        return $this->successResponse($job, 'Offre d\'emploi créée avec succès', 201);
    }

    public function update(Request $request, $id)
    {
        $job = JobOffer::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:150',
            'sector_id' => 'sometimes|exists:sectors,id',
            'contract_type' => ['sometimes', Rule::in(['CDI', 'CDD', 'Stage', 'Freelance'])],
            'location' => 'nullable|string|max:100',
            'description' => 'sometimes|string',
            'requirements' => 'nullable|string',
            'published_at' => 'nullable|date',
        ]);

        $job->update($validated);
        return $this->successResponse($job, 'Offre d\'emploi mise à jour');
    }

    public function destroy($id)
    {
        $job = JobOffer::findOrFail($id);
        $job->delete();
        return $this->noContentSuccessResponse('Offre d\'emploi supprimée');
    }
}
