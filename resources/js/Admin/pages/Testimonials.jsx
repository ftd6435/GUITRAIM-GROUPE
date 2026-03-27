import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, Star } from 'lucide-react';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../Components/ui/Table';
import Modal from '../../Components/ui/Modal';
import { Input, Textarea } from '../../Components/ui/Input';
import { Card, CardContent } from '../../Components/ui/Card';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({ client_name: '', client_company: '', content: '', rating: 5 });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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
        client_name: testimonial.client_name,
        client_company: testimonial.client_company || '',
        content: testimonial.content,
        rating: testimonial.rating || 5
      });
    } else {
      setEditingTestimonial(null);
      setFormData({ client_name: '', client_company: '', content: '', rating: 5 });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTestimonial(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      if (editingTestimonial) {
        await api.put(`/testimonials/${editingTestimonial.id}`, formData);
      } else {
        await api.post('/testimonials', formData);
      }
      fetchTestimonials();
      handleCloseModal();
    } catch (error) {
      if (error.errors) setErrors(error.errors);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) return;
    try {
      await api.delete(`/testimonials/${id}`);
      fetchTestimonials();
    } catch (error) {
      console.error('Échec de la suppression du témoignage');
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
                  <TH>Client</TH>
                  <TH>Entreprise</TH>
                  <TH>Note</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {testimonials.map((testimonial) => (
                  <TR key={testimonial.id}>
                    <TD className="font-semibold text-[hsla(210,30%,20%,1)]">{testimonial.client_name}</TD>
                    <TD>{testimonial.client_company || 'N/A'}</TD>
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
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(testimonial.id)} className="text-[#D64545] hover:bg-[#D64545]/10">
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
          <Input
            label="Nom du Client"
            placeholder="ex: Jeanne Dupont"
            value={formData.client_name}
            onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
            error={errors.client_name?.[0]}
            required
          />
          <Input
            label="Entreprise"
            placeholder="ex: Tech Corp"
            value={formData.client_company}
            onChange={(e) => setFormData({ ...formData, client_company: e.target.value })}
            error={errors.client_company?.[0]}
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
            rows={5}
            required
          />
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
    </div>
  );
};

export default Testimonials;
