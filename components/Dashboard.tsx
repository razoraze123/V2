import React, { useEffect, useState } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, TrendingUp, ChevronRight, Wallet, LayoutGrid,
  CarFront, UtensilsCrossed, AppWindow, Laptop, Building2, MoreHorizontal,
  Briefcase, ShoppingBag, RefreshCw, Gem,
  Megaphone, Users, Plane, Wrench, Wifi, Landmark, GraduationCap
} from 'lucide-react';
import { ViewState, Transaction } from '../types';
import { transactionService, formatCurrency } from '../services/mockData';

interface DashboardProps {
  onNavigate: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
    recentTransactions: [] as Transaction[],
    expenseDistribution: [] as { category: string; amount: number; percentage: number; color: string }[]
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulation User Name (dans un vrai app, viendrait du contexte)
  const userName = "Flux";

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      const data = await transactionService.getDashboardStats();
      setStats(data);
      setIsLoading(false);
    };
    loadStats();
  }, []);

  const getIconForCategory = (cat: string) => {
    const map: Record<string, React.ReactNode> = {
      // Dépenses
      'Transport': <CarFront size={16} />,
      'Repas': <UtensilsCrossed size={16} />,
      'Logiciel': <AppWindow size={16} />,
      'Matériel': <Laptop size={16} />,
      'Bureau': <Building2 size={16} />,
      'Marketing': <Megaphone size={16} />,
      'Salaires': <Users size={16} />,
      'Voyage': <Plane size={16} />,
      'Maintenance': <Wrench size={16} />,
      'Internet': <Wifi size={16} />,
      'Impôts': <Landmark size={16} />,
      'Formation': <GraduationCap size={16} />,
      
      // Recettes
      'Prestation': <Briefcase size={16} />,
      'Vente': <ShoppingBag size={16} />,
      'Retainer': <RefreshCw size={16} />,
      'Dividendes': <Gem size={16} />,
      
      // Fallback
      'Autre': <MoreHorizontal size={16} />,
    };
    return map[cat] || <LayoutGrid size={16} />;
  };

  // --- SVG DONUT CHART CALCULATIONS ---
  const size = 180;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  let currentOffset = 0;
  const chartSegments = stats.expenseDistribution.map(item => {
    const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -currentOffset;
    currentOffset += (item.percentage / 100) * circumference;
    return { ...item, strokeDasharray, strokeDashoffset };
  });

  // --- SVG AREA CHART (Trend) ---
  const AreaChart = () => {
    // Mock data points for the trend
    const dataPoints = [40, 55, 45, 70, 65, 85, 80];
    const width = 300;
    const height = 60;
    const max = Math.max(...dataPoints);
    const min = Math.min(...dataPoints);
    
    // Normalize points to SVG coordinates
    const points = dataPoints.map((val, i) => {
        const x = (i / (dataPoints.length - 1)) * width;
        const y = height - ((val - min) / (max - min)) * height;
        return `${x},${y}`;
    });

    const pathD = `M0,${height} L${points.join(' L')} L${width},${height} Z`;
    const strokePath = `M${points.join(' L')}`;

    return (
       <div className="w-full h-16 mt-4 overflow-hidden opacity-80">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full preserve-3d">
             <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="rgba(255, 107, 0, 0.3)" />
                   <stop offset="100%" stopColor="rgba(255, 107, 0, 0)" />
                </linearGradient>
             </defs>
             <path d={pathD} fill="url(#areaGradient)" />
             <path d={strokePath} fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
       </div>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-lg mx-auto space-y-8 pb-24">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between px-2 animate-pulse">
           <div className="space-y-2">
              <div className="h-7 w-40 bg-white/10 rounded-lg"></div>
              <div className="h-4 w-24 bg-white/5 rounded-md"></div>
           </div>
           <div className="h-10 w-10 rounded-full bg-white/10 border border-white/5"></div>
        </div>

        {/* Hero Card Skeleton */}
        <div className="h-[280px] rounded-[30px] bg-white/5 border border-white/5 animate-pulse flex flex-col items-center justify-center p-8 space-y-6">
           <div className="h-24 w-24 rounded-full bg-white/5"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-8 pb-24">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between px-2">
        <div>
           <h1 className="text-2xl font-bold text-white">Bonjour, {userName}</h1>
           <p className="text-white/40 text-sm">Aperçu de vos finances</p>
        </div>
        <div className="p-2 rounded-full bg-white/5 border border-white/10">
          <TrendingUp className="text-orange-500" size={20} />
        </div>
      </div>

      {/* HERO CARD - BALANCE */}
      <div className="relative group">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-amber-600 rounded-[32px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        
        <div className="relative spatial-glass rounded-[30px] p-8 flex flex-col items-center text-center overflow-hidden">
           
           <span className="text-white/50 uppercase tracking-widest text-xs font-semibold mb-2">Trésorerie Actuelle</span>
           <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg tracking-tight">
             {formatCurrency(stats.totalBalance)}
           </h2>

           {/* Trend Chart */}
           <AreaChart />

           <div className="flex gap-3 w-full mt-6">
              <button 
                onClick={() => onNavigate('income')}
                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium text-white flex items-center justify-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
                Recettes
              </button>
              <button 
                onClick={() => onNavigate('expenses')}
                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium text-white flex items-center justify-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
                Dépenses
              </button>
           </div>
        </div>
      </div>

      {/* MONTHLY PERFORMANCE GRID */}
      <div className="space-y-4">
        <h3 className="text-white font-bold text-lg px-2">Ce mois-ci</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Income Card */}
          <div onClick={() => onNavigate('income')} className="spatial-glass rounded-[24px] p-5 cursor-pointer hover:bg-white/5 transition-colors group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-full bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                <ArrowUpRight size={20} />
              </div>
              <span className="text-xs text-white/30">Entrées</span>
            </div>
            <p className="text-lg font-bold text-white truncate">{formatCurrency(stats.monthlyIncome)}</p>
          </div>

          {/* Expense Card */}
          <div onClick={() => onNavigate('expenses')} className="spatial-glass rounded-[24px] p-5 cursor-pointer hover:bg-white/5 transition-colors group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-full bg-orange-500/10 text-orange-400 group-hover:scale-110 transition-transform">
                <ArrowDownRight size={20} />
              </div>
              <span className="text-xs text-white/30">Sorties</span>
            </div>
            <p className="text-lg font-bold text-white truncate">{formatCurrency(stats.monthlyExpense)}</p>
          </div>
        </div>
      </div>

      {/* EXPENSE DISTRIBUTION (DONUT CHART) */}
      <div className="spatial-glass rounded-[30px] p-8 flex flex-col min-h-[420px] justify-center relative overflow-hidden">
        {/* Background glow for the chart container */}
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none"></div>

        <h3 className="text-white font-bold text-xl mb-8 z-10 text-center w-full">Répartition des Dépenses</h3>
        
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-8 flex-1 z-10 px-2">
           {/* SVG Chart */}
           <div className="relative flex items-center justify-center shrink-0">
             <div style={{ width: size, height: size }} className="relative">
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
                    <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
                    {chartSegments.map((segment, index) => (
                       <circle
                         key={index}
                         cx={size / 2}
                         cy={size / 2}
                         r={radius}
                         fill="none"
                         stroke={segment.color}
                         strokeWidth={strokeWidth}
                         strokeDasharray={segment.strokeDasharray}
                         strokeDashoffset={segment.strokeDashoffset}
                         strokeLinecap="round"
                         className="transition-all duration-1000 ease-out"
                       />
                    ))}
                 </svg>
                 
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xs text-white/40 font-medium mb-1 uppercase tracking-wider">Total</span>
                    <span className="text-3xl font-bold text-white leading-none tracking-tight">
                       {formatCurrency(stats.monthlyExpense).split(' ')[0]} 
                    </span>
                    <span className="text-[10px] text-white/30 font-bold mt-1">FCFA</span>
                 </div>
             </div>
           </div>
           
           {/* Legend */}
           <div className="w-full md:flex-1 space-y-5 md:pl-6">
              {stats.expenseDistribution.map((item, index) => (
                 <div key={index} className="flex items-center justify-between group w-full relative">
                    <div className="flex items-center gap-3 z-10 bg-transparent pr-2">
                       <div className="relative w-3 h-3 shrink-0">
                          <span className="absolute inset-0 rounded-full opacity-50 blur-[2px]" style={{ backgroundColor: item.color }}></span>
                          <span className="absolute inset-0 rounded-full" style={{ backgroundColor: item.color }}></span>
                       </div>
                       <span className="text-sm text-white/80 font-medium">{item.category}</span>
                    </div>
                    <span className="text-sm font-bold text-white pl-4 z-10">{item.percentage}%</span>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;