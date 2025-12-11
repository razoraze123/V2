import React from 'react';
import { ArrowRight, Lock, Mail } from 'lucide-react';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-midnight relative overflow-hidden p-6">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 bg-noise pointer-events-none">
         <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-orange-600/10 rounded-full filter blur-[100px] animate-blob"></div>
         <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-blue-900/20 rounded-full filter blur-[100px] animate-blob animation-delay-2000"></div>
      </div>

      <div className="spatial-glass w-full max-w-md p-8 md:p-12 rounded-[30px] relative z-10 border border-white/10 shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Flux<span className="text-orange-500">.</span></h1>
          <p className="text-white/50">Gestion financière professionnelle</p>
        </div>

        <div className="space-y-6">
          <button 
            onClick={onLogin}
            className="w-full py-3.5 px-4 rounded-xl bg-white text-midnight font-bold flex items-center justify-center gap-3 hover:bg-orange-50 transition-colors shadow-lg"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            <span>Continuer avec Google</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="h-[1px] bg-white/10 flex-1"></div>
            <span className="text-xs text-white/30 uppercase tracking-widest">ou email</span>
            <div className="h-[1px] bg-white/10 flex-1"></div>
          </div>

          <div className="space-y-4">
            <div className="relative group">
               <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5 group-focus-within:text-orange-500 transition-colors" />
               <input 
                 type="email" 
                 placeholder="Adresse email" 
                 className="glass-input w-full py-4 pl-12 pr-4 rounded-xl text-sm placeholder-white/30"
               />
            </div>
            <div className="relative group">
               <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5 group-focus-within:text-orange-500 transition-colors" />
               <input 
                 type="password" 
                 placeholder="Mot de passe" 
                 className="glass-input w-full py-4 pl-12 pr-4 rounded-xl text-sm placeholder-white/30"
               />
            </div>
          </div>

          <button 
            onClick={onLogin}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold shadow-[0_5px_20px_rgba(255,107,0,0.3)] hover:shadow-[0_8px_30px_rgba(255,107,0,0.4)] hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2"
          >
            <span>Se connecter</span>
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="mt-8 text-center text-sm">
           <a href="#" className="text-white/40 hover:text-orange-400 transition-colors">Mot de passe oublié ?</a>
        </div>
      </div>
    </div>
  );
};

export default Auth;