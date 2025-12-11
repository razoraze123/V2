import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, Clock, Send, Edit3, Eye, Download, X, ExternalLink, FileCheck } from 'lucide-react';
import { Invoice } from '../types';
import { invoiceService } from '../services/mockData';
import { useToast } from './ToastContext';

const Invoices: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'invoice' | 'quote'>('invoice');
  const [documents, setDocuments] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<Invoice | null>(null);
  
  const { addToast } = useToast();

  useEffect(() => {
    const fetchDocs = async () => {
      setIsLoading(true);
      const data = await invoiceService.getInvoices(activeTab);
      setDocuments(data);
      setIsLoading(false);
    };
    fetchDocs();
  }, [activeTab]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedDoc) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedDoc]);

  const formatFCFA = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
      case 'accepted':
        return <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-medium border border-cyan-500/20 flex items-center gap-1"><CheckCircle size={10} /> {status === 'paid' ? 'Payé' : 'Accepté'}</span>;
      case 'pending':
        return <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-medium border border-orange-500/20 flex items-center gap-1"><Clock size={10} /> En attente</span>;
      case 'sent':
        return <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20 flex items-center gap-1"><Send size={10} /> Envoyé</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-white/10 text-white/50 text-xs font-medium border border-white/10 flex items-center gap-1"><Edit3 size={10} /> Brouillon</span>;
    }
  };

  const handleAction = () => {
    if (selectedDoc?.type === 'quote') {
        addToast(`Devis N° ${selectedDoc.number} transformé en facture avec succès.`, 'success');
    } else {
        addToast(`Facture N° ${selectedDoc?.number} marquée comme payée.`, 'success');
    }
    setSelectedDoc(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">Documents</h1>
          <p className="text-white/60 text-lg font-light">Gestion de la facturation</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 w-full md:w-auto self-start overflow-hidden">
        <button
          onClick={() => setActiveTab('invoice')}
          className={`flex-1 md:flex-none px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
            activeTab === 'invoice'
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
              : 'text-white/50 hover:bg-white/5 hover:text-white'
          }`}
        >
          Factures
        </button>
        <button
          onClick={() => setActiveTab('quote')}
          className={`flex-1 md:flex-none px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
            activeTab === 'quote'
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
              : 'text-white/50 hover:bg-white/5 hover:text-white'
          }`}
        >
          Devis
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {isLoading ? (
           [1, 2, 3].map(i => <div key={i} className="h-24 spatial-glass rounded-[20px] animate-pulse" />)
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className="group spatial-glass rounded-[20px] p-5 cursor-pointer hover:border-orange-500/30 hover:bg-white/5 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-105 ${activeTab === 'invoice' ? 'bg-cyan-900/20 text-cyan-400 border border-cyan-500/20' : 'bg-purple-900/20 text-purple-400 border border-purple-500/20'}`}>
                  {activeTab === 'invoice' ? <CheckCircle size={24} /> : <FileText size={24} />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-bold text-base">{doc.client}</h3>
                    <span className="text-white/30 text-xs px-2 py-0.5 rounded-md bg-white/5 border border-white/5">{doc.number}</span>
                  </div>
                  <p className="text-white/40 text-xs flex items-center gap-2">
                    <CalendarIcon date={doc.date} />
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-4 md:pt-0 border-t border-white/5 md:border-0">
                <div className="text-right">
                  <p className="text-white font-bold text-lg">{formatFCFA(doc.amount)}</p>
                  <div className="flex justify-end mt-1">{getStatusBadge(doc.status)}</div>
                </div>
                <div className="hidden md:block text-white/20 group-hover:text-orange-500 transition-colors">
                  <Eye size={20} />
                </div>
              </div>
            </div>
          ))
        )}
        
        {!isLoading && documents.length === 0 && (
          <div className="text-center py-20 text-white/30 flex flex-col items-center gap-4">
             <FileText size={48} className="opacity-20" />
             <p>Aucun document trouvé.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center md:p-4">
           <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setSelectedDoc(null)} />
           
           <div className="relative w-full max-w-md spatial-glass rounded-t-[30px] md:rounded-[30px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
              <div className="p-8 space-y-8">
                 <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white/50 text-xs uppercase tracking-widest font-bold mb-1">{selectedDoc.type === 'invoice' ? 'Facture' : 'Devis'} N° {selectedDoc.number}</p>
                      <h2 className="text-2xl font-bold text-white">{selectedDoc.client}</h2>
                    </div>
                    <button onClick={() => setSelectedDoc(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors">
                      <X size={20} />
                    </button>
                 </div>

                 <div className="flex flex-col items-center justify-center py-6 border-y border-white/10 bg-white/5 rounded-2xl">
                    <span className="text-white/40 text-sm mb-2">Montant Total</span>
                    <span className="text-4xl font-bold text-white">{formatFCFA(selectedDoc.amount)}</span>
                    <div className="mt-4 scale-125">
                       {getStatusBadge(selectedDoc.status)}
                    </div>
                 </div>

                 <div className="space-y-3">
                    <a 
                      href={selectedDoc.driveLink} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                    >
                      <Eye size={20} />
                      Voir le PDF
                    </a>
                    
                    <button 
                      onClick={handleAction}
                      className="w-full py-4 rounded-xl border border-white/10 hover:bg-white/5 text-white font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      {selectedDoc.type === 'quote' ? (
                        <>
                           <FileCheck size={18} />
                           Transformer en Facture
                        </>
                      ) : (
                        <>
                           <CheckCircle size={18} />
                           Marquer comme Payé
                        </>
                      )}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const CalendarIcon = ({ date }: { date: string }) => (
  <>
    <span>{new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
  </>
);

export default Invoices;