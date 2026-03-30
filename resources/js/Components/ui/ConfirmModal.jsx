import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmer la suppression", 
  message = "Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.",
  confirmText = "Supprimer",
  cancelText = "Annuler",
  variant = "danger",
  loading = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} className="max-w-md">
      <div className="space-y-6 py-2">
        <div className="flex items-start gap-4 p-4 bg-[hsla(0,100%,98%,1)] rounded-2xl border border-[hsla(0,100%,94%,1)]">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            variant === 'danger' ? 'bg-[#FDEAEA] text-[#D64545]' : 'bg-blue-50 text-blue-600'
          }`}>
            <AlertTriangle size={24} />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-[hsla(210,20%,40%,1)] leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button 
            variant="secondary" 
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button 
            onClick={onConfirm} 
            disabled={loading}
            className={variant === 'danger' ? 'bg-[#D64545] hover:bg-[#D64545]/90 text-white' : ''}
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
