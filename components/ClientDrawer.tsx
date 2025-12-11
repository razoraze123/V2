import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Upload, User, Mail, Phone, Briefcase, FileText, MapPin, Building, Hash } from 'lucide-react';
import { Client, DrawerProps } from '../types';

const ClientDrawer: React.FC<DrawerProps> = ({ isOpen, onClose, client, onSave }) => {
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'Active',
    avatar_url: '',
    address: '',
    city: '',
    zip: ''
  });
  
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
      if (client) {
        setFormData(client);
      } else {
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          status: 'Active',
          avatar_url: `https://picsum.photos/200?random=${Math.floor(Math.random() * 1000)}`,
          address: '',
          city: '',
          zip: ''
        });
      }
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 500);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, client]);

  if (!isOpen && !isAnimating) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      onSave({
        id: client?.id || crypto.randomUUID(),
        ...formData
      } as Client);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getStatusLabel = (status: string) => {
     switch(status) {
         case 'Active': return 'Actif';
         case 'Pending': return 'En attente';
         case 'Inactive': return 'Inactif';
         return status;
     }
  };

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] overflow-hidden transition-opacity duration-500 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />

      <div
        className={`absolute top-0 right-0 h-full w-full max-w-md spatial-glass border-r-0 border-y-0 rounded-l-[40px] shadow-[-30px_0_60px_rgba(0,0,0,0.6)] transform transition-transform duration-500 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-white/5 bg-white/5 rounded-tl-[40px]">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {client ? 'Modifier le profil' : 'Ajouter un client'}
          </h2>
          <button
            onClick={onClose}
            className="p-3 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative w-28 h-28 rounded-full p-1 bg-gradient-to-br from-cyan-400 to-purple-600 shadow-[0_0_40px_rgba(147,51,234,0.3)]">
              <img
                src={formData.avatar_url || 'https://picsum.photos/200'}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover bg-black"
              />
              <button className="absolute bottom-0 right-0 p-2.5 bg-white rounded-full text-black shadow-lg hover:bg-blue-50 transition-colors">
                <Upload size={16} />
              </button>
            </div>
            <p className="text-sm text-white/40 font-light">Formats acceptés: *.jpeg, *.jpg, *.png</p>
          </div>

          <form id="clientForm" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-5">
              {/* Basic Info */}
              <div className="group relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Nom complet"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="glass-input w-full rounded-2xl py-4 pl-12 pr-4"
                />
              </div>

              <div className="group relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Adresse Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="glass-input w-full rounded-2xl py-4 pl-12 pr-4"
                />
              </div>

              <div className="group relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30">
                  <Phone size={20} />
                </div>
                <input
                  type="tel"
                  placeholder="Numéro de téléphone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="glass-input w-full rounded-2xl py-4 pl-12 pr-4"
                />
              </div>

              <div className="group relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30">
                  <Briefcase size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Nom de l'entreprise"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="glass-input w-full rounded-2xl py-4 pl-12 pr-4"
                />
              </div>

              {/* New Fields: Address, City, BP */}
              <div className="pt-2 border-t border-white/5 space-y-5">
                 <h3 className="text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Adresse</h3>
                 
                 <div className="group relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30">
                      <MapPin size={20} />
                    </div>
                    <input
                      type="text"
                      placeholder="Adresse"
                      value={formData.address || ''}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="glass-input w-full rounded-2xl py-4 pl-12 pr-4"
                    />
                  </div>

                  <div className="flex gap-4">
                     <div className="group relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30">
                          <Building size={20} />
                        </div>
                        <input
                          type="text"
                          placeholder="Ville"
                          value={formData.city || ''}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="glass-input w-full rounded-2xl py-4 pl-12 pr-4"
                        />
                     </div>
                     <div className="group relative w-1/3">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30">
                          <Hash size={20} />
                        </div>
                        <input
                          type="text"
                          placeholder="BP"
                          value={formData.zip || ''}
                          onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                          className="glass-input w-full rounded-2xl py-4 pl-12 pr-4"
                        />
                     </div>
                  </div>
              </div>

              <div className="relative pt-2">
                <label className="text-xs uppercase tracking-widest text-white/40 mb-3 block font-bold">Statut</label>
                <div className="flex gap-3">
                  {(['Active', 'Pending', 'Inactive'] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData({ ...formData, status })}
                      className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
                        formData.status === status
                          ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] border border-transparent'
                          : 'glass-input text-white/50 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {getStatusLabel(status)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
               <h3 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
                 <FileText size={18} /> Documents
               </h3>
               <div className="border border-dashed border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-all cursor-pointer group hover:border-cyan-400/30">
                  <div className="p-4 bg-white/5 rounded-full mb-4 group-hover:scale-110 transition-transform shadow-inner">
                    <Upload size={24} className="text-cyan-300" />
                  </div>
                  <p className="text-sm text-white/80 font-medium">Cliquer pour télécharger</p>
                  <p className="text-xs text-white/30 mt-2">PDF, DOCX jusqu'à 10MB</p>
               </div>
            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-white/5 bg-white/5 flex items-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl spatial-glass text-white/70 font-medium hover:bg-white/10 hover:text-white transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            form="clientForm"
            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold shadow-[0_5px_20px_rgba(147,51,234,0.4)] hover:shadow-[0_8px_30px_rgba(147,51,234,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-white/10"
          >
            <Save size={20} />
            Enregistrer
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default ClientDrawer;