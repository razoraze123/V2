import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HandCoins, ArrowUpRight, ArrowDownRight, Calendar, MessageCircle, Plus, X, Save, Trash2, User, FileText, Phone } from 'lucide-react';
import { Debt } from '../types';
import { creditService, formatCurrency } from '../services/mockData';
import { useAction } from './ActionContext';

// --- MODAL COMPONENT ---
interface CreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  debt?: Debt | null;
  defaultType?: 'receivable' | 'payable';
  onSave: (debt: Debt) => void;
  onDelete: (id: string) => void;
}

const CreditModal: React.FC<CreditModalProps> = ({ isOpen, onClose, debt, defaultType, onSave, onDelete }) => {
  const [formData, setFormData] = useState<Partial<Debt>>({
    type: defaultType || 'receivable',
    person: '',
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    phone: '',
    reason: ''
  });
  const [amountStr, setAmountStr] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (debt) {
        setFormData(debt);
        setAmountStr(debt.amount.toString());
      } else {
        setFormData({
          type: defaultType || 'receivable',
          person: '',
          amount: 0,
          dueDate: new Date().toISOString().split('T')[0],
          phone: '',
          reason: ''
        });
        setAmountStr('');
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen, debt, defaultType]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.person || !amountStr) return;

    onSave({
      id: debt?.id || crypto.randomUUID(),
      ...formData,
      amount: parseFloat(amountStr) || 0
    } as Debt);
  };

  const getModalTitle = () => {
     if (debt) return 'Modifier';
     return formData.type === 'receivable' ? 'Nouveau Crédit' : 'Nouvelle Dette';
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-[500px] spatial-glass rounded-[30px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {getModalTitle()}
            </h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex bg-black/20 p-1 rounded-xl border border-white/5">
               <button
                 type="button"
                 onClick={() => setFormData({...formData, type: 'receivable'})}
                 className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${formData.type === 'receivable' ? 'bg-emerald-500/20 text-emerald-400 shadow-sm border border-emerald-500/30' : 'text-white/40 hover:text-white'}`}
               >
                 On me doit
               </button>
               <button
                 type="button"
                 onClick={() => setFormData({...formData, type: 'payable'})}
                 className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${formData.type === 'payable' ? 'bg-orange-500/20 text-orange-400 shadow-sm border border-orange-500/30' : 'text-white/40 hover:text-white'}`}
               >
                 Je dois
               </button>
            </div>

            <div className="flex flex-col items-center justify-center py-2">
               <div className="relative w-full flex items-center justify-center">
                 <input
                   type="number"
                   placeholder="0"
                   value={amountStr}
                   onChange={(e) => setAmountStr(e.target.value)}
                   className={`w-full bg-transparent text-5xl font-bold text-center focus:outline-none placeholder-white/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${formData.type === 'receivable' ? 'text-emerald-400' : 'text-orange-400'}`}
                 />
                 <span className="absolute right-0 top-1/2 -translate-y-1/2 text-white/30 text-lg font-medium pointer-events-none">FCFA</span>
               </div>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Nom de la personne"
                  value={formData.person}
                  onChange={(e) => setFormData({...formData, person: e.target.value})}
                  className="glass-input w-full py-3.5 pl-12 pr-4 rounded-xl"
                  required
                />
              </div>
              {/* ... Other inputs ... */}
               <div className="relative group">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Motif (ex: Salaire, Matériel...)"
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  className="glass-input w-full py-3.5 pl-12 pr-4 rounded-xl"
                />
              </div>
              <div className="flex gap-4">
                 <div className="relative group flex-1">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                    <input
                      type="tel"
                      placeholder="90 00 00 00"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="glass-input w-full py-3.5 pl-12 pr-4 rounded-xl"
                    />
                 </div>
                 <div className="relative group w-2/5">
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                      className="glass-input w-full py-3.5 px-4 rounded-xl text-sm text-center"
                    />
                 </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              {debt && (
                <button
                  type="button"
                  onClick={() => onDelete(debt.id)}
                  className="p-4 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              )}
              <button
                type="submit"
                className="flex-1 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold shadow-lg hover:shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Save size={20} />
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

// --- MAIN COMPONENT ---
const CreditBook: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'receivable' | 'payable'>('receivable');
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);

  const { registerAction } = useAction();

  // Register ADD action to global header
  useEffect(() => {
    registerAction(() => {
        setSelectedDebt(null);
        setIsModalOpen(true);
    });
    return () => registerAction(null);
  }, [registerAction, activeTab]);

  useEffect(() => {
    const fetchDebts = async () => {
      setIsLoading(true);
      const data = await creditService.getDebts(activeTab);
      if (debts.length === 0) setDebts(data); 
      setIsLoading(false);
    };
    fetchDebts();
  }, []);

  const handleOpenModal = (debt: Debt | null) => {
    setSelectedDebt(debt);
    setIsModalOpen(true);
  };

  const handleSave = (debt: Debt) => {
    setDebts(prev => {
      const exists = prev.find(d => d.id === debt.id);
      if (exists) return prev.map(d => d.id === debt.id ? debt : d);
      return [debt, ...prev];
    });
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setDebts(prev => prev.filter(d => d.id !== id));
    setIsModalOpen(false);
  };

  const handleWhatsApp = (e: React.MouseEvent, debt: Debt) => {
    e.stopPropagation();
    const cleanPhone = debt.phone.replace(/[^0-9]/g, '');
    const message = `Salam ${debt.person}, petit rappel pour le solde de ${formatCurrency(debt.amount)} concernant ${debt.reason}. Merci !`;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const filteredDebts = debts.filter(d => d.type === activeTab);

  return (
    <div className="w-full max-w-lg mx-auto space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col items-start gap-2">
         <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-3">
           <HandCoins className="text-orange-500" size={32} />
           Crédits & Dettes
         </h1>
         <p className="text-white/60 text-lg font-light">Suivi des créances et engagements</p>
      </div>

      {/* Tabs */}
      <div className="bg-white/5 p-1 rounded-2xl border border-white/10 flex">
        <button
          onClick={() => setActiveTab('receivable')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
            activeTab === 'receivable'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
              : 'text-white/50 hover:text-white'
          }`}
        >
          <ArrowUpRight size={16} />
          <span>On me doit</span>
        </button>
        <button
          onClick={() => setActiveTab('payable')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
            activeTab === 'payable'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20'
              : 'text-white/50 hover:text-white'
          }`}
        >
          <ArrowDownRight size={16} />
          <span>Je dois</span>
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {isLoading ? (
           [1, 2, 3].map(i => <div key={i} className="h-32 spatial-glass rounded-[24px] animate-pulse" />)
        ) : (
          filteredDebts.map((debt) => (
            <div 
              key={debt.id} 
              onClick={() => handleOpenModal(debt)}
              className="spatial-glass rounded-[24px] p-6 relative overflow-hidden group hover:bg-white/5 hover:scale-[1.01] transition-all cursor-pointer"
            >
               <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${debt.type === 'receivable' ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
               <div className="flex justify-between items-start pl-3">
                  <div>
                     <h3 className="text-xl font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">{debt.person}</h3>
                     <p className="text-white/60 text-sm mb-4 flex items-center gap-1.5">
                       <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>
                       {debt.reason}
                     </p>
                     <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg bg-white/5 w-fit border border-white/5">
                        <Calendar size={12} className="text-white/40" />
                        <span className={`${new Date(debt.dueDate) < new Date() ? 'text-red-400' : 'text-white/60'}`}>
                           Echéance : {new Date(debt.dueDate).toLocaleDateString('fr-FR')}
                        </span>
                     </div>
                  </div>
                  <div className="text-right">
                     <div className={`text-2xl font-bold mb-1 ${debt.type === 'receivable' ? 'text-emerald-400' : 'text-orange-400'}`}>
                        {formatCurrency(debt.amount)}
                     </div>
                     <div className="text-[10px] text-white/30 uppercase tracking-wider font-semibold">Reste à payer</div>
                  </div>
               </div>
               {debt.type === 'receivable' && (
                 <div className="mt-6 pt-4 border-t border-white/5 flex justify-end pl-3">
                    <button 
                      onClick={(e) => handleWhatsApp(e, debt)}
                      className="py-2.5 px-5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 text-[#25D366] font-semibold text-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                    >
                       <MessageCircle size={18} />
                       Relancer sur WhatsApp
                    </button>
                 </div>
               )}
            </div>
          ))
        )}
        {!isLoading && filteredDebts.length === 0 && (
           <div className="text-center py-16 text-white/30 flex flex-col items-center">
              <HandCoins size={48} className="opacity-20 mb-4" />
              <p>Aucune dette dans cette catégorie.</p>
           </div>
        )}
      </div>

      {/* DESKTOP FAB (Hidden on Mobile) */}
      <button
        onClick={() => handleOpenModal(null)}
        className="hidden md:flex fixed bottom-8 right-8 z-40 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-[0_5px_20px_rgba(255,107,0,0.4)] hover:shadow-[0_10px_30px_rgba(255,107,0,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 border border-white/20"
      >
        <Plus size={24} />
      </button>

      <CreditModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        debt={selectedDebt}
        defaultType={activeTab}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default CreditBook;