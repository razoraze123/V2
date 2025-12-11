import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, User, Mail, Phone, Briefcase, MapPin, Building, Hash, Trash2 } from 'lucide-react';
import { Client, ModalProps } from '../types';

const ClientModal: React.FC<ModalProps> = ({ isOpen, onClose, client, onSave, onDelete }) => {
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    zip: ''
  });
  
  const [showModal, setShowModal] = useState(false);

  // Manage body scroll locking and animation state
  useEffect(() => {
    if (isOpen) {
      // Lock scroll
      document.body.style.overflow = 'hidden';
      setShowModal(true);
      if (client) {
        setFormData(client);
      } else {
        setFormData({ name: '', email: '', phone: '', company: '', address: '', city: '', zip: '' });
      }
    } else {
      setShowModal(false);
      // Unlock scroll after animation duration (approx 300ms) or immediately if needed
      const timer = setTimeout(() => {
        document.body.style.overflow = 'unset';
      }, 300);
      return () => clearTimeout(timer);
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, client]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      onSave({
        id: client?.id || crypto.randomUUID(),
        ...formData
      } as Client);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop - Increased blur for better depth perception */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 ${showModal ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Glass Modal */}
      <div 
        className={`relative w-full max-w-[500px] spatial-glass rounded-[30px] shadow-2xl overflow-hidden transform transition-all duration-300 ${showModal ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-8'}`}
      >
        <div className="p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">
              {client ? 'Modifier' : 'Nouveau Client'}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form id="clientForm" onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                  <input
                    type="text"
                    required
                    placeholder="Nom complet"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="glass-input w-full py-3.5 pl-12 pr-4 rounded-xl"
                  />
                </div>

                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                  <input
                    type="email"
                    required
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="glass-input w-full py-3.5 pl-12 pr-4 rounded-xl"
                  />
                </div>

                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                  <input
                    type="tel"
                    placeholder="Téléphone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="glass-input w-full py-3.5 pl-12 pr-4 rounded-xl"
                  />
                </div>

                <div className="relative group">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Entreprise"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="glass-input w-full py-3.5 pl-12 pr-4 rounded-xl"
                  />
                </div>

                 <div className="border-t border-white/10 pt-4 mt-2 space-y-4">
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Adresse"
                        value={formData.address || ''}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="glass-input w-full py-3.5 pl-12 pr-4 rounded-xl"
                      />
                    </div>
                    <div className="flex gap-4">
                       <div className="relative group flex-1">
                          <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                          <input
                            type="text"
                            placeholder="Ville"
                            value={formData.city || ''}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="glass-input w-full py-3.5 pl-12 pr-4 rounded-xl"
                          />
                       </div>
                       <div className="relative group w-1/3">
                          <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                          <input
                            type="text"
                            placeholder="BP"
                            value={formData.zip || ''}
                            onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                            className="glass-input w-full py-3.5 pl-12 pr-4 rounded-xl"
                          />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="pt-4 flex gap-3">
                {client && onDelete && (
                    <button
                        type="button"
                        onClick={() => onDelete(client)}
                        className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-colors"
                        title="Supprimer"
                    >
                        <Trash2 size={20} />
                    </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3.5 rounded-xl border border-white/10 hover:bg-white/5 text-white/70 transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold shadow-lg hover:shadow-orange-500/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Enregistrer
                </button>
              </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ClientModal;