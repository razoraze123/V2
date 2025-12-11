import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Search, Mail, Phone, Building2, MoreHorizontal, Trash2 } from 'lucide-react';
import { Client } from '../types';
import { clientService } from '../services/mockData';
import ClientModal from './ClientModal';
import { useAction } from './ActionContext';

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const { registerAction } = useAction();

  // Register the ADD action to the global header
  useEffect(() => {
    registerAction(() => {
        setSelectedClient(null);
        setIsModalOpen(true);
    });
    // Cleanup action when unmounting
    return () => registerAction(null);
  }, [registerAction]);

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      const data = await clientService.getClients();
      setClients(data);
      setIsLoading(false);
    };
    fetchClients();
  }, []);

  const handleSave = async (updatedClient: Client) => {
    setClients(prev => {
      const index = prev.findIndex(c => c.id === updatedClient.id);
      if (index >= 0) {
        const newClients = [...prev];
        newClients[index] = updatedClient;
        return newClients;
      }
      return [updatedClient, ...prev];
    });
    await clientService.upsertClient(updatedClient);
    setIsModalOpen(false);
  };

  const openModal = (client: Client | null) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (client: Client) => {
    setClientToDelete(client);
  };

  const confirmDelete = async () => {
    if (clientToDelete) {
        await clientService.deleteClient(clientToDelete.id);
        setClients(prev => prev.filter(c => c.id !== clientToDelete.id));
        setClientToDelete(null);
        setIsModalOpen(false);
    }
  };

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">Clients</h1>
            <p className="text-white/60 text-lg font-light">Portefeuille partenaires</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative group flex-1 md:w-80">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-orange-500 transition-colors">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Rechercher un client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input w-full rounded-xl py-3.5 pl-12 pr-6 placeholder-white/30"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-40 rounded-[20px] bg-white/5 border border-white/5" />
          ))}
        </div>
      ) : (
        /* Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              onClick={() => openModal(client)}
              className="group spatial-glass rounded-[20px] p-6 cursor-pointer hover:bg-white/[0.07] hover:border-orange-500/40 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)] transition-all duration-500 ease-out relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                   <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors truncate">
                    {client.name}
                  </h3>
                   <div className="flex items-center gap-1.5 text-sm text-white/50 mt-1 font-light">
                    <Building2 size={14} />
                    <span>{client.company}</span>
                  </div>
                </div>
                <button className="text-white/20 hover:text-white transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <div className="space-y-2">
                 <div className="flex items-center gap-3 text-sm text-white/60 p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                    <Mail size={16} className="text-orange-500/70" />
                    <span className="truncate">{client.email}</span>
                 </div>
                 <div className="flex items-center gap-3 text-sm text-white/60 p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                    <Phone size={16} className="text-orange-500/70" />
                    <span className="truncate">{client.phone}</span>
                 </div>
              </div>
            </div>
          ))}
          
          {filteredClients.length === 0 && (
             <div className="col-span-full py-20 text-center flex flex-col items-center">
                <p className="text-xl text-white/40">Aucun résultat</p>
             </div>
          )}
        </div>
      )}

      {/* DESKTOP FAB (Hidden on Mobile) */}
      <button
        onClick={() => openModal(null)}
        className="hidden md:flex fixed bottom-8 right-8 z-40 p-5 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full shadow-[0_5px_20px_rgba(255,107,0,0.4)] hover:shadow-[0_10px_30px_rgba(255,107,0,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 group border border-white/20"
      >
        <Plus className="w-8 h-8 text-white group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Edit Modal */}
      <ClientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        client={selectedClient}
        onSave={handleSave}
        onDelete={handleDeleteRequest}
      />

      {/* Confirm Delete Dialog */}
      {clientToDelete && createPortal(
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setClientToDelete(null)} />
            <div className="relative w-full max-w-sm spatial-glass rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-red-500/30">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                        <Trash2 className="text-red-500" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white">Supprimer le client ?</h3>
                    <p className="text-white/60 text-sm">
                        Cette action est irréversible.
                    </p>
                    <div className="flex gap-3 w-full mt-2">
                        <button onClick={() => setClientToDelete(null)} className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white/70 font-medium">Annuler</button>
                        <button onClick={confirmDelete} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-bold">Supprimer</button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Clients;