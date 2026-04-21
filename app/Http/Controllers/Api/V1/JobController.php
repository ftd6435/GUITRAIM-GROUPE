<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\JobOffer;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;

class JobController extends Controller
{
    use ApiResponses;

    public function adminIndex()
    {
        return $this->successResponse(
            JobOffer::with(['sector', 'createdBy', 'updatedBy'])->latest()->get()
        );
    }

    public function index()
    {
        return $this->successResponse(
            JobOffer::with(['sector', 'createdBy', 'updatedBy'])
                ->where('is_visible', true)
                ->latest()
                ->get()
        );
    }

    public function show($id)
    {
        $job = JobOffer::with(['sector', 'createdBy', 'updatedBy'])
            ->where('is_visible', true)
            ->whereKey($id)
            ->firstOrFail();


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
            'is_visible' => 'boolean',
        ]);

        if (($validated['is_visible'] ?? false) && empty($validated['published_at'])) {
            $validated['published_at'] = Carbon::today()->toDateString();
        }

        $validated['created_by'] = $request->user()->id;
        $validated['updated_by'] = $request->user()->id;
        $job = JobOffer::create($validated);

        return $this->successResponse($job->load(['sector', 'createdBy', 'updatedBy']), 'Offre d\'emploi créée avec succès', 201);
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
            'is_visible' => 'boolean',
        ]);

        if (array_key_exists('is_visible', $validated) && $validated['is_visible'] && empty($validated['published_at']) && empty($job->published_at)) {
            $validated['published_at'] = Carbon::today()->toDateString();
        }

        $validated['updated_by'] = $request->user()->id;
        $job->update($validated);

        return $this->successResponse($job->fresh()->load(['sector', 'createdBy', 'updatedBy']), 'Offre d\'emploi mise à jour');
    }

    public function destroy($id)
    {
        $job = JobOffer::findOrFail($id);
        $job->delete();

        return $this->noContentSuccessResponse('Offre d\'emploi supprimée');
    }
}
