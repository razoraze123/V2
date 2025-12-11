import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Repeat, Zap, Wifi, Droplets, Home, Tv, MoreHorizontal, CalendarClock, Plus, X, Save, Trash2, Tag, ChevronDown, Check } from 'lucide-react';
import { Recurring } from '../types';
import { recurringService, formatCurrency } from '../services/mockData';
import { useAction } from './ActionContext';

// --- CUSTOM SELECT COMPONENT (For Glass Effect) ---
interface CustomSelectProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label, value, options, onChange, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find(opt => opt.value === value)?.label || value;

  return (
    <div className={`relative group ${isOpen ? 'z-50' : 'z-20'}`} ref={containerRef}>
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5 pointer-events-none z-10">
          {icon}
        </div>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`glass-input w-full py-3.5 ${icon ? 'pl-12' : 'pl-4'} pr-10 rounded-xl text-left flex items-center justify-between transition-colors ${isOpen ? 'bg-white/10 border-white/30' : ''}`}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown size={16} className={`text-white/50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-[60] spatial-glass rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 max-h-60 overflow-y-auto custom-scrollbar border border-white/20">
            <div className="py-2 backdrop-blur-xl bg-[#0a0a1a]/90">
              {options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-3 cursor-pointer flex items-center justify-between hover:bg-white/10 transition-colors ${value === option.value ? 'bg-orange-500/20 text-orange-400' : 'text-white/80'}`}
                >
                  <span className="text-sm font-medium">{option.label}</span>
                  {value === option.value && <Check size={14} />}
                </div>
              ))}
            </div>
        </div>
      )}
    </div>
  );
};

// --- MODAL COMPONENT ---
interface RecurringModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: Recurring | null;
  onSave: (item: Recurring) => void;
  onDelete: (id: string) => void;
}

const RecurringModal: React.FC<RecurringModalProps> = ({ isOpen, onClose, item, onSave, onDelete }) => {
  const [formData, setFormData] = useState<Partial<Recurring>>({
    name: '',
    amount: 0,
    frequency: 'monthly',
    nextDate: new Date().toISOString().split('T')[0],
    category: '🏠 Loyer',
    active: true
  });
  const [amountStr, setAmountStr] = useState('');

  const categories = [
    { value: '🏠 Loyer', label: '🏠 Loyer' },
    { value: '💡 Électricité', label: '💡 Électricité' },
    { value: '💧 Eau', label: '💧 Eau' },
    { value: '📱 Internet', label: '📱 Internet' },
    { value: '🛡️ Salaires', label: '🛡️ Salaires' },
    { value: '⛽ Carburant', label: '⛽ Carburant' },
    { value: '📺 Divertissement', label: '📺 Divertissement' },
    { value: '💰 Épargne', label: '💰 Épargne' },
    { value: '📝 Autre', label: '📝 Autre' }
  ];

  const frequencies = [
      { value: 'weekly', label: 'Hebdomadaire' },
      { value: 'monthly', label: 'Mensuel' },
      { value: 'yearly', label: 'Annuel' }
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (item) {
        setFormData(item);
        setAmountStr(item.amount.toString());
      } else {
        setFormData({
            name: '',
            amount: 0,
            frequency: 'monthly',
            nextDate: new Date().toISOString().split('T')[0],
            category: '🏠 Loyer',
            active: true
        });
        setAmountStr('');
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen, item]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !amountStr) return;

    onSave({
      id: item?.id || crypto.randomUUID(),
      ...formData,
      amount: parseFloat(amountStr) || 0
    } as Recurring);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-[500px] spatial-glass rounded-[30px] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {item ? 'Modifier la charge' : 'Nouvelle charge fixe'}
            </h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="flex flex-col items-center justify-center py-2">
               <div className="relative w-full flex items-center justify-center">
                 <input
                   type="number"
                   placeholder="0"
                   value={amountStr}
                   onChange={(e) => setAmountStr(e.target.value)}
                   className="w-full bg-transparent text-5xl font-bold text-white text-center focus:outline-none placeholder-white/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                 />
                 <span className="absolute right-0 top-1/2 -translate-y-1/2 text-white/30 text-lg font-medium pointer-events-none">FCFA</span>
               </div>
            </div>

            <div className="space-y-4">
              <div className="relative group z-30">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Nom (ex: Loyer Bureau)"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="glass-input w-full py-3.5 pl-12 pr-4 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <CustomSelect 
                    label="Fréquence"
                    value={formData.frequency || 'monthly'}
                    options={frequencies}
                    onChange={(val) => setFormData({...formData, frequency: val as any})}
                    icon={<Repeat size={20} />}
                 />
                 
                 <div className="relative group z-10">
                    <input
                      type="date"
                      value={formData.nextDate}
                      onChange={(e) => setFormData({...formData, nextDate: e.target.value})}
                      className="glass-input w-full py-3.5 px-4 rounded-xl text-sm text-center"
                    />
                 </div>
              </div>
              
              <CustomSelect 
                  label="Catégorie"
                  value={formData.category || '📝 Autre'}
                  options={categories}
                  onChange={(val) => setFormData({...formData, category: val})}
                  icon={<MoreHorizontal size={20} />}
               />
            </div>

            <div className="flex gap-3 pt-4 z-0 relative">
              {item && (
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
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
const RecurringCharges: React.FC = () => {
  const [items, setItems] = useState<Recurring[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Recurring | null>(null);

  const { registerAction } = useAction();

  // Register ADD action to global header
  useEffect(() => {
    registerAction(() => {
        setSelectedItem(null);
        setIsModalOpen(true);
    });
    return () => registerAction(null);
  }, [registerAction]);

  useEffect(() => {
    const fetchRecurring = async () => {
      setIsLoading(true);
      const data = await recurringService.getRecurringCharges();
      if (items.length === 0) setItems(data);
      setIsLoading(false);
    };
    fetchRecurring();
  }, []);

  const handleOpenModal = (item: Recurring | null) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleSave = (item: Recurring) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) return prev.map(i => i.id === item.id ? item : i);
      return [item, ...prev];
    });
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    setIsModalOpen(false);
  };

  const handleToggle = async (e: React.MouseEvent, id: string) => {
     e.stopPropagation(); 
     setItems(prev => prev.map(item => item.id === id ? {...item, active: !item.active} : item));
     await recurringService.toggleActive(id);
  };

  const getIcon = (category: string) => {
     const lower = category?.toLowerCase() || '';
     if (lower.includes('élec')) return <Zap size={20} />;
     if (lower.includes('internet') || lower.includes('moov') || lower.includes('airtel') || lower.includes('wifi')) return <Wifi size={20} />;
     if (lower.includes('eau')) return <Droplets size={20} />;
     if (lower.includes('loyer') || lower.includes('bureau')) return <Home size={20} />;
     if (lower.includes('can') || lower.includes('tv') || lower.includes('divertissement')) return <Tv size={20} />;
     return <MoreHorizontal size={20} />;
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col items-start gap-2">
         <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-3">
           <Repeat className="text-orange-500" size={32} />
           Charges Fixes
         </h1>
         <p className="text-white/60 text-lg font-light">Abonnements et factures récurrentes</p>
      </div>

      {/* Summary Card */}
      <div className="spatial-glass rounded-[24px] p-6 flex justify-between items-center bg-gradient-to-r from-orange-500/10 to-amber-500/5">
         <div>
            <span className="text-xs text-white/50 uppercase tracking-widest font-bold">Total Mensuel</span>
            <div className="text-2xl font-bold text-white mt-1">
               {formatCurrency(items.filter(i => i.active).reduce((acc, curr) => acc + curr.amount, 0))}
            </div>
         </div>
         <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
            <CalendarClock size={24} />
         </div>
      </div>

      {/* List */}
      <div className="space-y-3">
         {isLoading ? (
            [1, 2, 3].map(i => <div key={i} className="h-20 spatial-glass rounded-2xl animate-pulse" />)
         ) : (
            items.map(item => (
               <div 
                 key={item.id} 
                 onClick={() => handleOpenModal(item)}
                 className={`spatial-glass rounded-2xl p-4 flex items-center justify-between transition-all duration-300 cursor-pointer hover:bg-white/5 hover:scale-[1.01] ${!item.active ? 'opacity-60 grayscale-[0.5]' : ''}`}
               >
                  <div className="flex items-center gap-4">
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 shadow-inner ${item.active ? 'bg-white/10 text-white' : 'bg-black/20 text-white/30'}`}>
                        {getIcon(item.category)}
                     </div>
                     <div>
                        <h3 className="text-white font-bold text-base">{item.name}</h3>
                        <p className="text-white/40 text-xs mt-0.5">Prochaine : {new Date(item.nextDate).toLocaleDateString('fr-FR', {day: 'numeric', month: 'short'})}</p>
                     </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                     <span className="font-bold text-white">{formatCurrency(item.amount)}</span>
                     <label className="relative inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={item.active} onChange={(e) => handleToggle(e as any, item.id)} className="sr-only peer" />
                        <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                     </label>
                  </div>
               </div>
            ))
         )}
         {!isLoading && items.length === 0 && (
            <div className="text-center py-12 text-white/30">
                Aucune charge récurrente.
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

      <RecurringModal
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         item={selectedItem}
         onSave={handleSave}
         onDelete={handleDelete}
      />
    </div>
  );
};

export default RecurringCharges;