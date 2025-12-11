import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Calendar, Tag, FileText } from 'lucide-react';
import { Transaction, FinanceModalProps } from '../types';

const FinanceModal: React.FC<FinanceModalProps> = ({ isOpen, onClose, type, onSave }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showModal, setShowModal] = useState(false);

  // Categories based on type
  const categories = type === 'expense' 
    ? [
        'Transport', 'Repas', 'Logiciel', 'Matériel', 'Bureau', 
        'Marketing', 'Salaires', 'Voyage', 'Internet', 'Maintenance', 'Impôts', 'Formation', 'Autre'
      ]
    : ['Prestation', 'Vente', 'Retainer', 'Dividendes', 'Autre'];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setShowModal(true);
      setAmount('');
      setDescription('');
      setCategory(categories[0]);
      setDate(new Date().toISOString().split('T')[0]);
    } else {
      setShowModal(false);
      const timer = setTimeout(() => {
        document.body.style.overflow = 'unset';
      }, 300);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      type,
      amount: parseFloat(amount),
      description,
      category,
      date,
    };
    onSave(newTransaction);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 ${showModal ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Glass Modal Container - 100% Glass (No opaque background) */}
      <div 
        className={`relative w-full max-w-[500px] spatial-glass rounded-t-[30px] sm:rounded-[30px] shadow-2xl overflow-hidden transform transition-all duration-300 ${showModal ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-full opacity-0 scale-95'}`}
      >
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-white capitalize">
              {type === 'expense' ? 'Nouvelle Dépense' : 'Nouvelle Recette'}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* BIG AMOUNT INPUT - No Spinners, FCFA context */}
            <div className="flex flex-col items-center justify-center py-4">
               <div className="relative w-full flex items-center justify-center">
                 <input
                   type="number"
                   autoFocus
                   placeholder="0"
                   value={amount}
                   onChange={(e) => setAmount(e.target.value)}
                   className="w-full bg-transparent text-5xl font-bold text-white text-center focus:outline-none placeholder-white/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                 />
                 <span className="absolute right-0 top-1/2 -translate-y-1/2 text-white/30 text-lg font-medium pointer-events-none">FCFA</span>
               </div>
            </div>

            <div className="space-y-4">
              {/* Description */}
              <div className="relative group">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="glass-input w-full py-4 pl-12 pr-4 rounded-xl"
                  required
                />
              </div>

              {/* Category & Date Grid */}
              <div className="flex gap-4">
                 <div className="relative group flex-1">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="glass-input w-full py-4 pl-12 pr-4 rounded-xl appearance-none bg-transparent"
                    >
                      {categories.map(c => <option key={c} value={c} className="bg-black text-white">{c}</option>)}
                    </select>
                 </div>
                 
                 <div className="relative group w-2/5">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="glass-input w-full py-4 pl-12 pr-2 rounded-xl text-sm"
                    />
                 </div>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-4 rounded-xl mt-4 font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 
                ${type === 'expense' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 shadow-orange-500/20' 
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 shadow-cyan-500/20'
                } hover:scale-[1.02] active:scale-[0.98]`}
            >
              <Check size={20} />
              Valider
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default FinanceModal;