<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Traits\ApiResponses;
use App\Traits\ImageUpload;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    use ApiResponses, ImageUpload;

    public function index()
    {
        return $this->successResponse(Application::with('job')->latest()->get());
    }

    public function show($id)
    {
        $application = Application::with('job')->findOrFail($id);
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

        $application = Application::create($validated);
        return $this->successResponse($application, 'Candidature envoyée avec succès', 201);
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
