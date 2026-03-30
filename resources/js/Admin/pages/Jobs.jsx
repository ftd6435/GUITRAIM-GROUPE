import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, Briefcase, Calendar, MapPin, Eye, EyeOff } from 'lucide-react';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../Components/ui/Table';
import Modal from '../../Components/ui/Modal';
import ConfirmModal from '../../Components/ui/ConfirmModal';
import { Input, Textarea, Select } from '../../Components/ui/Input';
import RichTextEditor from '../../Components/ui/RichTextEditor';
import { Card, CardContent } from '../../Components/ui/Card';
import { cn } from '../../utils/utils';
import LoadingSpinner from '../../Components/ui/LoadingSpinner';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    type: 'Full-time',
    salary_range: '',
    description: '',
    requirements: '',
    status: 'open',
    is_visible: true
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Échec de la récupération des emplois');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleOpenModal = (job = null) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        title: job.title,
        location: job.location || '',
        type: job.type || 'Temps plein',
        salary_range: job.salary_range || '',
        description: job.description || '',
        requirements: job.requirements || '',
        status: job.status || 'open',
        is_visible: !!job.is_visible
      });
    } else {
      setEditingJob(null);
      setFormData({
        title: '',
        location: '',
        type: 'Temps plein',
        salary_range: '',
        description: '',
        requirements: '',
        status: 'open',
        is_visible: true
      });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      if (editingJob) {
        await api.put(`/jobs/${editingJob.id}`, formData);
      } else {
        await api.post('/jobs', formData);
      }
      fetchJobs();
      handleCloseModal();
    } catch (error) {
      if (error.errors) setErrors(error.errors);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (id) => {
    setJobToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/jobs/${jobToDelete}`);
      fetchJobs();
      setIsConfirmOpen(false);
      setJobToDelete(null);
    } catch (error) {
      console.error('Échec de la suppression');
    } finally {
      setDeleting(false);
    }
  };

  const toggleVisibility = async (job) => {
    try {
      await api.put(`/jobs/${job.id}`, { ...job, is_visible: !job.is_visible });
      fetchJobs();
    } catch (error) {
      console.error('Échec de la mise à jour de la visibilité');
    }
  };

  const jobTypes = [
    { value: 'Full-time', label: 'Temps plein' },
    { value: 'Part-time', label: 'Temps partiel' },
    { value: 'Contract', label: 'Contrat' },
    { value: 'Remote', label: 'À distance' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[hsla(210,30%,20%,1)]">Offres d'Emploi</h2>
          <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Gérez les ouvertures de postes et le recrutement</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus size={18} />
          Publier un Nouveau Poste
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-24">
              <LoadingSpinner size="md" />
            </div>
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Statut</TH>
                  <TH>Titre du Poste</TH>
                  <TH>Type</TH>
                  <TH>Localisation</TH>
                  <TH>État</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {jobs.map((job) => (
                  <TR key={job.id}>
                    <TD>
                      <button
                        onClick={() => toggleVisibility(job)}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          job.is_visible 
                            ? "text-green-600 bg-green-50 hover:bg-green-100" 
                            : "text-[hsla(210,15%,55%,1)] bg-[hsla(210,25%,98%,1)] hover:bg-[hsla(210,25%,94%,1)]"
                        )}
                        title={job.is_visible ? "Visible sur le site" : "Masqué sur le site"}
                      >
                        {job.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </TD>
                    <TD className="font-semibold text-[hsla(210,30%,20%,1)]">{job.title}</TD>
                    <TD>
                      <span className="px-2 py-1 rounded-full bg-[#4A8BC2]/10 text-[#1A3A5C] text-xs font-bold">
                        {jobTypes.find(t => t.value === job.type)?.label || job.type}
                      </span>
                    </TD>
                    <TD>
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        <MapPin size={14} className="text-[hsla(210,15%,55%,1)]" />
                        {job.location || 'N/A'}
                      </div>
                    </TD>
                    <TD>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-bold",
                        job.status === 'open' ? "bg-[#E8F5F0] text-[#4CAF8D]" : "bg-[#FDEAEA] text-[#D64545]"
                      )}>
                        {job.status === 'open' ? 'Ouvert' : 'Fermé'}
                      </span>
                    </TD>
                    <TD className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenModal(job)} className="text-[#4A8BC2] hover:bg-[#4A8BC2]/10">
                        <Pencil size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(job.id)} className="text-[#D64545] hover:bg-[#D64545]/10">
                        <Trash2 size={16} />
                      </Button>
                    </TD>
                  </TR>
                ))}
                {jobs.length === 0 && (
                  <TR>
                    <TD colSpan={5} className="text-center py-12 text-[hsla(210,15%,55%,1)]">
                      Aucun emploi publié pour le moment.
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
        title={editingJob ? 'Modifier le Poste' : 'Publier un Nouveau Poste'}
        className="max-w-4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Titre du Poste"
              placeholder="ex: Architecte Senior"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              error={errors.title?.[0]}
              required
            />
            <Select
              label="Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={jobTypes}
              error={errors.type?.[0]}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Localisation"
              placeholder="ex: Paris (Hybride)"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              error={errors.location?.[0]}
            />
            <Input
              label="Échelle Salariale"
              placeholder="ex: 50k - 70k"
              value={formData.salary_range}
              onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
              error={errors.salary_range?.[0]}
            />
          </div>

          <Textarea
            label="Description"
            placeholder="Description complète du poste"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            error={errors.description?.[0]}
            rows={5}
            required
          />

          <RichTextEditor
            label="Exigences"
            value={formData.requirements}
            onChange={(value) => setFormData({ ...formData, requirements: value })}
            error={errors.requirements?.[0]}
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
              {editingJob ? 'Mettre à jour le Poste' : 'Publier le Poste'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title="Supprimer l'Offre d'Emploi"
        message="Êtes-vous sûr de vouloir supprimer cette offre d'emploi ?"
      />
    </div>
  );
};

export default Jobs;

