import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, ArrowLeft, MoreVertical } from 'lucide-react';
import { GoogleGenAI, Chat } from "@google/genai";

interface AgentMoussaProps {
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AgentMoussa: React.FC<AgentMoussaProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      content: "Salam ! Je suis Moussa, ton assistant financier intelligent. Je suis connecté à Google Gemini pour t'aider à gérer tes dépenses et tes factures en temps réel. Comment puis-je t'aider ?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Instance du Chat Gemini
  const [chatSession, setChatSession] = useState<Chat | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialisation de Google GenAI
  useEffect(() => {
    const initGemini = async () => {
      try {
        // Clé API définie directement pour éviter tout crash lié à l'environnement
        const apiKey = "gen-lang-client-0754231419";
        
        const ai = new GoogleGenAI({ apiKey: apiKey });
        const chat = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: `Tu es Moussa, un assistant financier intelligent et expert-comptable virtuel conçu pour l'application 'Flux'.
            Ton public cible sont des petits entrepreneurs et commerçants au Niger.
            
            Tes traits de personnalité :
            - Professionnel mais très accessible et amical ("Salam mon ami", "Pas de souci").
            - Tu parles français couramment, avec parfois des expressions locales si approprié pour créer du lien.
            - Tu es expert en finance, gestion de trésorerie, facturation et suivi des dettes.
            - La devise de référence est le FCFA (Franc CFA).
            
            Tes missions :
            1. Aider à catégoriser des dépenses.
            2. Donner des conseils pour économiser ou gérer la trésorerie.
            3. Expliquer des termes financiers simples.
            4. Répondre aux questions sur l'utilisation de l'application Flux.
            
            Si l'utilisateur te demande d'effectuer une action réelle (comme "enregistre cette dépense"), tu peux pour l'instant lui dire quelles informations tu as comprises (Montant, Catégorie, Date) et lui expliquer comment le faire dans l'application, car tu es en mode 'Conseiller' pour le moment.`,
          },
        });
        setChatSession(chat);
      } catch (error) {
        console.error("Erreur d'initialisation Gemini:", error);
        const errorMsg: Message = {
          id: 'init-error',
          role: 'ai',
          content: "Attention: Je n'arrive pas à me connecter correctement au serveur.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    };
    
    initGemini();
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      if (chatSession) {
        // Envoi du message à Gemini
        const result = await chatSession.sendMessage({ message: userMsg.content });
        const aiResponseText = result.text || "Je n'ai pas de réponse pour le moment.";

        const aiMsg: Message = {
          id: crypto.randomUUID(),
          role: 'ai',
          content: aiResponseText,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        // Fallback si la session n'est pas prête
        setTimeout(() => {
            const aiMsg: Message = {
              id: crypto.randomUUID(),
              role: 'ai',
              content: "Je suis en train de charger mes circuits. Réessaie dans une seconde !",
              timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
        }, 1000);
      }
    } catch (error) {
      console.error("Erreur de chat:", error);
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: 'ai',
        content: "Désolé, j'ai rencontré une erreur de connexion.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col h-[100dvh] w-full animate-in slide-in-from-bottom duration-500">
      
      {/* Header Specific for Chat */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 bg-white/5 backdrop-blur-xl shrink-0">
         <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white transition-colors">
               <ArrowLeft size={24} />
            </button>
            <div className="relative">
               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                  <Bot size={20} className="text-white" />
               </div>
               <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
            </div>
            <div>
               <h3 className="text-white font-bold text-lg leading-tight">Agent Moussa</h3>
               <p className="text-indigo-400 text-xs font-medium flex items-center gap-1">
                  <Sparkles size={10} />
                  IA Active (Gemini)
               </p>
            </div>
         </div>
         <button className="p-2 rounded-full hover:bg-white/10 text-white/50 transition-colors">
            <MoreVertical size={20} />
         </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
         {messages.map((msg) => (
            <div 
               key={msg.id} 
               className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
               <div className={`flex max-w-[85%] md:max-w-[70%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg mt-auto mb-1 overflow-hidden">
                     {msg.role === 'user' ? (
                        <div className="w-full h-full bg-orange-600 flex items-center justify-center text-xs">Moi</div>
                     ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                           <Bot size={14} className="text-white" />
                        </div>
                     )}
                  </div>

                  {/* Bubble */}
                  <div 
                     className={`p-4 rounded-2xl text-sm leading-relaxed shadow-md backdrop-blur-md border ${
                        msg.role === 'user' 
                           ? 'bg-orange-600 text-white rounded-br-none border-orange-500/50' 
                           : 'bg-[#1a1a2e]/80 text-white/90 rounded-bl-none border-white/10'
                     }`}
                  >
                     {msg.content}
                  </div>
               </div>
            </div>
         ))}
         
         {isTyping && (
            <div className="flex justify-start w-full">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                     <Bot size={14} className="text-white" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-[#1a1a2e]/80 border border-white/10 flex gap-1.5 items-center">
                     <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"></span>
                     <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce delay-75"></span>
                     <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce delay-150"></span>
                  </div>
               </div>
            </div>
         )}
         <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black/80 backdrop-blur-xl border-t border-white/10 pb-8 md:pb-4">
         <div className="relative flex items-end gap-2 bg-white/5 border border-white/10 rounded-[24px] p-2 focus-within:border-indigo-500/50 focus-within:bg-white/10 transition-all">
            <textarea
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}
               onKeyDown={handleKeyPress}
               placeholder="Posez une question à Moussa..."
               className="w-full bg-transparent text-white placeholder-white/30 text-sm p-3 max-h-32 min-h-[44px] resize-none focus:outline-none custom-scrollbar"
               rows={1}
            />
            <button 
               onClick={handleSendMessage}
               disabled={!inputValue.trim()}
               className={`p-3 rounded-full shrink-0 transition-all duration-300 ${
                  inputValue.trim() 
                     ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:scale-105' 
                     : 'bg-white/10 text-white/30 cursor-not-allowed'
               }`}
            >
               <Send size={18} className={inputValue.trim() ? "translate-x-0.5 translate-y-[-1px]" : ""} />
            </button>
         </div>
      </div>
    </div>
  );
};

export default AgentMoussa;