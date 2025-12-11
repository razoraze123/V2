import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, LayoutGrid, 
  CarFront, UtensilsCrossed, AppWindow, Laptop, Building2, MoreHorizontal, 
  Briefcase, ShoppingBag, RefreshCw, Gem, 
  Megaphone, Users, Plane, Wrench, Wifi, Landmark, GraduationCap 
} from 'lucide-react';
import { Transaction } from '../types';
import { transactionService } from '../services/mockData';
import FinanceModal from './FinanceModal';
import { useAction } from './ActionContext';

interface FinanceModuleProps {
  moduleType: 'income' | 'expense';
}

const FinanceModule: React.FC<FinanceModuleProps> = ({ moduleType }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tout');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { registerAction } = useAction();

  // Register ADD action to global header
  useEffect(() => {
    registerAction(() => setIsModalOpen(true));
    return () => registerAction(null);
  }, [registerAction]);

  useEffect(() => {
    loadTransactions();
  }, [moduleType]);

  const loadTransactions = async () => {
    setIsLoading(true);
    const data = await transactionService.getTransactions(moduleType);
    setTransactions(data);
    setIsLoading(false);
  };

  const handleAddTransaction = async (newTx: Transaction) => {
    setTransactions(prev => [newTx, ...prev]);
    await transactionService.addTransaction(newTx);
    setIsModalOpen(false);
  };

  const totalAmount = useMemo(() => {
    return transactions.reduce((acc, curr) => acc + curr.amount, 0);
  }, [transactions]);

  const categories = ['Tout', ...new Set(transactions.map(t => t.category))];

  const filteredTransactions = selectedCategory === 'Tout' 
    ? transactions 
    : transactions.filter(t => t.category === selectedCategory);

  const getIconForCategory = (cat: string) => {
    const map: Record<string, React.ReactNode> = {
      // Dépenses
      'Transport': <CarFront size={18} />,
      'Repas': <UtensilsCrossed size={18} />,
      'Logiciel': <AppWindow size={18} />,
      'Matériel': <Laptop size={18} />,
      'Bureau': <Building2 size={18} />,
      'Marketing': <Megaphone size={18} />,
      'Salaires': <Users size={18} />,
      'Voyage': <Plane size={18} />,
      'Maintenance': <Wrench size={18} />,
      'Internet': <Wifi size={18} />,
      'Impôts': <Landmark size={18} />,
      'Formation': <GraduationCap size={18} />,
      // Recettes
      'Prestation': <Briefcase size={18} />,
      'Vente': <ShoppingBag size={18} />,
      'Retainer': <RefreshCw size={18} />,
      'Dividendes': <Gem size={18} />,
      // Fallback
      'Autre': <MoreHorizontal size={18} />,
    };
    return map[cat] || <LayoutGrid size={18} />;
  };

  const formatFCFA = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  return (
    <div className="w-full max-w-lg mx-auto pb-24">
      {/* HEADER SECTION */}
      <div className="flex flex-col items-center justify-center py-8 space-y-2">
         <span className="text-white/50 uppercase tracking-widest text-xs font-semibold">
            {moduleType === 'expense' ? 'Dépenses du mois' : 'Recettes du mois'}
         </span>
         <h1 className={`text-4xl md:text-5xl font-bold tracking-tight text-center break-words w-full px-4 ${moduleType === 'income' ? 'text-white drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'text-white drop-shadow-[0_0_15px_rgba(255,107,0,0.5)]'}`}>
            {formatFCFA(totalAmount)}
         </h1>
      </div>

      {/* CATEGORY CHIPS */}
      <div className="flex overflow-x-auto pb-6 gap-3 no-scrollbar mask-fade-sides px-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
              selectedCategory === cat 
                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* LIST SECTION */}
      <div className="space-y-4">
        {isLoading ? (
          [1, 2, 3].map(i => <div key={i} className="h-20 spatial-glass rounded-2xl animate-pulse" />)
        ) : (
          filteredTransactions.map(tx => (
            <div 
              key={tx.id} 
              className="spatial-glass rounded-2xl p-4 flex items-center justify-between group active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border border-white/10 shadow-inner ${moduleType === 'income' ? 'bg-cyan-900/20 text-cyan-400' : 'bg-orange-900/20 text-orange-400'}`}>
                   {getIconForCategory(tx.category)}
                </div>
                <div>
                   <h3 className="text-white font-medium text-base">{tx.description}</h3>
                   <p className="text-white/40 text-xs mt-0.5">{new Date(tx.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</p>
                </div>
              </div>
              
              <div className={`text-right font-semibold whitespace-nowrap ${moduleType === 'income' ? 'text-cyan-400' : 'text-white'}`}>
                 <div className="flex items-center justify-end gap-1">
                    {moduleType === 'income' ? '+' : '-'} {formatFCFA(tx.amount)}
                 </div>
              </div>
            </div>
          ))
        )}
        
        {!isLoading && filteredTransactions.length === 0 && (
           <div className="text-center py-12 text-white/30">
              Aucune transaction trouvée.
           </div>
        )}
      </div>

      {/* DESKTOP FAB (Hidden on Mobile) */}
      <button
        onClick={() => setIsModalOpen(true)}
        className={`hidden md:flex fixed bottom-8 right-8 z-40 p-4 rounded-full text-white shadow-xl transition-all hover:scale-110 active:scale-95 border border-white/20
          ${moduleType === 'income' 
            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-500/40' 
            : 'bg-gradient-to-r from-orange-500 to-amber-600 shadow-orange-500/40'
          }`}
      >
        <Plus size={28} />
      </button>

      <FinanceModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={moduleType}
        onSave={handleAddTransaction}
      />
    </div>
  );
};

export default FinanceModule;