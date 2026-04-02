<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\MediaLibrary;
use App\Traits\ApiResponses;
use App\Traits\ImageUpload;
use Illuminate\Http\Request;

class MediaController extends Controller
{
    use ApiResponses, ImageUpload;

    public function index()
    {
        return $this->successResponse(MediaLibrary::with(['user', 'createdBy', 'updatedBy'])->latest()->get());
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10MB limit
            'alt_text' => 'nullable|string|max:255',
        ]);

        $file = $request->file('file');
        $extension = $file->getClientOriginalExtension();
        $fileType = $this->getFileType($extension);

        $fileName = $this->fileUpload($file, 'library');

        $media = MediaLibrary::create([
            'file_name' => $file->getClientOriginalName(),
            'file_url' => $fileName,
            'file_type' => $fileType,
            'alt_text' => $request->alt_text,
            'uploaded_by' => $request->user()->id,
            'created_by' => $request->user()->id,
            'updated_by' => $request->user()->id,
        ]);

        return $this->successResponse($media->load(['user', 'createdBy', 'updatedBy']), 'Fichier téléchargé avec succès', 201);
    }

    public function destroy($id)
    {
        $media = MediaLibrary::findOrFail($id);
        $this->deleteFile($media->file_url, 'library/');
        $media->delete();

        return $this->noContentSuccessResponse('Fichier supprimé');
    }

    private function getFileType($extension)
    {
        $images = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];
        $videos = ['mp4', 'mov', 'avi', 'wmv'];
        $docs = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'];

        if (in_array(strtolower($extension), $images)) {
            return 'image';
        }
        if (in_array(strtolower($extension), $videos)) {
            return 'video';
        }
        if (in_array(strtolower($extension), $docs)) {
            return 'pdf';
        }

        return 'other';
    }
}
