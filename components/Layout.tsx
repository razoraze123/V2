import React, { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard, Users, CreditCard, Wallet, LogOut, Settings, HandCoins, Repeat, Plus, Bell, Sparkles } from 'lucide-react';
import { ViewState } from '../types';
import { useAction } from './ActionContext';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { triggerAction, hasAction } = useAction();

  // Pour cet exemple, on suppose que l'utilisateur est Flux Admin
  const user = { name: "Flux Admin", email: "admin@flux.finance" };
  const userInitial = user.name.charAt(0);

  useEffect(() => {
    if (isMenuOpen || isProfileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen, isProfileOpen]);

  // Handle Full Screen Chat Mode
  const isChatMode = currentView === 'agent-moussa';

  const navItemsMobile = [
    { id: 'dashboard', label: 'Accueil', icon: <LayoutDashboard size={22} /> },
    { id: 'clients', label: 'Clients', icon: <Users size={22} /> },
    // Middle Slot is dynamic, handled in render
    { id: 'expenses', label: 'Dépenses', icon: <CreditCard size={22} /> },
    { id: 'income', label: 'Recettes', icon: <Wallet size={22} /> },
  ];

  // Full Sidebar items (Desktop)
  const sidebarItems: { id: ViewState; label: string; icon: React.ReactNode; group?: string }[] = [
    { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard size={20} /> },
    { id: 'agent-moussa', label: 'Agent Moussa', icon: <Sparkles size={20} className="text-indigo-400" /> },
    { id: 'clients', label: 'Clients', icon: <Users size={20} />, group: 'commercial' },
    { id: 'invoices', label: 'Facturation', icon: <CreditCard size={20} />, group: 'commercial' },
    { id: 'expenses', label: 'Dépenses', icon: <CreditCard size={20} />, group: 'finance' },
    { id: 'income', label: 'Recettes', icon: <Wallet size={20} />, group: 'finance' },
    { id: 'credits', label: 'Carnet de Crédits', icon: <HandCoins size={20} />, group: 'finance' },
    { id: 'recurring', label: 'Charges Fixes', icon: <Repeat size={20} />, group: 'finance' },
  ];

  const handleNav = (view: ViewState) => {
    onNavigate(view);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
      window.location.reload();
  };

  const handleCenterButton = () => {
      if (currentView === 'dashboard') {
          handleNav('agent-moussa');
      } else {
          triggerAction();
      }
  };

  return (
    <div className="relative min-h-screen w-full bg-midnight font-sans text-white">
      {/* --- MESH GRADIENT BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-noise">
        <div className="absolute top-[-20%] left-[-10%] w-[90vw] h-[90vw] md:w-[1000px] md:h-[1000px] bg-gradient-to-br from-orange-600 to-amber-600 rounded-full mix-blend-screen filter blur-[100px] opacity-60 animate-blob"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[90vw] h-[90vw] md:w-[900px] md:h-[900px] bg-gradient-to-tl from-blue-700 to-cyan-600 rounded-full mix-blend-screen filter blur-[90px] opacity-50 animate-blob animation-delay-4000"></div>
        <div className="absolute top-[40%] left-[30%] w-[600px] h-[600px] bg-purple-600/30 rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-pulse-slow"></div>
      </div>

      {/* --- HEADER MOBILE (HP Style) --- */}
      {/* Hidden when Agent Moussa is active */}
      {!isChatMode && (
        <div className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-end px-6 py-6 md:hidden bg-gradient-to-b from-black/20 to-transparent pointer-events-none transition-all duration-300">
           {/* Actions Right (Profile & Menu) */}
           <div className="flex items-center gap-3 pointer-events-auto">
               
               {/* 1. Profile Avatar (remplace la cloche) */}
               <button 
                  onClick={() => setIsProfileOpen(true)}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white border border-white/20 shadow-lg backdrop-blur-xl active:scale-95 transition-transform"
               >
                  <span className="font-semibold">{userInitial}</span>
               </button>
  
               {/* 2. Burger Menu */}
               <button 
                  onClick={() => setIsMenuOpen(true)}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/10 shadow-lg backdrop-blur-xl active:scale-95 transition-transform"
               >
                  <Menu size={18} />
               </button>
           </div>
        </div>
      )}

      {/* --- DESKTOP HEADER (Hidden Mobile) --- */}
      <div className="fixed top-6 left-6 z-50 hidden md:block">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="spatial-button p-3 rounded-full text-white/90 hover:text-white transition-colors group"
        >
          <Menu className="group-hover:scale-110 transition-transform" />
        </button>
      </div>

      <div className="fixed top-5 right-4 md:top-6 md:right-6 z-50 hidden md:block">
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="rounded-full p-[3px] border border-white/20 hover:border-orange-500/80 transition-all bg-white/10 backdrop-blur-xl shadow-lg hover:shadow-orange-500/20"
        >
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-medium shadow-inner border border-white/20">
            {userInitial}
          </div>
        </button>
      </div>

      {/* --- Main Content --- */}
      <main className={`relative z-10 w-full min-h-screen transition-all duration-500 ${isChatMode ? 'p-0' : 'p-4 md:p-10 pt-24 md:pt-10 md:pl-28 pb-32 md:pb-10'}`}>
        {children}
      </main>

      {/* --- MOBILE DYNAMIC LIQUID DOCK (5 Slots) --- */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-[90] md:hidden transition-transform duration-500 ease-in-out ${isChatMode ? 'translate-y-[150%]' : 'translate-y-0'}`}
      >
        {/* Improved Liquid Glass Background Layer */}
        <div className="absolute inset-0 bg-[#02020a]/30 backdrop-blur-2xl border-t border-white/15 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]"></div>
        
        <div className="relative grid grid-cols-5 items-center pb-6 pt-4 px-2">
            {/* Slot 1: Accueil */}
            <button
                onClick={() => handleNav('dashboard')}
                className="flex flex-col items-center justify-center w-full group relative"
            >
                <span className={`transition-all duration-300 ${currentView === 'dashboard' ? 'text-white scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'text-white/40'}`}>
                  <LayoutDashboard size={22} />
                </span>
                <span className={`text-[9px] mt-1 font-medium tracking-wide ${currentView === 'dashboard' ? 'text-white' : 'text-white/40'}`}>Accueil</span>
            </button>

            {/* Slot 2: Clients */}
            <button
                onClick={() => handleNav('clients')}
                className="flex flex-col items-center justify-center w-full group relative"
            >
                <span className={`transition-all duration-300 ${currentView === 'clients' ? 'text-white scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'text-white/40'}`}>
                  <Users size={22} />
                </span>
                <span className={`text-[9px] mt-1 font-medium tracking-wide ${currentView === 'clients' ? 'text-white' : 'text-white/40'}`}>Clients</span>
            </button>

            {/* Slot 3: CENTER DYNAMIC BUTTON */}
            <div className="flex items-center justify-center -mt-6">
                 <button
                    onClick={handleCenterButton}
                    className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/20 transition-all duration-300 active:scale-95 ${
                        currentView === 'dashboard' 
                        ? 'bg-gradient-to-tr from-indigo-600 to-purple-500 text-white shadow-indigo-500/40 hover:shadow-indigo-500/60' // Agent State
                        : 'bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-orange-500/40 hover:shadow-orange-500/60' // Action State
                    }`}
                 >
                    {currentView === 'dashboard' ? (
                        <Sparkles size={24} className="animate-pulse-slow" />
                    ) : (
                        <Plus size={28} className={`transition-transform duration-300 ${hasAction ? 'rotate-0' : 'rotate-45 opacity-50'}`} />
                    )}
                 </button>
            </div>

            {/* Slot 4: Dépenses */}
            <button
                onClick={() => handleNav('expenses')}
                className="flex flex-col items-center justify-center w-full group relative"
            >
                <span className={`transition-all duration-300 ${currentView === 'expenses' ? 'text-white scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'text-white/40'}`}>
                  <CreditCard size={22} />
                </span>
                <span className={`text-[9px] mt-1 font-medium tracking-wide ${currentView === 'expenses' ? 'text-white' : 'text-white/40'}`}>Dépenses</span>
            </button>

            {/* Slot 5: Recettes */}
            <button
                onClick={() => handleNav('income')}
                className="flex flex-col items-center justify-center w-full group relative"
            >
                <span className={`transition-all duration-300 ${currentView === 'income' ? 'text-white scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'text-white/40'}`}>
                  <Wallet size={22} />
                </span>
                <span className={`text-[9px] mt-1 font-medium tracking-wide ${currentView === 'income' ? 'text-white' : 'text-white/40'}`}>Recettes</span>
            </button>
        </div>
      </div>

      {/* --- SIDEBAR & PROFILE (Unchanged) --- */}
      {/* Profile Popup */}
      {isProfileOpen && (
        <>
          <div className="fixed inset-0 z-[150]" onClick={() => setIsProfileOpen(false)} />
          <div className="fixed top-20 right-4 left-4 sm:left-auto sm:right-6 z-[160] w-auto sm:w-[350px] spatial-glass bg-[#0a0a1a]/80 rounded-[30px] overflow-hidden text-sm animate-in fade-in zoom-in-95 duration-200 origin-top-right">
             <div className="relative p-8 flex flex-col items-center text-center">
                 {/* ... Profile Content ... */}
                <button onClick={() => setIsProfileOpen(false)} className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors"><X size={20} /></button>
                <div className="text-sm text-white/60 mb-6 font-medium tracking-wide">{user.email}</div>
                <div className="relative mb-4 group cursor-pointer">
                   <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-4xl font-light text-white border-[3px] border-[#0a0a1a] shadow-2xl">{userInitial}</div>
                </div>
                <h3 className="text-2xl text-white mb-6 font-bold tracking-tight">{user.name}</h3>
                <button className="px-8 py-3 rounded-2xl border border-white/20 text-white font-medium hover:bg-white/10 transition-all shadow-lg hover:shadow-orange-500/10 active:scale-95">Modifier mon profil</button>
            </div>
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      <div className={`fixed inset-0 z-[100] transform transition-all duration-500 ease-in-out ${isMenuOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMenuOpen(false)} />
        <div className={`absolute top-0 left-0 h-full w-80 max-w-[85vw] spatial-glass border-r border-white/20 shadow-[0_0_80px_rgba(0,0,0,0.8)] transform transition-transform duration-500 cubic-bezier(0.25, 1, 0.5, 1) flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full p-8 relative overflow-hidden z-20">
            <div className="flex justify-between items-center mb-8 relative">
              <h2 className="text-4xl font-bold tracking-tighter text-white drop-shadow-md">Flux<span className="text-orange-500">.</span></h2>
            </div>
            <nav className="flex-1 space-y-3 relative overflow-y-auto pr-2 custom-scrollbar">
              {sidebarItems.map((item, index) => (
                <div key={item.id}>
                  {(index === 0 || (item.group && sidebarItems[index - 1]?.group !== item.group)) && item.group && (
                    <div className="mt-6 mb-2 px-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">{item.group === 'commercial' ? 'Commercial' : item.group === 'finance' ? 'Finance' : ''}</div>
                  )}
                  <button onClick={() => handleNav(item.id as ViewState)} className={`w-full flex items-center space-x-4 p-4 rounded-2xl border transition-all duration-300 group relative overflow-hidden ${currentView === item.id ? 'bg-white/10 border-white/20 text-white shadow-[0_10px_30px_rgba(0,0,0,0.2)]' : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'}`}>
                    {currentView === item.id && <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent opacity-50"></div>}
                    <span className={`relative z-10 ${currentView === item.id ? 'text-orange-500 drop-shadow-[0_0_12px_rgba(255,107,0,0.8)]' : 'group-hover:text-white group-hover:scale-110 transition-transform duration-300'}`}>{item.icon}</span>
                    <span className={`font-semibold tracking-wide relative z-10 text-sm`}>{item.label}</span>
                  </button>
                </div>
              ))}
            </nav>
            <div className="pt-6 border-t border-white/10 space-y-2 relative">
               {/* Footer Items */}
               <button onClick={() => handleNav('settings')} className="w-full flex items-center space-x-4 p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group text-white/60"><Settings size={20}/><span className="font-medium">Paramètres</span></button>
               <button onClick={handleLogout} className="w-full flex items-center space-x-4 p-4 rounded-2xl hover:bg-red-500/10 border border-transparent hover:border-red-500/20 hover:text-red-400 transition-all text-white/60 group"><LogOut size={20}/><span className="font-medium">Déconnexion</span></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;