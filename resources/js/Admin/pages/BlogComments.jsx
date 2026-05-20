import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../Components/ui/Table';
import { Card, CardContent } from '../../Components/ui/Card';
import LoadingSpinner from '../../Components/ui/LoadingSpinner';
import { Input } from '../../Components/ui/Input';
import { cn } from '../../utils/utils';
import ConfirmModal from '../../Components/ui/ConfirmModal';

const BlogComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | approved | pending
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (filter === 'approved') params.approved = true;
      if (filter === 'pending') params.approved = false;
      const response = await api.get('/blog-comments', { params });
      setComments(response.data || []);
    } catch (e) {
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchComments();
    }, 350);
    return () => clearTimeout(t);
  }, [search, filter]);

  const groupedStats = useMemo(() => {
    const approvedCount = comments.filter((c) => c.is_approved).length;
    const pendingCount = comments.length - approvedCount;
    return { approvedCount, pendingCount };
  }, [comments]);

  const toggleApprove = async (comment) => {
    try {
      await api.put(`/blog-comments/${comment.id}`, { is_approved: !comment.is_approved });
      fetchComments();
    } catch (e) {
    }
  };

  const handleDeleteClick = (id) => {
    setCommentToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!commentToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/blog-comments/${commentToDelete}`);
      setIsConfirmOpen(false);
      setCommentToDelete(null);
      fetchComments();
    } catch (e) {
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[hsla(210,30%,20%,1)]">Commentaires</h2>
        <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">
          Modérez les commentaires des articles du blog
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={cn(
              "px-4 h-11 rounded-2xl border text-sm font-bold transition-colors",
              filter === 'all' ? "bg-[#1A3A5C] text-white border-[#1A3A5C]" : "bg-white border-[#E0E6ED] hover:border-[#1A3A5C]"
            )}
          >
            Tous ({comments.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('approved')}
            className={cn(
              "px-4 h-11 rounded-2xl border text-sm font-bold transition-colors",
              filter === 'approved' ? "bg-[#1A3A5C] text-white border-[#1A3A5C]" : "bg-white border-[#E0E6ED] hover:border-[#1A3A5C]"
            )}
          >
            Approuvés ({groupedStats.approvedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={cn(
              "px-4 h-11 rounded-2xl border text-sm font-bold transition-colors",
              filter === 'pending' ? "bg-[#1A3A5C] text-white border-[#1A3A5C]" : "bg-white border-[#E0E6ED] hover:border-[#1A3A5C]"
            )}
          >
            En attente ({groupedStats.pendingCount})
          </button>
        </div>

        <div className="w-full md:w-[420px]">
          <Input
            label=""
            placeholder="Rechercher (nom, email, contenu, article)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
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
                  <TH>Commentaire</TH>
                  <TH>Article</TH>
                  <TH>Statut</TH>
                  <TH>Date</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {comments.map((comment) => (
                  <TR key={comment.id}>
                    <TD>
                      <div className="font-semibold text-[hsla(210,30%,20%,1)]">{comment.name}</div>
                      {comment.email ? (
                        <div className="text-xs text-[hsla(210,20%,40%,1)]">{comment.email}</div>
                      ) : null}
                      <div className="text-sm text-[hsla(210,20%,40%,1)] line-clamp-2 mt-2">
                        {comment.body}
                      </div>
                    </TD>
                    <TD className="max-w-xs truncate">
                      {comment.post?.title || '—'}
                    </TD>
                    <TD>
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-bold",
                          comment.is_approved ? "bg-[#E8F5F0] text-[#4CAF8D]" : "bg-[#FFF7E6] text-[#B26A00]"
                        )}
                      >
                        {comment.is_approved ? 'Approuvé' : 'En attente'}
                      </span>
                    </TD>
                    <TD>{comment.created_at ? new Date(comment.created_at).toLocaleString('fr-FR') : '—'}</TD>
                    <TD className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleApprove(comment)}
                        className={cn(
                          "hover:bg-[#4A8BC2]/10",
                          comment.is_approved ? "text-[#B26A00]" : "text-[#4CAF8D]"
                        )}
                        title={comment.is_approved ? 'Désapprouver' : 'Approuver'}
                      >
                        <CheckCircle2 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(comment.id)}
                        className="text-[#D64545] hover:bg-[#D64545]/10"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TD>
                  </TR>
                ))}

                {comments.length === 0 && (
                  <TR>
                    <TD colSpan={5} className="text-center py-12 text-[hsla(210,15%,55%,1)]">
                      Aucun commentaire.
                    </TD>
                  </TR>
                )}
              </TBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Supprimer le commentaire"
        message="Cette action est irréversible. Supprimer ce commentaire ?"
        confirmText={deleting ? 'Suppression...' : 'Supprimer'}
        cancelText="Annuler"
        loading={deleting}
      />
    </div>
  );
};

export default BlogComments;
