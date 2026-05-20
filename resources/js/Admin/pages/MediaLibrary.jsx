import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Loader2, Image as ImageIcon, FileText, Search, Copy, Check, Eye, Download } from 'lucide-react';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Card, CardContent } from '../../Components/ui/Card';
import { Input } from '../../Components/ui/Input';
import { cn } from '../../utils/utils';
import LoadingSpinner from '../../Components/ui/LoadingSpinner';
import Modal from '../../Components/ui/Modal';
import ConfirmModal from '../../Components/ui/ConfirmModal';

const MediaLibrary = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, image, pdf
  const [copiedId, setCopiedId] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState(null);

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
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
        await api.post('/media/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      fetchMedia();
    } catch (error) {
      console.error('Échec de l\'envoi');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteClick = (id) => {
    setMediaToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!mediaToDelete) return;
    try {
      setDeleting(true);
      await api.delete(`/media/${mediaToDelete}`);
      setIsConfirmOpen(false);
      setMediaToDelete(null);
      fetchMedia();
    } catch (error) {
      console.error('Échec de la suppression');
    } finally {
      setDeleting(false);
    }
  };

  const getFileUrl = (item) => {
    if (!item) return '';
    if (item.file_path) return item.file_path;
    if (!item.file_url) return '';
    return `/storage/files/library/${item.file_url}`;
  };

  const getExtension = (item) => {
    const name = item?.file_name || '';
    const parts = name.split('.');
    if (parts.length < 2) return '';
    return parts[parts.length - 1].toUpperCase();
  };

  const copyToClipboard = (url, id) => {
    const isAbsolute = typeof url === 'string' && /^https?:\/\//i.test(url);
    navigator.clipboard.writeText(isAbsolute ? url : (window.location.origin + url));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.file_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' ||
                         (filter === 'image' && item.file_type === 'image') ||
                         (filter === 'pdf' && item.file_type === 'pdf');
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
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setPreviewItem(item)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setPreviewItem(item);
                    }}
                    className="aspect-square rounded-2xl border border-[#E0E6ED] bg-[hsla(210,25%,98%,1)] overflow-hidden flex items-center justify-center transition-all group-hover:border-[#1A3A5C] group-hover:shadow-lg cursor-pointer"
                  >
                    {item.file_type === 'image' ? (
                      <img src={getFileUrl(item)} alt={item.file_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileText className="text-[hsla(210,15%,55%,1)]" size={40} />
                        <span className="px-2 py-1 rounded-lg bg-white border border-[#E0E6ED] text-[10px] font-black tracking-widest text-[hsla(210,30%,20%,1)]">
                          {getExtension(item) || item.file_type?.toUpperCase() || 'FICHIER'}
                        </span>
                      </div>
                    )}

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-[#1A3A5C]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewItem(item);
                        }}
                        className="p-2 bg-white rounded-lg text-[#1A3A5C] hover:bg-[#4A8BC2] hover:text-white transition-all transform hover:scale-110"
                        title="Prévisualiser"
                      >
                        <Eye size={18} />
                      </button>
                      <a
                        href={getFileUrl(item)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 bg-white rounded-lg text-[#1A3A5C] hover:bg-[#4A8BC2] hover:text-white transition-all transform hover:scale-110"
                        title="Ouvrir"
                      >
                        <Download size={18} />
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(getFileUrl(item), item.id);
                        }}
                        className="p-2 bg-white rounded-lg text-[#1A3A5C] hover:bg-[#4A8BC2] hover:text-white transition-all transform hover:scale-110"
                        title="Copier l'URL"
                      >
                        {copiedId === item.id ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(item.id);
                        }}
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

      <Modal
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
        title={previewItem?.file_name || 'Prévisualisation'}
        className="max-w-5xl"
      >
        {previewItem ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs font-bold text-[hsla(210,20%,45%,1)]">
                Type: {previewItem.file_type || '—'}{getExtension(previewItem) ? ` • ${getExtension(previewItem)}` : ''}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  onClick={() => copyToClipboard(getFileUrl(previewItem), previewItem.id)}
                  className="gap-2"
                >
                  <Copy size={16} />
                  Copier l’URL
                </Button>
                <a href={getFileUrl(previewItem)} target="_blank" rel="noreferrer">
                  <Button className="gap-2">
                    <Download size={16} />
                    Ouvrir
                  </Button>
                </a>
              </div>
            </div>

            {previewItem.file_type === 'image' ? (
              <img src={getFileUrl(previewItem)} alt={previewItem.file_name} className="w-full rounded-2xl border border-[#E0E6ED]" />
            ) : previewItem.file_type === 'pdf' ? (
              <div className="w-full rounded-2xl border border-[#E0E6ED] overflow-hidden bg-white">
                <iframe title="PDF Preview" src={getFileUrl(previewItem)} className="w-full h-[70vh]" />
              </div>
            ) : previewItem.file_type === 'video' ? (
              <video src={getFileUrl(previewItem)} controls className="w-full rounded-2xl border border-[#E0E6ED]" />
            ) : (
              <div className="p-6 rounded-2xl border border-[#E0E6ED] bg-[hsla(210,25%,98%,1)] text-sm font-medium text-[hsla(210,20%,40%,1)]">
                L’aperçu n’est pas disponible pour ce type de fichier. Utilisez “Ouvrir” pour le télécharger ou l’ouvrir dans un nouvel onglet.
              </div>
            )}
          </div>
        ) : null}
      </Modal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => {
          if (deleting) return;
          setIsConfirmOpen(false);
          setMediaToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title="Supprimer le fichier"
        message="Êtes-vous sûr de vouloir supprimer ce fichier ? Cette action est irréversible."
      />
    </div>
  );
};

export default MediaLibrary;
