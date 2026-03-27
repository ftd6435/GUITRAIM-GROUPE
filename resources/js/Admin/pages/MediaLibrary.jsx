import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Loader2, Image as ImageIcon, FileText, Search, Copy, Check } from 'lucide-react';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Card, CardContent } from '../../Components/ui/Card';
import { Input } from '../../Components/ui/Input';
import { cn } from '../../utils/utils';
import LoadingSpinner from '../../Components/ui/LoadingSpinner';

const MediaLibrary = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, image, pdf
  const [copiedId, setCopiedId] = useState(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await api.get('/media');
      setMedia(response.data);
    } catch (error) {
      console.error('Échec de la récupération des médias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }

    try {
      await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchMedia();
    } catch (error) {
      console.error('Échec de l\'envoi');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) return;
    try {
      await api.delete(`/media/${id}`);
      fetchMedia();
    } catch (error) {
      console.error('Échec de la suppression');
    }
  };

  const copyToClipboard = (url, id) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.file_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' ||
                         (filter === 'image' && item.file_type.startsWith('image/')) ||
                         (filter === 'pdf' && item.file_type === 'application/pdf');
    return matchesSearch && matchesFilter;
  });

  const filterLabels = {
    all: 'Tous',
    image: 'Images',
    pdf: 'Documents'
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[hsla(210,30%,20%,1)]">Médiathèque</h2>
          <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Téléchargez et gérez vos fichiers</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="cursor-pointer">
            <input type="file" className="hidden" multiple onChange={handleFileUpload} disabled={uploading} />
            <Button disabled={uploading} className="gap-2 pointer-events-none">
              {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
              Télécharger des Fichiers
            </Button>
          </label>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsla(210,15%,55%,1)]" size={18} />
              <Input
                className="pl-10"
                placeholder="Rechercher des fichiers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex bg-[hsla(210,25%,98%,1)] p-1 rounded-xl border border-[#E0E6ED]">
              {Object.keys(filterLabels).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-4 py-2 text-sm font-bold rounded-lg transition-all",
                    filter === f
                      ? "bg-white text-[#1A3A5C] shadow-sm"
                      : "text-[hsla(210,20%,40%,1)] hover:text-[#1A3A5C]"
                  )}
                >
                  {filterLabels[f]}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-24">
              <LoadingSpinner size="md" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {filteredMedia.map((item) => (
                <div key={item.id} className="group relative">
                  <div className="aspect-square rounded-2xl border border-[#E0E6ED] bg-[hsla(210,25%,98%,1)] overflow-hidden flex items-center justify-center transition-all group-hover:border-[#1A3A5C] group-hover:shadow-lg">
                    {item.file_type.startsWith('image/') ? (
                      <img src={item.file_path} alt={item.file_name} className="w-full h-full object-cover" />
                    ) : (
                      <FileText className="text-[hsla(210,15%,55%,1)]" size={40} />
                    )}

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-[#1A3A5C]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => copyToClipboard(item.file_path, item.id)}
                        className="p-2 bg-white rounded-lg text-[#1A3A5C] hover:bg-[#4A8BC2] hover:text-white transition-all transform hover:scale-110"
                        title="Copier l'URL"
                      >
                        {copiedId === item.id ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 bg-white rounded-lg text-[#D64545] hover:bg-[#D64545] hover:text-white transition-all transform hover:scale-110"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-[hsla(210,30%,20%,1)] truncate px-1" title={item.file_name}>
                    {item.file_name}
                  </p>
                </div>
              ))}
              {filteredMedia.length === 0 && (
                <div className="col-span-full py-12 text-center text-[hsla(210,15%,55%,1)] italic">
                  Aucun fichier média correspondant à vos critères.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaLibrary;

