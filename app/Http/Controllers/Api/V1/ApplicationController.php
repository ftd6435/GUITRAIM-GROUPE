<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Mail\Application\AdminApplicationReceived;
use App\Mail\Application\ApplicantApplicationConfirmation;
use App\Models\Application;
use App\Models\Setting;
use App\Traits\ApiResponses;
use App\Traits\ImageUpload;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;

class ApplicationController extends Controller
{
    use ApiResponses, ImageUpload;

    public function index()
    {
        return $this->successResponse(Application::with(['job', 'createdBy', 'updatedBy'])->latest()->get());
    }

    public function summary(Request $request)
    {
        $since = Carbon::now()->subDay();

        $new = (int) Application::query()
            ->where('status', 'new')
            ->count();

        $new24h = (int) Application::query()
            ->where('status', 'new')
            ->where('created_at', '>=', $since)
            ->count();

        $total = (int) Application::query()->count();

        return $this->successResponse([
            'new' => $new,
            'new_24h' => $new24h,
            'total' => $total,
            'since' => $since->toIso8601String(),
        ]);
    }

    public function show($id)
    {
        $application = Application::with(['job', 'createdBy', 'updatedBy'])->findOrFail($id);

        return $this->successResponse($application);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'job_id' => 'nullable|exists:job_offers,id',
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|max:150',
            'phone' => 'nullable|string|max:50',
            'sector' => 'nullable|string|max:100',
            'experience_level' => 'nullable|string|max:50',
            'message' => 'nullable|string',
            'cv_file' => 'required|file|mimes:pdf,doc,docx|max:5120',
            'cover_letter_file' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
        ]);

        if ($request->hasFile('cv_file')) {
            $validated['cv_file'] = $this->fileUpload($request->file('cv_file'), 'applications/cvs');
        }

        if ($request->hasFile('cover_letter_file')) {
            $validated['cover_letter_file'] = $this->fileUpload($request->file('cover_letter_file'), 'applications/letters');
        }

        $userId = $request->user()?->id;
        $validated['created_by'] = $userId;
        $validated['updated_by'] = $userId;
        $validated['status'] = 'new';
        $application = Application::create($validated);

        $application->load('job');

        $adminEmail = Setting::query()->value('email') ?: config('mail.from.address');
        if ($adminEmail) {
            Mail::to($adminEmail)->queue(
                (new AdminApplicationReceived($application))
                    ->replyTo($application->email, trim($application->first_name . ' ' . $application->last_name))
            );
        }

        Mail::to($application->email)->later(now()->addSeconds(10), new ApplicantApplicationConfirmation($application));

        return $this->successResponse($application->load(['job', 'createdBy', 'updatedBy']), 'Candidature envoyée avec succès', 201);
    }

    public function update(Request $request, $id)
    {
        $application = Application::with(['job', 'createdBy', 'updatedBy'])->findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|string|in:new,reviewed,accepted,rejected',
        ]);

        $validated['updated_by'] = $request->user()->id;
        $application->update($validated);

        return $this->successResponse($application->fresh()->load(['job', 'createdBy', 'updatedBy']), 'Statut mis à jour');
    }

    public function destroy($id)
    {
        $application = Application::findOrFail($id);
        if ($application->cv_file) {
            $this->deleteFile($application->cv_file, 'applications/cvs/');
        }
        if ($application->cover_letter_file) {
            $this->deleteFile($application->cover_letter_file, 'applications/letters/');
        }
        $application->delete();

        return $this->noContentSuccessResponse('Candidature supprimée');
    }
}
