import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon, Star, StarOff } from 'lucide-react';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../Components/ui/Table';
import Modal from '../../Components/ui/Modal';
import { Input, Textarea, Select } from '../../Components/ui/Input';
import { Card, CardContent } from '../../Components/ui/Card';
import { cn } from '../../utils/utils';
import LoadingSpinner from '../../Components/ui/LoadingSpinner';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({ 
    sector_id: '', 
    title: '', 
    location: '', 
    year: new Date().getFullYear(), 
    description: '', 
    content: '', 
    featured: false,
    tag_ids: []
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsRes, sectorsRes, tagsRes] = await Promise.all([
        api.get('/projects'),
        api.get('/sectors'),
        api.get('/tags')
      ]);
      setProjects(projectsRes.data);
      setSectors(sectorsRes.data);
      setTags(tagsRes.data);
    } catch (error) {
      console.error('Échec de la récupération des données du projet');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({ 
        sector_id: project.sector_id || '', 
        title: project.title, 
        location: project.location || '', 
        year: project.year || new Date().getFullYear(), 
        description: project.description || '', 
        content: project.content || '',
        featured: !!project.featured,
        tag_ids: project.tags?.map(t => t.id) || []
      });
    } else {
      setEditingProject(null);
      setFormData({ 
        sector_id: sectors[0]?.id || '', 
        title: '', 
        location: '', 
        year: new Date().getFullYear(), 
        description: '', 
        content: '',
        featured: false,
        tag_ids: []
      });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      if (editingProject) {
        await api.put(`/projects/${editingProject.id}`, formData);
      } else {
        await api.post('/projects', formData);
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      if (error.errors) setErrors(error.errors);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchData();
    } catch (error) {
      console.error('Échec de la suppression du projet');
    }
  };

  const toggleFeatured = async (project) => {
    try {
      await api.put(`/projects/${project.id}`, { ...project, featured: !project.featured });
      fetchData();
    } catch (error) {
      console.error('Échec de la mise à jour du statut du projet');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[hsla(210,30%,20%,1)]">Projets</h2>
          <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Présentez vos meilleures réalisations</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus size={18} />
          Ajouter un Projet
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
                  <TH>Projet</TH>
                  <TH>Secteur</TH>
                  <TH>Localisation</TH>
                  <TH>Année</TH>
                  <TH>Mis en avant</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {projects.map((project) => (
                  <TR key={project.id}>
                    <TD>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[hsla(210,25%,98%,1)] flex items-center justify-center border border-[#E0E6ED] overflow-hidden">
                          {project.images?.[0] ? (
                            <img src={project.images[0].image_path} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="text-[hsla(210,15%,55%,1)]" size={20} />
                          )}
                        </div>
                        <span className="font-semibold text-[hsla(210,30%,20%,1)]">{project.title}</span>
                      </div>
                    </TD>
                    <TD>
                      <span className="px-2 py-1 rounded-full bg-[#4A8BC2]/10 text-[#1A3A5C] text-xs font-bold">
                        {project.sector?.name || 'Aucun Secteur'}
                      </span>
                    </TD>
                    <TD>{project.location || 'N/A'}</TD>
                    <TD>{project.year}</TD>
                    <TD>
                      <button 
                        onClick={() => toggleFeatured(project)}
                        className={cn(
                          "transition-colors",
                          project.featured ? "text-[#F5A623]" : "text-[hsla(210,10%,70%,1)] hover:text-[#F5A623]"
                        )}
                      >
                        {project.featured ? <Star size={20} fill="currentColor" /> : <StarOff size={20} />}
                      </button>
                    </TD>
                    <TD className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenModal(project)} className="text-[#4A8BC2] hover:bg-[#4A8BC2]/10">
                        <Pencil size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(project.id)} className="text-[#D64545] hover:bg-[#D64545]/10">
                        <Trash2 size={16} />
                      </Button>
                    </TD>
                  </TR>
                ))}
                {projects.length === 0 && (
                  <TR>
                    <TD colSpan={6} className="text-center py-12 text-[hsla(210,15%,55%,1)]">
                      Aucun projet trouvé.
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
        title={editingProject ? 'Modifier le Projet' : 'Ajouter un Nouveau Projet'}
        className="max-w-4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Titre du Projet"
              placeholder="ex: Complexe de Bureaux Moderne"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              error={errors.title?.[0]}
              required
            />
            <Select
              label="Secteur"
              value={formData.sector_id}
              onChange={(e) => setFormData({ ...formData, sector_id: e.target.value })}
              options={sectors.map(s => ({ value: s.id, label: s.name }))}
              error={errors.sector_id?.[0]}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Localisation"
              placeholder="ex: Paris, France"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              error={errors.location?.[0]}
            />
            <Input
              label="Année"
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              error={errors.year?.[0]}
            />
          </div>

          <Textarea
            label="Description Courte"
            placeholder="Bref résumé du projet"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            error={errors.description?.[0]}
            rows={2}
          />

          <Textarea
            label="Contenu du Projet"
            placeholder="Informations détaillées sur le projet"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            error={errors.content?.[0]}
            rows={6}
          />

          <div>
            <label className="text-sm font-semibold text-[hsla(210,30%,20%,1)] ml-1 block mb-2">
              Étiquettes (Tags)
            </label>
            <div className="flex flex-wrap gap-2 p-3 bg-[hsla(210,25%,98%,1)] rounded-xl border border-[#E0E6ED]">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => {
                    const ids = formData.tag_ids.includes(tag.id)
                      ? formData.tag_ids.filter(id => id !== tag.id)
                      : [...formData.tag_ids, tag.id];
                    setFormData({ ...formData, tag_ids: ids });
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                    formData.tag_ids.includes(tag.id)
                      ? "bg-[#1A3A5C] text-white border-[#1A3A5C]"
                      : "bg-white text-[hsla(210,30%,20%,1)] border-[#E0E6ED] hover:border-[#1A3A5C]"
                  )}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="featured" 
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 text-[#1A3A5C] rounded border-[#E0E6ED] focus:ring-[#1A3A5C]/20"
            />
            <label htmlFor="featured" className="text-sm font-semibold text-[hsla(210,30%,20%,1)] cursor-pointer">
              Marquer comme Projet mis en avant
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
              {editingProject ? 'Mettre à jour le Projet' : 'Créer le Projet'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;

