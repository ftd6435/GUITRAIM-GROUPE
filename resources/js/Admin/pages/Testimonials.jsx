import React, { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, Loader2, Star, User, Upload, Eye, EyeOff } from 'lucide-react';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../Components/ui/Table';
import Modal from '../../Components/ui/Modal';
import ConfirmModal from '../../Components/ui/ConfirmModal';
import { Input, Textarea } from '../../Components/ui/Input';
import { Card, CardContent } from '../../Components/ui/Card';
import { cn } from '../../utils/utils';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState(null);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({ name: '', company: '', content: '', rating: 5, avatar: null, is_visible: true });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await api.get('/testimonials');
      setTestimonials(response.data);
    } catch (error) {
      console.error('Échec de la récupération des témoignages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpenModal = (testimonial = null) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        name: testimonial.name,
        company: testimonial.company || '',
        content: testimonial.content,
        rating: testimonial.rating || 5,
        avatar: null,
        is_visible: !!testimonial.is_visible
      });
      setPreviewUrl(testimonial.avatar_path || (testimonial.avatar ? `/storage/images/avatars/${testimonial.avatar}` : null));
    } else {
      setEditingTestimonial(null);
      setFormData({ name: '', company: '', content: '', rating: 5, avatar: null, is_visible: true });
      setPreviewUrl(null);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTestimonial(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, avatar: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const data = new FormData();
    data.append('name', formData.name);
    data.append('company', formData.company);
    data.append('content', formData.content);
    data.append('rating', formData.rating);
    data.append('is_visible', formData.is_visible ? 1 : 0);
    if (formData.avatar) {
      data.append('avatar', formData.avatar);
    }

    if (editingTestimonial) {
      data.append('_method', 'PUT');
    }

    try {
      if (editingTestimonial) {
        await api.post(`/testimonials/${editingTestimonial.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/testimonials', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      fetchTestimonials();
      handleCloseModal();
    } catch (error) {
      if (error.errors) setErrors(error.errors);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (id) => {
    setTestimonialToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!testimonialToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/testimonials/${testimonialToDelete}`);
      fetchTestimonials();
      setIsConfirmOpen(false);
      setTestimonialToDelete(null);
    } catch (error) {
      console.error('Échec de la suppression du témoignage');
    } finally {
      setDeleting(false);
    }
  };

  const toggleVisibility = async (testimonial) => {
    try {
      await api.put(`/testimonials/${testimonial.id}`, { ...testimonial, is_visible: !testimonial.is_visible });
      fetchTestimonials();
    } catch (error) {
      console.error('Échec de la mise à jour de la visibilité');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[hsla(210,30%,20%,1)]">Témoignages</h2>
          <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Gérez les retours et avis des clients</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus size={18} />
          Ajouter un Témoignage
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="animate-spin text-[#1A3A5C]" size={32} />
            </div>
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Statut</TH>
                  <TH>Client</TH>
                  <TH>Entreprise</TH>
                  <TH>Note</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {testimonials.map((testimonial) => (
                  <TR key={testimonial.id}>
                    <TD>
                      <button
                        onClick={() => toggleVisibility(testimonial)}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          testimonial.is_visible
                            ? "text-green-600 bg-green-50 hover:bg-green-100"
                            : "text-[hsla(210,15%,55%,1)] bg-[hsla(210,25%,98%,1)] hover:bg-[hsla(210,25%,94%,1)]"
                        )}
                        title={testimonial.is_visible ? "Visible sur le site" : "Masqué sur le site"}
                      >
                        {testimonial.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </TD>
                    <TD>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[hsla(210,25%,98%,1)] flex items-center justify-center border border-[#E0E6ED] overflow-hidden">
                          {testimonial.avatar ? (
                            <img src={testimonial.avatar_path || `/storage/images/avatars/${testimonial.avatar}`} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User className="text-[hsla(210,15%,55%,1)]" size={20} />
                          )}
                        </div>
                        <span className="font-semibold text-[hsla(210,30%,20%,1)]">{testimonial.name}</span>
                       </div>
                     </TD>
                     <TD>{testimonial.company || 'N/A'}</TD>
                    <TD>
                      <div className="flex items-center gap-1 text-[#F5A623]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={14} fill={i < testimonial.rating ? 'currentColor' : 'none'} />
                        ))}
                      </div>
                    </TD>
                    <TD className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenModal(testimonial)} className="text-[#4A8BC2] hover:bg-[#4A8BC2]/10">
                        <Pencil size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(testimonial.id)} className="text-[#D64545] hover:bg-[#D64545]/10">
                        <Trash2 size={16} />
                      </Button>
                    </TD>
                  </TR>
                ))}
                {testimonials.length === 0 && (
                  <TR>
                    <TD colSpan={4} className="text-center py-12 text-[hsla(210,15%,55%,1)]">
                      Aucun témoignage trouvé.
                    </TD>
                  </TR>
                )}
              </TBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTestimonial ? 'Modifier le Témoignage' : 'Ajouter un Témoignage'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#E0E6ED] flex items-center justify-center overflow-hidden bg-[hsla(210,25%,98%,1)] relative group">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <User size={32} className="text-[hsla(210,15%,55%,1)]" />
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Upload size={20} />
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <p className="text-xs font-medium text-[hsla(210,20%,40%,1)]">Cliquez pour changer l'avatar</p>
            {errors.avatar && <p className="text-xs font-medium text-[#D64545]">{errors.avatar[0]}</p>}
          </div>

          <Input
            label="Nom du Client"
            placeholder="ex: Jeanne Dupont"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name?.[0]}
            required
          />
          <Input
            label="Entreprise"
            placeholder="ex: Tech Corp"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            error={errors.company?.[0]}
          />
          <Input
            label="Note (1-5)"
            type="number"
            min="1"
            max="5"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
            error={errors.rating?.[0]}
          />
          <Textarea
            label="Contenu du Témoignage"
            placeholder="Qu'est-ce que le client a dit ?"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            error={errors.content?.[0]}
            rows={4}
            required
          />

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_visible"
              checked={formData.is_visible}
              onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
              className="w-4 h-4 text-[#1A3A5C] rounded border-[#E0E6ED] focus:ring-[#1A3A5C]/20"
            />
            <label htmlFor="is_visible" className="text-sm font-semibold text-[hsla(210,30%,20%,1)] cursor-pointer">
              Visible sur le site public
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Annuler
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <Loader2 className="animate-spin mr-2" size={16} />
              ) : null}
              {editingTestimonial ? 'Mettre à jour le Témoignage' : 'Créer le Témoignage'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title="Supprimer le Témoignage"
        message="Êtes-vous sûr de vouloir supprimer ce témoignage ?"
      />
    </div>
  );
};

export default Testimonials;
