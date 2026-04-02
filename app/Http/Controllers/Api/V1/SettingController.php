<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Traits\ApiResponses;
use App\Traits\ImageUpload;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    use ApiResponses, ImageUpload;

    public function index()
    {
        $settings = Setting::with(['createdBy', 'updatedBy'])->first();

        return $this->successResponse($settings);
    }

    public function update(Request $request)
    {
        $settings = Setting::firstOrCreate(['id' => 1]);

        $validated = $request->validate([
            'site_name' => 'nullable|string|max:150',
            'logo' => 'nullable|image|max:2048',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:150',
            'working_hours' => 'nullable|string|max:150',
        ]);

        if ($request->hasFile('logo')) {
            if ($settings->logo) {
                $this->deleteImage($settings->logo, 'settings/');
            }
            $validated['logo'] = $this->imageUpload($request->file('logo'), 'settings');
        }

        if (! $settings->created_by) {
            $validated['created_by'] = $request->user()->id;
        }
        $validated['updated_by'] = $request->user()->id;
        $settings->update($validated);

        return $this->successResponse($settings->fresh()->load(['createdBy', 'updatedBy']), 'Paramètres mis à jour avec succès');
    }
}
