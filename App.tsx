import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Clients from './components/Clients';
import Auth from './components/Auth';
import FinanceModule from './components/FinanceModule';
import Dashboard from './components/Dashboard';
import Invoices from './components/Invoices';
import CreditBook from './components/CreditBook';
import Recurring from './components/Recurring';
import AgentMoussa from './components/AgentMoussa';
import { ViewState } from './types';
import { ChevronRight, Lock, Bell, Globe, Bot } from 'lucide-react';

// Toggle this to TRUE to bypass login
const IS_DEV_MODE = false;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(IS_DEV_MODE);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  
  // Settings State
  const [webhookUrl, setWebhookUrl] = useState('');

  // Gestion globale du scroll pour l'écran d'Auth
  useEffect(() => {
    if (!isAuthenticated) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAuthenticated]);

  useEffect(() => {
     // Load webhook url from localstorage on mount
     const stored = localStorage.getItem('flux_n8n_webhook');
     if(stored) setWebhookUrl(stored);
  }, []);

  const handleWebhookSave = (e: React.ChangeEvent<HTMLInputElement>) => {
     setWebhookUrl(e.target.value);
     localStorage.setItem('flux_n8n_webhook', e.target.value);
  };

  if (!isAuthenticated) {
    return <Auth onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'agent-moussa':
        return <AgentMoussa onClose={() => setCurrentView('dashboard')} />;
      case 'clients':
        return <Clients />;
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} />;
      case 'invoices':
        return <Invoices />;
      case 'credits':
        return <CreditBook />;
      case 'recurring':
        return <Recurring />;
      case 'settings':
        return (
          <div className="max-w-4xl mx-auto space-y-8 pb-32">
             <h1 className="text-4xl font-bold text-white mb-8">Paramètres</h1>
             
             {/* Section AI Integration */}
             <div className="spatial-glass p-8 rounded-[20px] space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 bg-indigo-500/20 rounded-bl-[20px]">
                    <Bot className="text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4">Agent Moussa (IA)</h3>
                <div className="space-y-4">
                   <p className="text-sm text-white/50">Configurez le lien avec votre cerveau n8n pour activer l'intelligence de Moussa.</p>
                   <div className="space-y-2">
                      <label className="text-xs text-white/40 uppercase tracking-widest">Webhook n8n URL</label>
                      <input 
                         type="url" 
                         value={webhookUrl} 
                         onChange={handleWebhookSave}
                         placeholder="https://votre-instance-n8n.com/webhook/..." 
                         className="glass-input w-full p-4 rounded-xl text-sm font-mono text-indigo-300 border-indigo-500/30 focus:border-indigo-500" 
                      />
                   </div>
                </div>
             </div>

             {/* Section Entreprise */}
             <div className="spatial-glass p-8 rounded-[20px] space-y-6">
                <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4">Infos Entreprise</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-xs text-white/40 uppercase tracking-widest">Nom Légal</label>
                      <input type="text" value="Flux Corp Niger" className="glass-input w-full p-3 rounded-lg" readOnly/>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs text-white/40 uppercase tracking-widest">NIF</label>
                      <input type="text" value="123456789" className="glass-input w-full p-3 rounded-lg" readOnly/>
                   </div>
                </div>
             </div>

             {/* Section Finance */}
             <div className="spatial-glass p-8 rounded-[20px] space-y-6">
                <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4">Finance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-xs text-white/40 uppercase tracking-widest">Devise</label>
                      <select className="glass-input w-full p-3 rounded-lg bg-transparent">
                        <option>FCFA (XOF)</option>
                        <option>EUR (€)</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs text-white/40 uppercase tracking-widest">TVA (%)</label>
                      <input type="number" value="19" className="glass-input w-full p-3 rounded-lg"/>
                   </div>
                </div>
             </div>

             {/* Section Préférences & Sécurité */}
             <div className="spatial-glass rounded-[20px] overflow-hidden">
                <button className="w-full flex items-center justify-between p-6 border-b border-white/10 hover:bg-white/5 transition-colors group">
                    <div className="flex items-center gap-4">
                       <div className="p-2 rounded-full bg-white/5 text-white/70">
                         <Lock size={20} />
                       </div>
                       <span className="font-medium text-white">Sécurité (Mot de passe)</span>
                    </div>
                    <ChevronRight size={20} className="text-white/30 group-hover:text-white transition-colors" />
                </button>
                <button className="w-full flex items-center justify-between p-6 border-b border-white/10 hover:bg-white/5 transition-colors group">
                    <div className="flex items-center gap-4">
                       <div className="p-2 rounded-full bg-white/5 text-white/70">
                         <Bell size={20} />
                       </div>
                       <span className="font-medium text-white">Notifications</span>
                    </div>
                    <ChevronRight size={20} className="text-white/30 group-hover:text-white transition-colors" />
                </button>
                <button className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors group">
                    <div className="flex items-center gap-4">
                       <div className="p-2 rounded-full bg-white/5 text-white/70">
                         <Globe size={20} />
                       </div>
                       <span className="font-medium text-white">Langue & Région</span>
                    </div>
                    <ChevronRight size={20} className="text-white/30 group-hover:text-white transition-colors" />
                </button>
             </div>
             
             <div className="flex gap-4">
               <button className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition text-white">Export Données (CSV)</button>
             </div>
          </div>
        );
      case 'expenses':
        return <FinanceModule moduleType="expense" />;
      case 'income':
        return <FinanceModule moduleType="income" />;
      default:
        return <Clients />;
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
       {/* Page Transition Wrapper */}
       <div key={currentView} className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out h-full">
        {renderContent()}
       </div>
    </Layout>
  );
}

export default App;